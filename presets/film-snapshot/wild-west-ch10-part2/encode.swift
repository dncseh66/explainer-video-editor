// JPEG frame sequence -> H.264 MP4 (AVFoundation, nothing to install).
// Usage: swift encode.swift <frames_dir> <fps> <out.mp4> [firstFrame=0] [lastFrame=auto]
import AVFoundation
import CoreGraphics
import ImageIO
import Foundation
let a = CommandLine.arguments
let dir = a[1], fps = Int32(a[2])!, out = URL(fileURLWithPath: a[3])
let fm = FileManager.default
var names = try! fm.contentsOfDirectory(atPath: dir).filter { $0.hasPrefix("f") && $0.hasSuffix(".jpg") }.sorted()
names = names.filter { Int($0.dropFirst().dropLast(4))! < 900000 }
let first = a.count > 4 ? Int(a[4])! : 0
let last = a.count > 5 ? Int(a[5])! : Int(names.last!.dropFirst().dropLast(4))!
try? fm.removeItem(at: out)
let w = try! AVAssetWriter(outputURL: out, fileType: .mp4)
let settings: [String: Any] = [AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: 1920, AVVideoHeightKey: 1080,
  AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 14_000_000, AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel, AVVideoMaxKeyFrameIntervalKey: 60]]
let inp = AVAssetWriterInput(mediaType: .video, outputSettings: settings); inp.expectsMediaDataInRealTime = false
let ad = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: inp, sourcePixelBufferAttributes: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA, kCVPixelBufferWidthKey as String: 1920, kCVPixelBufferHeightKey as String: 1080])
w.add(inp); w.startWriting(); w.startSession(atSourceTime: .zero)
var prev: CGImage? = nil; var missing = 0
for i in first...last {
  let p = dir + String(format: "/f%06d.jpg", i)
  var img: CGImage? = nil
  if let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: p) as CFURL, nil) { img = CGImageSourceCreateImageAtIndex(src, 0, nil) }
  if img == nil { missing += 1; img = prev }
  guard let im = img else { continue }
  prev = im
  while !inp.isReadyForMoreMediaData { usleep(2000) }
  var pb: CVPixelBuffer? = nil
  CVPixelBufferPoolCreatePixelBuffer(nil, ad.pixelBufferPool!, &pb)
  CVPixelBufferLockBaseAddress(pb!, [])
  let ctx = CGContext(data: CVPixelBufferGetBaseAddress(pb!), width: 1920, height: 1080, bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(pb!), space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue)!
  ctx.draw(im, in: CGRect(x: 0, y: 0, width: 1920, height: 1080))
  CVPixelBufferUnlockBaseAddress(pb!, [])
  ad.append(pb!, withPresentationTime: CMTime(value: CMTimeValue(i - first), timescale: fps))
}
inp.markAsFinished()
let sem = DispatchSemaphore(value: 0); w.finishWriting { sem.signal() }; sem.wait()
print("wrote \(out.path) frames \(first)...\(last) missing \(missing) status \(w.status.rawValue) \(w.error?.localizedDescription ?? "")")
