#!/usr/bin/env python3
"""Build Motion-format modules for one part of the Wild West "first timer" film (film.json: name + kit path).
Scenes are timed by SCRIPT WORD NUMBER, not seconds: src/scenes.src.js is split at '//@scene <id> <wordIndex>' markers.
Word times come from output/voiceover/<NAME>/json_url.json (script words aligned to the transcript with difflib, gaps
interpolated); with no voiceover yet they are estimated (~171 wpm) so the film can be built and checked anyway.
shared.js = person.js + scenes.js + film-helpers.js + src/film-kit.js + W.WS/W.WE (word start/end seconds).
Also writes scene-times.json (id, start, end, first words) for presets/timing/<NAME>.json.
Run: python3 -I build.py"""
import difflib, json, os, re
FILM = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "film.json")))
NAME = FILM["name"]
HERE = os.path.dirname(os.path.abspath(__file__))
PRE = os.path.dirname(os.path.dirname(HERE)); ROOT = os.path.dirname(PRE)
mod = os.path.join(HERE, "modules"); os.makedirs(mod, exist_ok=True)
def put(name, kind, text):
    json.dump({"kind": kind, "text": text}, open(os.path.join(mod, name + ".json"), "w"), indent=1)
norm = lambda w: re.sub(r"[^a-z0-9]", "", w.lower())
words = open(os.path.join(ROOT, "scripts_text", NAME + ".txt")).read().split()
PARTS = json.load(open(os.path.join(PRE, "timing", "wild-west-parts.json")))
FULL = os.path.join(ROOT, "output", "voiceover", PARTS["voice"], "json_url.json")
vo = os.path.join(ROOT, "output", "voiceover", NAME, "json_url.json")
WS, WE = [None] * len(words), [None] * len(words)
SLICE = None
def align(ws, tw):
    sm = difflib.SequenceMatcher(None, [norm(w) for w in ws], [norm(w["text"]) for w in tw], autojunk=False)
    S, E = [None] * len(ws), [None] * len(ws)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            S[blk.a + k], E[blk.a + k] = tw[blk.b + k]["start"], tw[blk.b + k]["end"]
    return S, E
if os.path.exists(FULL):  # one long voiceover for the whole film: take this part's slice
    tw = [w for w in json.load(open(FULL))[0]["words"] if w.get("type") == "word"]
    names = [p["name"] for p in PARTS["parts"]]; k = names.index(NAME)
    def first_time(script):  # absolute time of a part's first word (aligned on its first 40 words)
        ws = open(os.path.join(ROOT, script)).read().split()[:40]; S, _ = align(ws, tw); return next(x for x in S if x is not None)
    t0 = first_time(PARTS["parts"][k]["script"]) - PARTS["lead"]
    t1 = first_time(PARTS["parts"][k + 1]["script"]) - PARTS["lead"] if k + 1 < len(names) else tw[-1]["end"] + 1.8
    win = [w for w in tw if t0 - 1 <= w["start"] <= t1 + 1]
    WS, WE = align(words, win)
    WS = [None if x is None else x - t0 for x in WS]; WE = [None if x is None else x - t0 for x in WE]
    SLICE = (round(t0, 3), round(t1, 3))
    tw = [{"start": x["start"] - t0, "end": x["end"] - t0} for x in win]
if SLICE or os.path.exists(vo):
    if not SLICE:
        tw = [w for w in json.load(open(vo))[0]["words"] if w.get("type") == "word"]
        WS, WE = align(words, tw)
    WS[0] = WS[0] if WS[0] is not None else tw[0]["start"]
    if WS[-1] is None: WS[-1], WE[-1] = tw[-1]["start"], tw[-1]["end"]
    i = 0
    while i < len(words):  # interpolate unmatched runs (e.g. "eighteen seventy eight" -> "1878")
        if WS[i] is None:
            j = i
            while WS[j] is None: j += 1
            a, b = WE[i - 1], WS[j]
            for k2 in range(i, j):
                WS[k2] = a + (b - a) * (k2 - i) / (j - i); WE[k2] = a + (b - a) * (k2 - i + 1) / (j - i)
            i = j
        i += 1
    src = "voiceover" + (" slice %.2f-%.2f of %s" % (SLICE[0], SLICE[1], PARTS["voice"]) if SLICE else "")
else:
    t = 0.3
    for i, w in enumerate(words):
        d = 0.12 + 0.045 * len(norm(w)); WS[i], WE[i] = round(t, 3), round(t + d, 3)
        t += d + (0.42 if w[-1] in ".?!" else 0.2 if w[-1] in ",;:" else 0.06)
    src = "ESTIMATE (no voiceover yet)"
