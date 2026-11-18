// Final mix: animation + voiceover + music bed + one SFX per shot-list event (AVFoundation, nothing to install).
//
// Usage: swift scripts/mix.swift <video.mp4> <presets/timing/<name>.json> <out.mp4>
//
// Reads from the timing JSON:
//   voiceover                      -> full volume from 0 s
//   sound.music_cues[] (one track per story section, with fades) or sound.music.file (+ volume_under_voice, cuts[{at}] = 0.6 s dip to silence)
//   sound.sfx.<key>.file           -> placed at every shots[].events[] whose "sfx" names <key>
//                                     ("pop x3" repeats 3x, 0.12 s apart; "whoosh + thud" plays both)
//   "night amb" / sfx key "night"  -> ambience bed for the whole shot it belongs to
// Missing files are skipped and listed, so the mix works before every asset is downloaded.
import AVFoundation
import Foundation

let a = CommandLine.arguments
guard a.count >= 4 else { print("usage: swift scripts/mix.swift <video.mp4> <timing.json> <out.mp4>"); exit(2) }
let root = FileManager.default.currentDirectoryPath
func url(_ p: String) -> URL { URL(fileURLWithPath: p.hasPrefix("/") ? p : root + "/" + p) }
func fail(_ m: String) -> Never { FileHandle.standardError.write((m + "\n").data(using: .utf8)!); exit(1) }
let videoURL = url(a[1]), outURL = url(a[3])
let J = try! JSONSerialization.jsonObject(with: Data(contentsOf: url(a[2]))) as! [String: Any]
let sound = J["sound"] as? [String: Any] ?? [:]
let sfxDefs = sound["sfx"] as? [String: [String: Any]] ?? [:]
let shots = J["shots"] as? [[String: Any]] ?? []
let fm = FileManager.default
func ts(_ s: Double) -> CMTime { CMTime(seconds: s, preferredTimescale: 48000) }

