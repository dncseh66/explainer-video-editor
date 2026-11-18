#!/usr/bin/env python3
"""Local video review tool: timestamped notes + drawings that Claude can read and apply.

Run:  python3 -I tools/review/server.py [port]      (default 8790), then open http://127.0.0.1:8790/
Data: feedback/<video>.json               all notes for output/final/<video>.mp4
      feedback/<video>/<note-id>.png      the frame with your drawing on it (what Claude looks at)
Only binds to 127.0.0.1. Serves videos from output/final/ and exports/ only.
"""
import json, os, re, sys, time, base64
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, unquote

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE = os.path.dirname(os.path.abspath(__file__))
VIDEO_DIRS = {"final": os.path.join(ROOT, "output", "final"), "exports": os.path.join(ROOT, "exports")}
FB = os.path.join(ROOT, "feedback")
NAME = re.compile(r"^[A-Za-z0-9._-]{1,120}$")


def timing_for(name):
    p = os.path.join(ROOT, "presets", "timing", name + ".json")
    if not os.path.exists(p):
        return None
    J = json.load(open(p))
    return {"shots": [{"id": s.get("id"), "start": s.get("start"), "end": s.get("end"), "vo": s.get("vo", "")} for s in J.get("shots", [])]}


class H(BaseHTTPRequestHandler):
    def log_message(self, fmt, *a):
        pass

    def send(self, code, body, ctype="application/json", extra=None):
        if isinstance(body, (dict, list)):
            body = json.dumps(body, ensure_ascii=False).encode()
        elif isinstance(body, str):
            body = body.encode()
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        for k, v in (extra or {}).items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    def file(self, path, ctype):
        size = os.path.getsize(path)
        rng = self.headers.get("Range")
        start, end = 0, size - 1
        if rng:
            m = re.match(r"bytes=(\d*)-(\d*)", rng)
            if m:
                if m.group(1):
                    start = int(m.group(1))
                    if m.group(2):
                        end = min(int(m.group(2)), size - 1)
                elif m.group(2):
                    start = max(0, size - int(m.group(2)))
        length = end - start + 1
        self.send_response(206 if rng else 200)
        self.send_header("Content-Type", ctype)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", str(length))
        if rng:
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.end_headers()
        with open(path, "rb") as f:
            f.seek(start)
            left = length
            try:
                while left > 0:
                    chunk = f.read(min(1 << 20, left))
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    left -= len(chunk)
            except (BrokenPipeError, ConnectionResetError):
                pass

    def do_GET(self):
        u = unquote(urlparse(self.path).path)
        if u in ("/", "/index.html"):
            return self.file(os.path.join(HERE, "index.html"), "text/html; charset=utf-8")
        if u == "/api/videos":
            out = []
            for k, d in VIDEO_DIRS.items():
                if os.path.isdir(d):
                    for f in sorted(os.listdir(d)):
                        if f.endswith(".mp4"):
                            out.append({"dir": k, "name": f[:-4], "mtime": os.path.getmtime(os.path.join(d, f))})
            return self.send(200, out)
        m = re.match(r"^/video/(final|exports)/([^/]+)\.mp4$", u)
        if m and NAME.match(m.group(2)):
            p = os.path.join(VIDEO_DIRS[m.group(1)], m.group(2) + ".mp4")
            return self.file(p, "video/mp4") if os.path.exists(p) else self.send(404, {"error": "no video"})
        m = re.match(r"^/api/feedback/([^/]+)$", u)
        if m and NAME.match(m.group(1)):
            p = os.path.join(FB, m.group(1) + ".json")
            data = json.load(open(p)) if os.path.exists(p) else {"video": m.group(1), "notes": []}
            data["timing"] = timing_for(m.group(1))
            return self.send(200, data)
        m = re.match(r"^/feedback/([^/]+)/([^/]+\.png)$", u)
        if m and NAME.match(m.group(1)) and NAME.match(m.group(2)):
            p = os.path.join(FB, m.group(1), m.group(2))
            return self.file(p, "image/png") if os.path.exists(p) else self.send(404, {"error": "no image"})
        self.send(404, {"error": "not found"})

    def do_POST(self):
        u = unquote(urlparse(self.path).path)
        m = re.match(r"^/api/feedback/([^/]+)$", u)
        if not (m and NAME.match(m.group(1))):
            return self.send(404, {"error": "not found"})
        name = m.group(1)
        n = int(self.headers.get("Content-Length") or 0)
        if n > 60 * 1024 * 1024:
            return self.send(413, {"error": "too big"})
        body = json.loads(self.rfile.read(n) or b"{}")
        os.makedirs(os.path.join(FB, name), exist_ok=True)
        notes = body.get("notes", [])
        for note in notes:
            if not NAME.match(str(note.get("id", ""))):
                return self.send(400, {"error": "bad note id"})
            img = note.pop("image_data", None)  # data:image/png;base64,... (frame + drawing), only sent when changed
            if img and img.startswith("data:image/png;base64,"):
                fn = note["id"] + ".png"
                with open(os.path.join(FB, name, fn), "wb") as f:
                    f.write(base64.b64decode(img.split(",", 1)[1]))
                note["image"] = f"feedback/{name}/{fn}"
        # remove images of deleted notes
        keep = {n["id"] + ".png" for n in notes}
        for f in os.listdir(os.path.join(FB, name)):
            if f.endswith(".png") and f not in keep:
                os.remove(os.path.join(FB, name, f))
        data = {"video": name, "updated": time.strftime("%Y-%m-%dT%H:%M:%S"), "notes": notes}
        tmp = os.path.join(FB, name + ".json.tmp")
        json.dump(data, open(tmp, "w"), indent=1, ensure_ascii=False)
        os.replace(tmp, os.path.join(FB, name + ".json"))
        self.send(200, {"ok": True, "count": len(notes)})


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8790
    os.makedirs(FB, exist_ok=True)
    print(f"review tool on http://127.0.0.1:{port}/", flush=True)
    ThreadingHTTPServer(("127.0.0.1", port), H).serve_forever()
