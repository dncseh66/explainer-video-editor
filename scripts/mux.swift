// Lay a voiceover under an exported animation, using macOS's built-in AVFoundation (no installs).
//
// Usage:
//   swift scripts/mux.swift <video.mp4> <voice.mp3> <out.mp4> [voiceStartSeconds=0] [musicVolume=0.35]
//
// - Keeps the animation's own score/effects (if the export has sound) at musicVolume (0 = drop it).
// - Voice plays at full volume from voiceStartSeconds.
// - The result is as long as the video; any voice past the end is cut.
import AVFoundation
import Foundation

let a = CommandLine.arguments
guard a.count >= 4 else {
    print("usage: swift scripts/mux.swift <video.mp4> <voice.mp3> <out.mp4> [voiceStart=0] [musicVolume=0.35]")
    exit(2)
}
let videoURL = URL(fileURLWithPath: a[1]), voiceURL = URL(fileURLWithPath: a[2]), outURL = URL(fileURLWithPath: a[3])
let voiceStart = a.count > 4 ? Double(a[4]) ?? 0 : 0
let musicVolume = Float(a.count > 5 ? Double(a[5]) ?? 0.35 : 0.35)

func fail(_ m: String) -> Never { FileHandle.standardError.write((m + "\n").data(using: .utf8)!); exit(1) }

let sem = DispatchSemaphore(value: 0)
Task {
    do {
        let video = AVURLAsset(url: videoURL), voice = AVURLAsset(url: voiceURL)
        let vDur = try await video.load(.duration)
        guard let vTrack = try await video.loadTracks(withMediaType: .video).first else { fail("no video track in \(a[1])") }
        guard let voTrack = try await voice.loadTracks(withMediaType: .audio).first else { fail("no audio track in \(a[2])") }

        let comp = AVMutableComposition()
        let full = CMTimeRange(start: .zero, duration: vDur)
        let cv = comp.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
        try cv.insertTimeRange(full, of: vTrack, at: .zero)
        cv.preferredTransform = try await vTrack.load(.preferredTransform)

        var params: [AVMutableAudioMixInputParameters] = []
        if musicVolume > 0, let mTrack = try await video.loadTracks(withMediaType: .audio).first {
            let cm = comp.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)!
            try cm.insertTimeRange(full, of: mTrack, at: .zero)
            let p = AVMutableAudioMixInputParameters(track: cm); p.setVolume(musicVolume, at: .zero); params.append(p)
        }
        let at = CMTime(seconds: voiceStart, preferredTimescale: 600)
        let voDur = try await voice.load(.duration)
        let room = CMTimeSubtract(vDur, at)
        guard room > .zero else { fail("voice start is past the end of the video") }
        let take = CMTimeMinimum(voDur, room)
        let ca = comp.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)!
        try ca.insertTimeRange(CMTimeRange(start: .zero, duration: take), of: voTrack, at: at)
        let pv = AVMutableAudioMixInputParameters(track: ca); pv.setVolume(1.0, at: .zero); params.append(pv)
        if voDur > room { print(String(format: "note: voice is %.2fs longer than the video and was cut", (voDur - room).seconds)) }

        let mix = AVMutableAudioMix(); mix.inputParameters = params
        try? FileManager.default.removeItem(at: outURL)
        guard let ex = AVAssetExportSession(asset: comp, presetName: AVAssetExportPresetHighestQuality) else { fail("cannot create exporter") }
        ex.outputURL = outURL; ex.outputFileType = .mp4; ex.audioMix = mix
        await ex.export()
        if ex.status != .completed { fail("export failed: \(ex.error?.localizedDescription ?? "unknown")") }
        print(String(format: "wrote %@ (%.2fs)", outURL.path, vDur.seconds))
    } catch { fail("error: \(error.localizedDescription)") }
    sem.signal()
}
sem.wait()