let sem = DispatchSemaphore(value: 0)
Task {
  do {
    let comp = AVMutableComposition()
    let video = AVURLAsset(url: videoURL)
    let vDur = try await video.load(.duration)
    guard let vTrack = try await video.loadTracks(withMediaType: .video).first else { fail("no video track") }
    let cv = comp.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
    try cv.insertTimeRange(CMTimeRange(start: .zero, duration: vDur), of: vTrack, at: .zero)
    var params: [AVMutableAudioMixInputParameters] = []
    var missing = Set<String>(), placed = 0

    // insert `file` at `at` on a fresh track with volume `vol`; optional max length and ramps
    func place(_ file: String, at: Double, vol: Float, maxLen: Double? = nil, fadeOut: Double = 0, src: Double = 0) async throws -> AVMutableAudioMixInputParameters? {
      guard fm.fileExists(atPath: url(file).path) else { missing.insert(file); return nil }
      let asset = AVURLAsset(url: url(file))
      guard let tr = try await asset.loadTracks(withMediaType: .audio).first else { missing.insert(file); return nil }
      let d = try await asset.load(.duration).seconds
      let room = vDur.seconds - at; if room <= 0.05 { return nil }
      let len = min(d - src, maxLen ?? d, room); if len <= 0.05 { return nil }
      let ct = comp.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)!
      try ct.insertTimeRange(CMTimeRange(start: ts(src), duration: ts(len)), of: tr, at: ts(at))
      let p = AVMutableAudioMixInputParameters(track: ct); p.setVolume(vol, at: .zero)
      if fadeOut > 0 { p.setVolumeRamp(fromStartVolume: vol, toEndVolume: 0, timeRange: CMTimeRange(start: ts(at + len - fadeOut), duration: ts(fadeOut))) }
      params.append(p); placed += 1; return p
    }

    // voice
    if let vo = J["voiceover"] as? String { _ = try await place(vo, at: 0, vol: 1.0) }
    // music: either a list of cues (sound.music_cues[{file, from, to, src?, vol?, fade_in?, fade_out?}]) or one bed
    if let cues = sound["music_cues"] as? [[String: Any]] {
      for c in cues {
        guard let f = c["file"] as? String, !f.isEmpty, let from = c["from"] as? Double, let to = c["to"] as? Double else { continue }
        let v = Float(c["vol"] as? Double ?? 0.16), fi = c["fade_in"] as? Double ?? 0.8, fo = c["fade_out"] as? Double ?? 1.2
        if let p = try await place(f, at: from, vol: v, maxLen: to - from, fadeOut: fo, src: c["src"] as? Double ?? 0), fi > 0 {
          p.setVolumeRamp(fromStartVolume: 0, toEndVolume: v, timeRange: CMTimeRange(start: ts(from), duration: ts(fi)))
        }
      }
    } else if let m = sound["music"] as? [String: Any], let f = m["file"] as? String {
      let v = Float(m["volume_under_voice"] as? Double ?? 0.16)
      if let p = try await place(f, at: 0, vol: v, maxLen: vDur.seconds, fadeOut: 2.5) {
        p.setVolumeRamp(fromStartVolume: 0, toEndVolume: v, timeRange: CMTimeRange(start: .zero, duration: ts(1.2)))
        for c in (m["cuts"] as? [[String: Any]] ?? []) {
          if let at = c["at"] as? Double {
            p.setVolumeRamp(fromStartVolume: v, toEndVolume: 0, timeRange: CMTimeRange(start: ts(at - 0.08), duration: ts(0.08)))
            p.setVolumeRamp(fromStartVolume: 0, toEndVolume: v, timeRange: CMTimeRange(start: ts(at + 0.6), duration: ts(1.4)))
          }
        }
      }
    }
    // sfx
    let vols: [String: Float] = ["pop": 0.45, "whoosh": 0.35, "thud": 0.5, "tick": 0.4, "ding": 0.35, "scratch": 0.6, "scratch4": 0.55, "night": 0.4, "shake": 0.5, "splat": 0.5, "splash": 0.45, "blanket": 0.45]
    for s in shots {
      let st = s["start"] as? Double ?? 0, en = s["end"] as? Double ?? st
      for e in (s["events"] as? [[String: Any]] ?? []) {
        guard let raw = e["sfx"] as? String, !raw.isEmpty, let t = e["t"] as? Double else { continue }
        for part in raw.split(separator: "+") {
          let words = part.trimmingCharacters(in: .whitespaces).split(separator: " ").map(String.init)
          guard let key = words.first, let def = sfxDefs[key], let file = def["file"] as? String else { continue }
          var n = 1
          if let x = words.first(where: { $0.hasPrefix("x") }), let k = Int(x.dropFirst()) { n = min(k, 8) }
          if words.contains("many") { n = 8 }
          if key == "night" { _ = try await place(file, at: st, vol: vols[key] ?? 0.4, maxLen: en - st, fadeOut: 0.6); continue }
          for i in 0..<n { _ = try await place(file, at: max(0, t - 0.03) + Double(i) * 0.12, vol: vols[key] ?? 0.45, maxLen: 2.5, fadeOut: 0.1) }
        }
      }
    }
    let mix = AVMutableAudioMix(); mix.inputParameters = params
    try? fm.removeItem(at: outURL)
    guard let ex = AVAssetExportSession(asset: comp, presetName: AVAssetExportPresetHighestQuality) else { fail("cannot create exporter") }
    ex.outputURL = outURL; ex.outputFileType = .mp4; ex.audioMix = mix
    await ex.export()
    if ex.status != .completed { fail("export failed: \(ex.error?.localizedDescription ?? "unknown")") }
    print(String(format: "wrote %@ (%.2fs), %d audio clips placed", outURL.path, vDur.seconds, placed))
    if !missing.isEmpty { print("missing (skipped): " + missing.sorted().joined(separator: ", ")) }
  } catch { fail("error: \(error.localizedDescription)") }
  sem.signal()
}
sem.wait()
