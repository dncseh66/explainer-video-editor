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
5. Final: export MP4 to `exports/`, then `scripts/bin/mux exports/<name>.mp4 output/voiceover/<name>/audio_url.mp3 output/final/<name>.mp4 0 0.35`.

## Sound (Epidemic Sound)
- The `epidemic-sound` MCP server (`.mcp.json`) gives music + SFX search and download; its key is `EPIDEMIC_SOUND_MCP_API_KEY` in `.env`, read by `scripts/es_mcp_headers.sh`. Key expires ~2027-11.
- Pick cues per shot from the shot list's `sfx` field and DIRECTING.md §7; save downloads to `assets/sound/{music,sfx}/` and log each choice in `presets/timing/<name>.json` so it is never searched twice.

## Review feedback tool
- Start: `python3 -I tools/review/server.py 8790` from Bash in the background (the app's launcher can't read this OneDrive folder), then `preview_start` with the `review` config (attaches to http://127.0.0.1:8790). It lists the videos in `output/final/`.
- The user pauses, presses **+ Note here** (or N), draws (pen / arrow / box / circle) and writes what to change; a range is possible with **Set end here**.
- Saved to `feedback/<video>.json`: each note has `t`, `t_end`, `shot` (id from the timing JSON), `vo`, `cat`, `text`, `drawing` (vector strokes in 1920×1080 coords), `image` (`feedback/<video>/<id>.png` = the exact frame + drawing, full size), `status` (open/done/wontfix).
- Applying ("apply the feedback"): read every `open` note, LOOK at its `image`, find the shot in `presets/film-snapshot/<film>/src/` (scene id = `shot`; camera cuts live in `F.CUTS`), make the change, re-render + mix, then set `status: "done"` and a one-line `reply` saying what changed (or `wontfix` + reason). The page shows replies within ~4 s.
