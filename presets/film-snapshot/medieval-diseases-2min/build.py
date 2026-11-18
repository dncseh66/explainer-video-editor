#!/usr/bin/env python3
"""Build Motion-format modules for the typhus chapter film.
src/scenes.src.js is split at '//@scene <id> <start> <dur>' markers -> modules/scene-<id>.js.json
shared.js = characters/person.js + scenes/scenes.js + scenes/film-helpers.js + src/film-kit.js
Run: python3 -I build.py"""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
PRE = os.path.dirname(os.path.dirname(HERE))
mod = os.path.join(HERE, "modules"); os.makedirs(mod, exist_ok=True)
def put(name, kind, text):
    json.dump({"kind": kind, "text": text}, open(os.path.join(mod, name + ".json"), "w"), indent=1)
shared = "// Channel kits: characters, scenes, film helpers, typhus film kit.\n" + "\n".join(
    open(os.path.join(PRE, p)).read() for p in ["characters/person.js", "scenes/scenes.js", "scenes/film-helpers.js"]) + "\n" + open(os.path.join(HERE, "src/film-kit.js")).read()
put("shared.js", "js", shared)
src = open(os.path.join(HERE, "src/scenes.src.js")).read()
parts = re.split(r"^//@scene (\S+) (\S+) (\S+)\n", src, flags=re.M)
scenes = []
for i in range(1, len(parts), 4):
    sid, start, dur, body = parts[i], float(parts[i + 1]), float(parts[i + 2]), parts[i + 3]
    put("scene-" + sid + ".js", "js", body.strip() + "\n")
    scenes.append({"id": sid, "name": sid, "dur": dur, "start": start})
t = 0
for s in scenes:
    assert abs(s["start"] - t) < 1e-6, (s["id"], s["start"], t); t = round(t + s["dur"], 3)
css = open(os.path.join(PRE, "film-snapshot/modules/base.css.json")).read()
base = json.loads(css)["text"] + "\n.fade{position:absolute;inset:0;background:#120F0D;opacity:0;pointer-events:none}\n.hand-label{transform-origin:0 50%}\n.cut{display:none!important}\n"
put("base.css", "css", base)
put("scenes.json", "json", json.dumps({"v": 1, "stage": "final", "width": 1920, "height": 1080, "fps": 30, "background": "#F6EDC8",
    "fonts": {"display": {"family": "Patrick Hand SC"}, "sans": {"family": "Inter"}},
    "scenes": [{"id": s["id"], "name": s["name"], "dur": s["dur"]} for s in scenes]}))
print(f"{len(scenes)} scenes, {t:.2f}s")
