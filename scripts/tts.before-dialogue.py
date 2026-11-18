#!/usr/bin/env python3
"""Cached voiceover generation through ai33 (v3 text-to-speech).

Usage:
  python3 -I scripts/tts.py scripts_text/the-saw.txt            # uses presets/voice/narrator.json
  python3 -I scripts/tts.py scripts_text/the-saw.txt --voice narrator --name the-saw

Cost saving: the result is cached under cache/tts/<hash>/ where the hash covers
the exact text + voice_id + speed. Re-running with an unchanged script spends
no credits; it just re-copies the cached files into output/voiceover/<name>/.

The API key is read from .env (AI33_API_KEY) and is never printed.
"""
import argparse, hashlib, json, os, random, shutil, sys, time, uuid
import urllib.request, urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_env():
    env = {}
    path = os.path.join(ROOT, ".env")
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip()
    if not env.get("AI33_API_KEY"):
        sys.exit("AI33_API_KEY missing in .env")
    return env


def request(method, url, key, body=None, headers=None, attempt=0):
    h = {"xi-api-key": key, "User-Agent": "video-editor-pipeline/1.0"}
    h.update(headers or {})
    req = urllib.request.Request(url, data=body, method=method, headers=h)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        retryable = e.code == 429 or (e.code == 503)
        if retryable and attempt < 6:
            wait = float(e.headers.get("Retry-After") or 0) or (2 ** attempt)
            time.sleep(wait + random.random())
            return request(method, url, key, body, headers, attempt + 1)
        sys.exit(f"HTTP {e.code} on {method} {url.split('?')[0]}: {e.read()[:500].decode(errors='replace')}")


def multipart(fields):
    b = uuid.uuid4().hex
    out = b""
    for k, v in fields.items():
        out += f"--{b}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode()
    out += f"--{b}--\r\n".encode()
    return out, f"multipart/form-data; boundary={b}"


def download(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": "video-editor-pipeline/1.0"})
    with urllib.request.urlopen(req, timeout=300) as r, open(dest, "wb") as f:
        shutil.copyfileobj(r, f)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("script")
    ap.add_argument("--voice", default="narrator")
    ap.add_argument("--name")
    a = ap.parse_args()

    text = " ".join(open(a.script, encoding="utf-8").read().split())
    voice = json.load(open(os.path.join(ROOT, "presets", "voice", a.voice + ".json")))
    name = a.name or os.path.splitext(os.path.basename(a.script))[0]
    key_src = json.dumps({"text": text, "voice_id": voice["voice_id"], "speed": voice.get("speed", 1)}, sort_keys=True)
    h = hashlib.sha256(key_src.encode()).hexdigest()[:16]
    cdir = os.path.join(ROOT, "cache", "tts", h)
    odir = os.path.join(ROOT, "output", "voiceover", name)

    if os.path.exists(os.path.join(cdir, "task.json")):
        print(f"cache hit {h}: no credits spent")
    else:
        env = load_env()
        base, key = env.get("AI33_BASE_URL", "https://api.ai33.pro"), env["AI33_API_KEY"]
        body, ctype = multipart({
            "text": text, "voice_id": voice["voice_id"], "speed": str(voice.get("speed", 1)),
            "with_transcript": "true" if voice.get("with_transcript", True) else "false",
            "file_name": name,
        })
        _, raw = request("POST", base + "/v3/text-to-speech", key, body, {"Content-Type": ctype})
        res = json.loads(raw)
        if not res.get("success"):
            sys.exit(f"create failed: {res}")
        tid = res["task_id"]
        print(f"task {tid} created ({len(text)} chars)")
        delay = 2.0
        while True:
            time.sleep(delay)
            _, raw = request("GET", f"{base}/v1/task/{tid}", key)
            task = json.loads(raw)
            st = task.get("status")
            print(f"  status={st} progress={task.get('progress')}")
            if st == "done":
                break
            if st in ("error", "failed"):
                sys.exit(f"task failed: {task.get('error_message')}")
            delay = min(delay * 1.4, 10)
        os.makedirs(cdir, exist_ok=True)
        meta = task.get("metadata") or {}
        for k, v in meta.items():
            if isinstance(v, str) and v.startswith("http"):
                ext = os.path.splitext(v.split("?")[0])[1] or ".bin"
                download(v, os.path.join(cdir, k + ext))
        task["_request"] = json.loads(key_src)
        json.dump(task, open(os.path.join(cdir, "task.json"), "w"), indent=2)
        print(f"credits used: {task.get('credit_cost')}")

    os.makedirs(odir, exist_ok=True)
    for f in os.listdir(cdir):
        shutil.copy2(os.path.join(cdir, f), os.path.join(odir, f))
    log = os.path.join(ROOT, "output", "voiceover", "manifest.jsonl")
    with open(log, "a") as f:
        f.write(json.dumps({"name": name, "hash": h, "voice": a.voice, "at": time.strftime("%Y-%m-%dT%H:%M:%S")}) + "\n")
    print("files:", sorted(os.listdir(odir)))


if __name__ == "__main__":
    main()
