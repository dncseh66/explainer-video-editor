# Video editor workspace

## Layout
- `.env` — ai33 API key (`AI33_API_KEY`). Private (chmod 600), git-ignored. Never paste it into scripts.
- `scripts_text/` — one `.txt` per video script.
- `presets/voice/` — voice presets (`narrator.json` = ElevenLabs E95b3lkMWHDsKeHJaIcY via ai33).
- `presets/style/channel-style.json` — palette, fonts, character rig, motion rules.
- `presets/film-snapshot/` — latest copy of the animation's code (scenes, rig, base CSS, score).
- `cache/tts/<hash>/` — every generated voiceover, keyed by text + voice + speed.
- `output/voiceover/<name>/` — audio (`audio_url.mp3`), subtitles (`srt_url.srt`), word timings (`json_url.json`).

- `presets/timing/<video>.json` — which voiceover words each scene and gag is timed to.
- `presets/patches/` + `scripts/patch_film.py` — exact, checked edits to saved scene code (cheap retimes without rewriting scenes).

- `CLAUDE.md` + `presets/style/STYLE.md` — the channel style rules (read automatically each session); reference frames in `presets/style/reference/`.
- `presets/characters/person.js` — character kit (`W.person`); preview every combination in `presets/characters/sheet.html`
  (serve it with `python3 -I -m http.server 8765` from that folder and open http://127.0.0.1:8765/sheet.html).

## Make a voiceover
```bash
python3 -I scripts/tts.py scripts_text/the-saw.txt --voice narrator
```
An unchanged script with the same voice and speed is served from the cache, so it costs no credits.
Changing a single word creates a new paid generation, so lock the script before you run it.

## Put the voice under the animation
1. On the animation's page press **Export → MP4** and save it as `exports/the-saw.mp4`.
2. Run:
```bash
scripts/bin/mux exports/the-saw.mp4 output/voiceover/the-saw/audio_url.mp3 output/final/the-saw.mp4 0 0.35
```
Arguments: video, voice, output, voice start (s), music volume (0–1; 0 drops the animation's own sound).
`scripts/bin/mux` is compiled from `scripts/mux.swift` (built-in macOS AVFoundation, nothing to install) on a Mac; on Linux / cloud sessions the same command runs the ffmpeg version in `scripts/av.py`.
