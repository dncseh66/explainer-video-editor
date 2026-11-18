// Joins voice segments into one track: each file starts at its given offset (seconds).
// Usage: scripts/bin/vo_concat <out.m4a> <file1>@<offset1> <file2>@<offset2> ...
// Built with: swiftc -O scripts/vo_concat.swift -o scripts/bin/vo_concat
import AVFoundation
import Foundation

let a = CommandLine.arguments
guard a.count >= 3 else { print("usage: vo_concat <out.m4a> <file>@<offset> ..."); exit(2) }
func fail(_ m: String) -> Never { FileHandle.standardError.write((m + "\n").data(using: .utf8)!); exit(1) }
let out = URL(fileURLWithPath: a[1])
let sem = DispatchSemaphore(value: 0)
Task {
  do {
    let comp = AVMutableComposition()
    let track = comp.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)!
    for arg in a.dropFirst(2) {
      guard let at = arg.lastIndex(of: "@"), let off = Double(arg[arg.index(after: at)...]) else { fail("bad segment: \(arg)") }
      let asset = AVURLAsset(url: URL(fileURLWithPath: String(arg[..<at])))
      guard let tr = try await asset.loadTracks(withMediaType: .audio).first else { fail("no audio in \(arg)") }
      let d = try await asset.load(.duration)
      try track.insertTimeRange(CMTimeRange(start: .zero, duration: d), of: tr, at: CMTime(seconds: off, preferredTimescale: 48000))
    }
    try? FileManager.default.removeItem(at: out)
    guard let ex = AVAssetExportSession(asset: comp, presetName: AVAssetExportPresetAppleM4A) else { fail("no exporter") }
    ex.outputURL = out; ex.outputFileType = .m4a
    await ex.export()
    if ex.status != .completed { fail("export failed: \(ex.error?.localizedDescription ?? "?")") }
    print("wrote \(out.path)")
  } catch { fail("error: \(error.localizedDescription)") }
  sem.signal()
}
sem.wait()
