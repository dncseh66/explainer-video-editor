# Channel animation workspace — read this first

Dark/curious history explainers narrated over flat, clean, hand-inked cartoon scenes with white round-headed stickmen.
Full visual rules: `presets/style/STYLE.md` (read it before drawing anything). Reference frames: `presets/style/reference/`.
Characters: always build them with the kit in `presets/characters/person.js` (`W.person`), never draw a new body style.
Directing (script → shots, timing, devices, sound, violence handling, retention): `presets/style/DIRECTING.md` — follow its §2 procedure and write a shot list before building any film.
Scenes, props, infographics and colour moods: `presets/style/SCENES.md` + `presets/scenes/scenes.js` (`W.MOODS`, `W.bg`, `W.prop`, `W.info`). Pick a mood per scene from that guide.

## Hard rules
- Every person has the SAME big, perfectly round WHITE head with a thin dark outline. Traits (hair, beard, hats, age, clothes) are added on top; the head is never tinted, shaded or given a nose/ears.
- Faces: two small black vertical-oval eyes, tiny mouth. Expression comes from mouth, eye shape and a few brows only.
- Limbs: thin BLACK stick limbs by default (`limbs:'stick'`, decided 2026-11-12). Peach skin limbs (`limbs:'skin'`) only for close-ups of bare bodies.
- Hands and feet: WHITE with the thin outline (round hands, oval feet; 4-finger cartoon hands in close-ups). Never black balls.
- One clean dark outline weight everywhere (~R/20 of head radius); flat fills with at most one soft shade tone. No gradients on characters.
- Gore stays stylised: a coral/red shape for a wound, never realistic blood or bodies opened. Violence happens off screen (cut away, silhouette, sound).
- Captions/labels: hand-lettered ALL CAPS with thin leader lines, written on the scene (not in boxes) for infographics.

## Workflow (cheap + cached)
1. Script → `scripts_text/<name>.txt`.
2. Voice: `python3 -I scripts/tts.py scripts_text/<name>.txt --voice narrator` (cached by text+voice+speed; reruns are free). Key lives only in `.env`. Dialogue lines (`SPEAKER: line` + `# cast: SPEAKER=preset`) get their own character voices and are joined into `audio_url.m4a` — see DIRECTING.md §14.
3. Time scenes to `output/voiceover/<name>/json_url.json` word starts; save the map in `presets/timing/<name>.json`.
4. Build the Motion film; keep a copy of its modules in `presets/film-snapshot/` after every change.
5. Final: render the silent MP4 with `python3 -I scripts/render.py presets/film-snapshot/<film> exports/<name>.mp4` (headless Chrome → frames → encode), then `scripts/bin/mix exports/<name>.mp4 presets/timing/<name>.json output/final/<name>.mp4` (voice + music + SFX) or `scripts/bin/mux exports/<name>.mp4 output/voiceover/<name>/audio_url.mp3 output/final/<name>.mp4 0 0.35` (voice only).

## Cloud sessions (Linux)
- The repo is github.com/dncseh66/explainer-video-editor (private). `.env`, `cache/`, `exports/`, `output/final/` and all `.mp4` are git-ignored; keys come from the cloud environment's variables (`AI33_API_KEY`, `EPIDEMIC_SOUND_MCP_API_KEY`), which `scripts/tts.py` and `scripts/es_mcp_headers.sh` read before `.env`.
- `.claude/settings.json` runs `scripts/cloud_setup.sh` at session start in the cloud (installs ffmpeg + headless Chromium). `scripts/bin/{mix,mux,vo_concat,encode}` use the Swift builds in `scripts/bin/mac/` on a Mac and `scripts/av.py` (ffmpeg) elsewhere — same arguments.
- Finished videos are not in git: when a cloud session finishes a film, commit only the source (snapshot, timing, scripts) and hand the MP4 back as a download, or keep rendering finals locally.

