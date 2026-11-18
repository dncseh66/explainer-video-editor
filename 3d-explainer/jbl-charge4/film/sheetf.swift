// Contact sheet of arbitrary images: swift sheetf.swift <out.jpg> <cols> <tileW> <img> [img...]  (4:3 tiles, file name printed)
import AppKit
let a = CommandLine.arguments
let out = a[1], cols = Int(a[2])!, tw = Int(a[3])!, th = tw * 3 / 4
let files = Array(a[4...]); let rows = (files.count + cols - 1) / cols
let img = NSImage(size: NSSize(width: tw * cols, height: th * rows)); img.lockFocus()
NSColor.black.setFill(); NSRect(x: 0, y: 0, width: tw * cols, height: th * rows).fill()
for (i, f) in files.enumerated() {
  guard let im = NSImage(contentsOfFile: f) else { continue }
  let x = (i % cols) * tw, y = (rows - 1 - i / cols) * th
  im.draw(in: NSRect(x: x, y: y, width: tw, height: th))
  ((f as NSString).lastPathComponent as NSString).draw(at: NSPoint(x: x + 6, y: y + 6), withAttributes: [.font: NSFont.boldSystemFont(ofSize: 18), .foregroundColor: NSColor.yellow, .backgroundColor: NSColor.black])
}
img.unlockFocus()
try! NSBitmapImageRep(data: img.tiffRepresentation!)!.representation(using: .jpeg, properties: [.compressionFactor: 0.85])!.write(to: URL(fileURLWithPath: out))
