#!/usr/bin/env python3
"""Render a film snapshot to a silent MP4 with headless Chrome (works on a Mac and in Linux cloud sessions).

  python3 -I scripts/render.py presets/film-snapshot/<film> exports/<film>.mp4 [--from S] [--to S] [--port 8770]

Starts the film's serve.py, opens render.html?auto=1 in headless Chrome (own profile, no throttling),
waits for every frame to arrive, then encodes them (scripts/bin/encode -> ffmpeg; or encode.swift on a Mac
without ffmpeg). Frames go to <film>/frames/ (git-ignored). Then finish with scripts/bin/mix or scripts/bin/mux.
"""
import argparse, glob, os, platform, shutil, subprocess, sys, tempfile, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def find_chrome():
    cands = [os.environ.get("CHROME", "")]
    if platform.system() == "Darwin":
        cands += ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                  "/Applications/Chromium.app/Contents/MacOS/Chromium"]
    cands += [shutil.which(n) or "" for n in ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "chrome")]
    cands += sorted(glob.glob(os.path.expanduser("~/.cache/ms-playwright/chromium-*/chrome-linux*/chrome")), reverse=True)
    cands += sorted(glob.glob("/root/.cache/ms-playwright/chromium-*/chrome-linux*/chrome"), reverse=True)
    for c in cands:
        if c and os.path.isfile(c) and os.access(c, os.X_OK):
            return c
    sys.exit("No Chrome/Chromium found. Set CHROME=/path/to/chrome or run scripts/cloud_setup.sh")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("film"); ap.add_argument("out")
    ap.add_argument("--from", dest="fr", type=float, default=0); ap.add_argument("--to", type=float)
    ap.add_argument("--port", type=int, default=8770); ap.add_argument("--fps", type=int, default=30)
    a = ap.parse_args()
    film = os.path.abspath(a.film)
    frames = os.path.join(film, "frames")
    shutil.rmtree(frames, ignore_errors=True)
    srv = subprocess.Popen([sys.executable, "-I", os.path.join(film, "serve.py"), frames, str(a.port)],
                           stdout=subprocess.PIPE, text=True, bufsize=1)
    time.sleep(0.8)
    url = "http://127.0.0.1:%d/render.html?auto=1&from=%g" % (a.port, a.fr) + ("&to=%g" % a.to if a.to else "")
    prof = tempfile.mkdtemp(prefix="chrome-render-")
    flags = ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--mute-audio",
             "--hide-scrollbars", "--window-size=1920,1080", "--user-data-dir=" + prof,
             "--disable-background-timer-throttling", "--disable-renderer-backgrounding",
             "--disable-backgrounding-occluded-windows", "--disable-dev-shm-usage"]
    if platform.system() != "Darwin":
        flags.append("--no-sandbox")  # cloud containers run as root
    chrome = subprocess.Popen([find_chrome()] + flags + [url], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    ok = False
    try:
        for line in srv.stdout:  # serve.py prints /log progress lines and /done at the end
            line = line.strip()
            print(line, flush=True)
            if line.startswith("/done"):
                ok = True; break
            if "ERR" in line:
                break
    finally:
        chrome.terminate(); srv.terminate()
        try:
            chrome.wait(5)
        except subprocess.TimeoutExpired:
            chrome.kill()
        shutil.rmtree(prof, ignore_errors=True)
    if not ok:
        sys.exit("render failed")
    out = os.path.abspath(a.out)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    first = round(a.fr * a.fps)
    if shutil.which("ffmpeg"):
        cmd = [os.path.join(ROOT, "scripts", "bin", "encode"), frames, str(a.fps), out, str(first)]
    else:
        cmd = ["swift", os.path.join(film, "encode.swift"), frames, str(a.fps), out, str(first)]
    sys.exit(subprocess.call(cmd))


if __name__ == "__main__":
    main()