## Wild West film ("The First Timer", in progress 2026-11-19)
- Script: `scripts_text/wild-west-first-timer-full.txt` (10 chapters, ~9,760 words, ~54 min). Built in parts, one film folder per part in `presets/film-snapshot/wild-west-*/`; order + voice in `presets/timing/wild-west-parts.json`. Time/cost log: `production/wild-west-first-timer.md`.
- Shared kit: `presets/film-snapshot/wild-west-first-timer-2min/src/film-kit.js` (cast `F.CAST`, `W.NARRATOR_WEST`, street/parlor/saloon sets, props, `F.scn` scene helper, `F.chapterTitle`). Each part has `film.json` (name + kit path), `src/scenes.src.js`, `src/shots.py` (shot list + sound cues).
- Scenes are timed by SCRIPT WORD NUMBER: marker `//@scene <id> <wordIndex>`, `F.T(i)` = start of word i. `python3 -I build.py` aligns the part's script to the voiceover (or to its slice of the full voiceover, cut with ffmpeg) and writes modules, `scene-times.json` and `presets/timing/<part>.json`. Without a voiceover it estimates timing so shots can be built first.
- Popping (`W.pop`/`F.poofAt`) a `<g>` that has a `transform` attribute wipes its position: put the class on an outer `<g>` (the kit's `F.G` does this).
- Full narration was submitted to ai33 on 2026-11-19 as ONE job (task `37afb29f-7162-4daf-b58f-e354473ad90a`, 55,327 chars). `scripts/tts.py` now saves a paid task id in `cache/tts/<hash>/pending.json` and resumes it instead of paying again; on another machine that file is missing, so check the ai33 dashboard before re-running the full script.
- Status: ch.10 part 1 rendered (`output/final/wild-west-first-timer-2min.mp4`, local only); ch.10 part 2 (27 shots) and ch.9 (30 shots) built, waiting for the full voice; chapters 8–1 not started.

## Gotchas (learned 2026-11-18/19)
- ai33 rejects a text with a stretch of ~45+ words without punctuation (`text_missing_punctuation`, no charge): add a comma. `HTTP 402 insufficient_credits` = top up; retrying won't help.
- In a git worktree, `.env` and `cache/` live only in the main checkout: symlink them in before `scripts/tts.py`.
- OneDrive can make a just-written file unreadable for a minute ("Operation timed out"): the Swift `scripts/bin/mix` then fails with a bare error and `av.py` skips it as missing. Re-read the file, then `python3 -I scripts/av.py mix …`.

## Sound (Epidemic Sound)
- The `epidemic-sound` MCP server (`.mcp.json`) gives music + SFX search and download; its key is `EPIDEMIC_SOUND_MCP_API_KEY` in `.env`, read by `scripts/es_mcp_headers.sh`. Key expires ~2027-11.
- Pick cues per shot from the shot list's `sfx` field and DIRECTING.md §7; save downloads to `assets/sound/{music,sfx}/` and log each choice in `presets/timing/<name>.json` so it is never searched twice.

## Review feedback tool
- Start: `python3 -I tools/review/server.py 8790` from Bash in the background (the app's launcher can't read this OneDrive folder), then `preview_start` with the `review` config (attaches to http://127.0.0.1:8790). It lists the videos in `output/final/`.
- The user pauses, presses **+ Note here** (or N), draws (pen / arrow / box / circle) and writes what to change; a range is possible with **Set end here**.
- Saved to `feedback/<video>.json`: each note has `t`, `t_end`, `shot` (id from the timing JSON), `vo`, `cat`, `text`, `drawing` (vector strokes in 1920×1080 coords), `image` (`feedback/<video>/<id>.png` = the exact frame + drawing, full size), `status` (open/done/wontfix).
- Applying ("apply the feedback"): read every `open` note, LOOK at its `image`, find the shot in `presets/film-snapshot/<film>/src/` (scene id = `shot`; camera cuts live in `F.CUTS`), make the change, re-render + mix, then set `status: "done"` and a one-line `reply` saying what changed (or `wontfix` + reason). The page shows replies within ~4 s.
