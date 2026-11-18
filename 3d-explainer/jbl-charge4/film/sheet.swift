// Contact sheet: swift sheet.swift <frames_dir> <out.jpg> <cols> <frame> [frame...]
// Tiles are 640x360 with the frame time (30 fps) printed in the corner.
import AppKit
let a = CommandLine.arguments
let dir = a[1], out = a[2], cols = Int(a[3])!
let ids = a[4...].map { Int($0)! }
let tw = 640, th = 360, rows = (ids.count + cols - 1) / cols
let img = NSImage(size: NSSize(width: tw * cols, height: th * rows))
img.lockFocus()
NSColor.black.setFill(); NSRect(x: 0, y: 0, width: tw * cols, height: th * rows).fill()
for (i, f) in ids.enumerated() {
  let p = String(format: "%@/f%06d.jpg", dir, f)
  guard let im = NSImage(contentsOfFile: p) else { continue }
  let x = (i % cols) * tw, y = (rows - 1 - i / cols) * th
  im.draw(in: NSRect(x: x, y: y, width: tw, height: th))
  let s = String(format: "%.2fs", Double(f) / 30.0) as NSString
  s.draw(at: NSPoint(x: x + 8, y: y + 8), withAttributes: [.font: NSFont.boldSystemFont(ofSize: 22), .foregroundColor: NSColor.yellow])
}
img.unlockFocus()
let rep = NSBitmapImageRep(data: img.tiffRepresentation!)!
try! rep.representation(using: .jpeg, properties: [.compressionFactor: 0.85])!.write(to: URL(fileURLWithPath: out))
