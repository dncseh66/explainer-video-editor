# 3D explainer project

Separate from the 2D stickman channel style in the parent folder. Everything for this project lives here.

- `STUDY.md` — style study of Jared Owen's "How the Orion Spacecraft works" (0:00–4:42). **Read first.**
- `study/frames/` — overview frames (every 2 s) and close-up animation frames.
- `study/transcript/` — reference script text + timed captions.
- `study/ai_watch_notes.md` — AI watch-through incl. audio notes (unverified second opinion).

## jbl-charge4/ — 10 s pilot (2026-11-17, v2 model from real reference)
- `reference/REFERENCE.md` — specs, chips, exterior + interior layout with sources; product renders + 40 teardown photos
- `script/` script · `voiceover/` narrator VO + word timings · `timing.json` shot list, facts + sources, music cue
- `film/` three.js film (`index.html` + `film.js`, open via a local server to scrub) · `film/render.sh` renders all frames headless and encodes · `film/still.sh <t> [top|front|back|end] out.png` debug still · `film/film_v1.js` = first (inaccurate) model
- `exports/jbl-charge4-10s.mp4` picture only · `final/jbl-charge4-10s.mp4` with voice + music
- Remix after a re-render (from the workspace root):
  `scripts/bin/mix 3d-explainer/jbl-charge4/exports/jbl-charge4-10s.mp4 3d-explainer/jbl-charge4/timing.json 3d-explainer/jbl-charge4/final/jbl-charge4-10s.mp4`
