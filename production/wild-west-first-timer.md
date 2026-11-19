# Production log — "The First Timer" (Wild West)

Full script ≈ 10,000 words ≈ 55 min of narration at this narrator's pace (~182 words/min), 10 chapters + outro.
Done in parts; each part = its own film in `presets/film-snapshot/` + timing map in `presets/timing/`.

## Cost basis
| Item | How it is paid | Per unit (measured) |
|---|---|---|
| Narration (ai33 → ElevenLabs multilingual v2) | ai33 credits | 2,243 credits for 316 words ≈ **7.1 credits/word** (≈ 1.27 credits/character) |
| Music + SFX (Epidemic Sound) | existing subscription, downloads included | 0 extra |
| Claude Code (Team plan) | subscription, not billed per token | measured as % of the plan's 5-hour / weekly limits |
| Render (headless Chrome + ffmpeg, local Mac) | free | ~70 s render per 106 s of film |
| Cached re-runs (same script + voice) | free | 0 credits |

## Parts
| Part | Content | Film length | Production time (start → final MP4) | Your time | Narration credits | Notes |
|---|---|---|---|---|---|---|
| 1 | Ch. 10 "The Door", first two paragraphs | 1:46 | 2026-11-18 18:18 → 19:41 = **1 h 23 min** | 1 answer (retry ai33) | 2,243 | Also built the reusable Wild West kit (outfits, hats, street, parlor, props, word-timed build). ai33 was down 18:40–19:38; shots were built meanwhile, so the outage added only a few minutes. Render 70 s, mix <1 min. |
| 2 | Ch. 10 rest ("The wallpaper was floral" → "the one who bled") | ~4:00 (est.) | 2026-11-19 10:55 → shots built + checked 11:40 (**45 min**); voice blocked | — | ~5,100 (est., not spent yet) | **Blocked: ai33 account out of credits** (`HTTP 402 insufficient_credits`). 27 shots built on estimated timing; they retime automatically once the voice exists. Claude usage for this part: 5-hour window 6% → 49%, weekly 15% → 20%. |

## Projection for the whole video (≈55 min, ~13 parts of ~4 min)
| Item | Estimate |
|---|---|
| Narration | ≈ 10,000 words × 7.1 ≈ **71,000 ai33 credits** (2,243 spent so far; ~69,000 to go). Re-voicing a changed paragraph costs again. |
| Music + SFX | 0 extra (Epidemic Sound subscription) |
| Claude Code | ≈ 5% of the weekly limit and ≈ 40–45% of a 5-hour window per ~4-min part → whole video ≈ 60–70% of one week's limit, spread over ~6 five-hour windows |
| Production time | ≈ 45–60 min per ~4-min part (+ ~2 min render/mix) → ≈ **11–14 h** of production; with the 5-hour windows, realistically **3–4 days** |
| Your time | review each part (~5 min) + answers to occasional questions |

## Since then (2026-11-19)
- ai33 topped up. Full script (9,763 words) submitted as one job at ~11:50: task `37afb29f-7162-4daf-b58f-e354473ad90a`, est. ~69,300 credits. Local polling was stopped on request; the job continues on ai33's side.
- Chapter 9 (30 shots, ~7 min estimated) built 11:50 → 12:25 (~35 min), not yet frame-checked.