END = round(SLICE[1] - SLICE[0], 2) if SLICE else round(WE[-1] + 1.8, 2)
if SLICE:  # cut this part's audio out of the full voiceover
    import subprocess
    od = os.path.join(ROOT, "output", "voiceover", NAME); os.makedirs(od, exist_ok=True)
    full_mp3 = os.path.join(ROOT, "output", "voiceover", PARTS["voice"], "audio_url.mp3")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(SLICE[0]), "-to", str(SLICE[1]), "-i", full_mp3, "-c:a", "libmp3lame", "-q:a", "2", os.path.join(od, "audio_slice.mp3")], check=True)
kit = open(os.path.join(HERE, FILM.get("kit", "src/film-kit.js"))).read()
shared = "// Channel kits: characters, scenes, film helpers, wild west film kit, word timings.\n" + "\n".join(
    open(os.path.join(PRE, p)).read() for p in ["characters/person.js", "scenes/scenes.js", "scenes/film-helpers.js"]) + "\n" + kit + \
    "\nW.WS=" + json.dumps([round(x, 3) for x in WS]) + ";W.WE=" + json.dumps([round(x, 3) for x in WE]) + ";W.END=" + str(END) + ";\n"
put("shared.js", "js", shared)
src_txt = open(os.path.join(HERE, "src/scenes.src.js")).read()
parts = re.split(r"^//@scene (\S+) (\S+)\n", src_txt, flags=re.M)
scenes = []
for i in range(1, len(parts), 3):
    sid, w, body = parts[i], int(parts[i + 1]), parts[i + 2]
    start = 0.0 if not scenes else round(WS[w] - 0.08, 2)
    put("scene-" + sid + ".js", "js", body.strip() + "\n")
    scenes.append({"id": sid, "name": sid, "start": start, "word": w})
for k, s in enumerate(scenes):
    s["end"] = scenes[k + 1]["start"] if k + 1 < len(scenes) else END
    s["dur"] = round(s["end"] - s["start"], 2); assert s["dur"] > 0.3, s
    nxt = scenes[k + 1]["word"] if k + 1 < len(scenes) else len(words)
    s["vo"] = " ".join(words[s["word"]:nxt])
css = open(os.path.join(PRE, "film-snapshot/modules/base.css.json")).read()
base = json.loads(css)["text"] + "\n.fade{position:absolute;inset:0;background:#120F0D;opacity:0;pointer-events:none}\n.hand-label{transform-origin:0 50%}\n.cut{display:none!important}\n"
put("base.css", "css", base)
put("scenes.json", "json", json.dumps({"v": 1, "stage": "final", "width": 1920, "height": 1080, "fps": 30, "background": "#F6EDC8",
    "fonts": {"display": {"family": "Patrick Hand SC"}, "sans": {"family": "Inter"}},
    "scenes": [{"id": s["id"], "name": s["name"], "dur": s["dur"]} for s in scenes]}))
json.dump({"timing_source": src, "end": END, "scenes": [{k: s[k] for k in ("id", "start", "end", "word", "vo")} for s in scenes]},
          open(os.path.join(HERE, "scene-times.json"), "w"), indent=1)
print(f"{len(scenes)} scenes, {END:.2f}s, timing: {src}")

# ---------- timing map + sound for scripts/bin/mix (presets/timing/<NAME>.json), all anchored to script words ----------
T = lambda i: round(WS[i], 2)
sc = {s["id"]: s for s in scenes}
exec(open(os.path.join(HERE, "src/shots.py")).read())
VOF = (f"output/voiceover/{NAME}/audio_slice.mp3" if SLICE else next((f"output/voiceover/{NAME}/audio_url.{e}" for e in ("m4a", "mp3") if os.path.exists(os.path.join(ROOT, f"output/voiceover/{NAME}/audio_url.{e}"))), ""))
timing = {"voiceover": VOF, "timing_source": src, "film_seconds": END, "fps": 30,
          "sound": {"sfx": SFX, "music_cues": CUES, "rules": "SFX only where the sound carries story. Text only for names, places, dates, key numbers."},
          "shots": [{"id": s["id"], "start": s["start"], "end": s["end"], "vo": s["vo"], "mode": SHOTS[s["id"]][0], "device": SHOTS[s["id"]][1], "mood": SHOTS[s["id"]][2],
                     "events": [{"word": words[w].strip(".,"), "w": w, "t": T(w), "do": d, "sfx": x} for (w, d, x) in SHOTS[s["id"]][3]]} for s in scenes]}
json.dump(timing, open(os.path.join(PRE, "timing", NAME + ".json"), "w"), indent=1)
