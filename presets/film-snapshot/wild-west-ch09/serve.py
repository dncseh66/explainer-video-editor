#!/usr/bin/env python3
"""Serve this folder and receive rendered frames. Usage: python3 -I serve.py <frames_dir> [port=8770]"""
import http.server, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]; PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8770
os.makedirs(OUT, exist_ok=True)
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=HERE, **k)
    def log_message(self, *a): pass
    def do_POST(self):
        n = int(self.headers.get("Content-Length", 0)); body = self.rfile.read(n)
        if self.path.startswith("/frame/"):
            with open(os.path.join(OUT, "f%06d.jpg" % int(self.path.split("/")[-1])), "wb") as f: f.write(body)
        else:
            print(self.path, body.decode(errors="replace"), flush=True)
        self.send_response(204); self.end_headers()
http.server.ThreadingHTTPServer(("127.0.0.1", PORT), H).serve_forever()
