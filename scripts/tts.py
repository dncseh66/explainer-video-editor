#!/usr/bin/env python3
"""Cached voiceover generation through ai33 (v3 text-to-speech).

Usage:
  python3 -I scripts/tts.py scripts_text/the-saw.txt            # uses presets/voice/narrator.json
  python3 -I scripts/tts.py scripts_text/the-saw.txt --voice narrator --name the-saw

Dialogue: if the script has lines like "ORDERLY: Burn these?", narration and each
spoken line are generated separately (narration in --voice, each speaker in its own
preset from presets/voice/), then joined into one track with short pauses:
  output/voiceover/<name>/audio_url.m4a   joined voice track
  output/voiceover/<name>/json_url.json   word timings on the joined timeline (+ "speaker")
  output/voiceover/<name>/lines.json      one entry per segment: speaker, voice, start, end, text
Map speakers to presets with a header line:  # cast: ORDERLY=young-man, NICOLLE=old-man
(otherwise the lowercased speaker name must be a preset name). Other "#" lines are ignored.

Cost saving: the result is cached under cache/tts/<hash>/ where the hash covers
the exact text + voice_id + speed. Re-running with an unchanged script spends
no credits; it just re-copies the cached files into output/voiceover/<name>/.

The API key is read from .env (AI33_API_KEY) and is never printed.
"""
import argparse, hashlib, json, os, random, shutil, sys, time, uuid
import urllib.request, urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_env():
    # .env locally; in a cloud session the keys come from the environment's variables instead
    env = {k: os.environ[k] for k in ("AI33_API_KEY", "AI33_BASE_URL") if os.environ.get(k)}
    path = os.path.join(ROOT, ".env")
    if os.path.exists(path):
        with open(path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env.setdefault(k.strip(), v.strip())
    if not env.get("AI33_API_KEY"):
        sys.exit("AI33_API_KEY missing (set it in .env or as an environment variable)")
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


import re

GAP = {("n", "d"): 0.30, ("d", "d"): 0.18, ("d", "n"): 0.40, ("n", "n"): 0.25}
LINE = re.compile(r"^([A-Z][A-Z0-9 _.'-]{0,30}):\s*(.+)$")


def load_voice(v):
    return json.load(open(os.path.join(ROOT, "presets", "voice", v + ".json")))


def synth(text, voice, file_name):
    """Generate (or reuse from cache) one TTS clip. Returns (cache dir, hash)."""
    key_src = json.dumps({"text": text, "voice_id": voice["voice_id"], "speed": voice.get("speed", 1)}, sort_keys=True)
    h = hashlib.sha256(key_src.encode()).hexdigest()[:16]
    cdir = os.path.join(ROOT, "cache", "tts", h)
    if os.path.exists(os.path.join(cdir, "task.json")):
        print(f"cache hit {h} ({voice.get('name')}): no credits spent")
        return cdir, h
    env = load_env()
    base, key = env.get("AI33_BASE_URL", "https://api.ai33.pro"), env["AI33_API_KEY"]
    os.makedirs(cdir, exist_ok=True)
    pend = os.path.join(cdir, "pending.json")
    if os.path.exists(pend):  # a paid task already exists for this exact text: resume it, never pay twice
        tid = json.load(open(pend))["task_id"]
        print(f"resuming task {tid} (already paid, not creating a new one)")
        return poll(tid, base, key, cdir, key_src, pend)
    body, ctype = multipart({
        "text": text, "voice_id": voice["voice_id"], "speed": str(voice.get("speed", 1)),
        "with_transcript": "true" if voice.get("with_transcript", True) else "false",
        "file_name": file_name,
    })
    _, raw = request("POST", base + "/v3/text-to-speech", key, body, {"Content-Type": ctype})
    res = json.loads(raw)
    if not res.get("success"):
        sys.exit(f"create failed: {res}")
    tid = res["task_id"]
    json.dump({"task_id": tid, "chars": len(text)}, open(pend, "w"))
    print(f"task {tid} created ({len(text)} chars, {voice.get('name')})")
    return poll(tid, base, key, cdir, key_src, pend)


def poll(tid, base, key, cdir, key_src, pend):
    delay, t0 = 2.0, time.time()
    limit = float(os.environ.get("TTS_WAIT_MIN", "90")) * 60
    while True:
        if time.time() - t0 > limit:
            sys.exit(f"task {tid} still not done after {limit / 60:.0f} min; rerun the same command later: it resumes this task (no new charge)")
        time.sleep(delay)
        _, raw = request("GET", f"{base}/v1/task/{tid}", key)
        task = json.loads(raw)
        st = task.get("status")
        print(f"  status={st} progress={task.get('progress')}")
        if st == "done":
            break
        if st in ("error", "failed"):
            os.remove(pend)  # failed tasks are not charged; allow a fresh attempt
            sys.exit(f"task failed: {task.get('error_message')}")
        delay = min(delay * 1.4, 15)
    meta = task.get("metadata") or {}
    for k, v in meta.items():
        if isinstance(v, str) and v.startswith("http"):
            ext = os.path.splitext(v.split("?")[0])[1] or ".bin"
            download(v, os.path.join(cdir, k + ext))
    task["_request"] = json.loads(key_src)
    json.dump(task, open(os.path.join(cdir, "task.json"), "w"), indent=2)
    print(f"credits used: {task.get('credit_cost')}")
    if os.path.exists(pend): os.remove(pend)
    return cdir, os.path.basename(cdir)


def parse(raw):
    """-> cast dict, list of segments {"kind": "n"|"d", "speaker", "text"}"""
    cast, segs, buf = {}, [], []
    def flush():
        if buf:
            segs.append({"kind": "n", "speaker": "NARRATOR", "text": " ".join(" ".join(buf).split())})
            buf.clear()
    for line in raw.splitlines():
        t = line.strip()
        if t.lower().startswith("# cast:"):
            for pair in t.split(":", 1)[1].split(","):
                if "=" in pair:
                    k, v = pair.split("=", 1)
                    cast[k.strip().upper()] = v.strip()
            continue
        if t.startswith("#"):
            continue
        m = LINE.match(t)
        if m and m.group(1) != "NARRATOR":
            flush()
            segs.append({"kind": "d", "speaker": m.group(1).strip(), "text": m.group(2).strip()})
        elif t:
            buf.append(t)
    flush()
    return cast, segs


def dialogue(segs, cast, narrator, name, odir):
    os.makedirs(os.path.join(odir, "segments"), exist_ok=True)
    t, prev, parts, words, lines, hashes = 0.0, None, [], [], [], []
    for i, sg in enumerate(segs):
        vname = narrator if sg["kind"] == "n" else cast.get(sg["speaker"].upper(), sg["speaker"].lower())
        if not os.path.exists(os.path.join(ROOT, "presets", "voice", vname + ".json")):
            sys.exit(f"no voice preset for speaker {sg['speaker']} (looked for presets/voice/{vname}.json); add '# cast: {sg['speaker']}=<preset>'")
        cdir, h = synth(sg["text"], load_voice(vname), f"{name}-{i:02d}")
        hashes.append(h)
        audio = next(os.path.join(cdir, f) for f in os.listdir(cdir) if f.startswith("audio_url"))
        seg_file = os.path.join(odir, "segments", f"{i:02d}-{sg['speaker'].lower().replace(' ', '-')}" + os.path.splitext(audio)[1])
        shutil.copy2(audio, seg_file)
        tj = json.load(open(os.path.join(cdir, "json_url.json")))[0]
        ws = [w for w in tj.get("words", [])]
        dur = float(tj.get("audio_duration_secs") or (ws[-1]["end"] if ws else 0))
        # trim the silence the TTS leaves at the start/end of each clip out of the spacing
        lead = next((w["start"] for w in ws if w.get("type") == "word"), 0.0)
        tail = dur - next((w["end"] for w in reversed(ws) if w.get("type") == "word"), dur)
        if prev:
            t += max(0.0, GAP[(prev, sg["kind"])] - min(lead, 0.25) - min(tail_prev, 0.35))
        start = t
        parts.append(f"{seg_file}@{start:.3f}")
        for w in ws:
            w = dict(w, start=round(w["start"] + start, 3), end=round(w["end"] + start, 3), speaker=sg["speaker"], voice=vname)
            words.append(w)
        spoken = [w for w in ws if w.get("type") == "word"]
        lines.append({"i": i, "kind": "narration" if sg["kind"] == "n" else "line", "speaker": sg["speaker"], "voice": vname,
                      "start": round(start + (spoken[0]["start"] if spoken else 0), 3),
                      "end": round(start + (spoken[-1]["end"] if spoken else dur), 3), "text": sg["text"]})
        t, prev, tail_prev = start + dur, sg["kind"], tail
    out = os.path.join(odir, "audio_url.m4a")
    tool = os.path.join(ROOT, "scripts", "bin", "vo_concat")
    if os.system(" ".join(["'" + tool + "'", "'" + out + "'"] + ["'" + p + "'" for p in parts])) != 0:
        sys.exit("joining segments failed")
    full = " ".join(sg["text"] for sg in segs)
    json.dump([{"language_code": "eng", "text": full, "words": words, "audio_duration_secs": round(t, 3), "segments": len(segs)}],
              open(os.path.join(odir, "json_url.json"), "w"))
    json.dump(lines, open(os.path.join(odir, "lines.json"), "w"), indent=1)
    print(f"joined {len(segs)} segments, {t:.2f}s -> {out}")
    return hashes


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("script")
    ap.add_argument("--voice", default="narrator")
    ap.add_argument("--name")
    a = ap.parse_args()

    raw = open(a.script, encoding="utf-8").read()
    name = a.name or os.path.splitext(os.path.basename(a.script))[0]
    odir = os.path.join(ROOT, "output", "voiceover", name)
    cast, segs = parse(raw)
    if any(sg["kind"] == "d" for sg in segs):
        h = ",".join(dialogue(segs, cast, a.voice, name, odir))
    else:
        text = " ".join(" ".join(sg["text"] for sg in segs).split())
        cdir, h = synth(text, load_voice(a.voice), name)
        os.makedirs(odir, exist_ok=True)
        for f in os.listdir(cdir):
            shutil.copy2(os.path.join(cdir, f), os.path.join(odir, f))
    log = os.path.join(ROOT, "output", "voiceover", "manifest.jsonl")
    with open(log, "a") as f:
        f.write(json.dumps({"name": name, "hash": h, "voice": a.voice, "at": time.strftime("%Y-%m-%dT%H:%M:%S")}) + "\n")
    print("files:", sorted(os.listdir(odir)))

if __name__ == "__main__":
    main()
