# Directing guide — turning a script into animated shots

Studied: the reference channel video (youtube XljxcQumyqE), 0:00–8:00, shot by shot. This is how I direct every video for this channel.
Drawing rules live in STYLE.md (characters) and SCENES.md (backgrounds, props, infographics). This file is about WHAT to show, WHEN, and HOW it moves.

---

## 1. Why the reference works (the director's read)
1. **Every sentence gets a picture, and every key word gets an event.** Nothing on screen is decoration. When the narrator says "Pope", the Pope is there; when he says "split", the map splits. The viewer's eye and ear get the same information at the same moment, so the history is easy to follow.
2. **Three visual modes, rotated:** a **map/diagram** for facts (where, when, how many), a **scene with characters** for what it felt like, and a **host reaction** (the narrator figure) for opinion and jokes. Switching mode resets attention.
3. **Bathos:** terrible events told with a deadpan modern joke ("I'll get my manager", an emperor fired and handed a bag of money). The humour keeps a grim topic watchable and makes it memorable, without making fun of the victims.
4. **Limited animation, maximum timing:** almost nothing is fully animated. Things *pop* in with a bounce, *slide* in, *fill* with colour, or *hold* while the camera creeps. What sells it is precise timing to the voice plus a sound effect on every event.
5. **Clarity over detail:** one idea per shot, big shapes, few labels, short words on screen (years, names, "1/3 GONE").
6. **A constant sense of progress:** year counters, a timeline scroll that returns between chapters, maps that change state. The viewer always knows where they are in the story.

## 2. Script → shots: the procedure (do this for every script)
1. **Split the script into beats** = one sentence or clause (usually 3–9 s of voice). Average shot ≈ 6–9 s; facts faster (3–5 s), skits slower (10–15 s).
2. **Mark the trigger words** in each beat: nouns (people, places, objects), numbers, dates, verbs of change (split, fell, burned, vanished), and the punchline word. Take their start times from `output/voiceover/<name>/json_url.json`.
3. **Pick the mode** for the beat with the table in §3.
4. **Pick the device** (literal, metaphor, gag, data, reaction) with §4.
5. **Attach one event per trigger word**: appear/pop, fill, move, break, react, count up. The event lands ON the word's start (0–2 frames early; never late).
6. **Choose the cut point**: cut on the first trigger word of the next beat, or on an action (a hit, a drop, a door slam). Never cut mid-word.
7. **Assign sound**: one SFX per event (§7) and the music bed for the section.
8. **Check the rhythm** of the whole section (§6) and the violence rule (§8).
9. Write the shot list in `presets/timing/<name>.json` (template in §10) before building any scene.

## 3. Choosing the mode
| The beat says… | Mode | Our kit |
|---|---|---|
| where / borders / spread / movement of armies or disease | **Map** (fills, arrows, icons moving along routes, heads on the map) | `W.bg.sea` + `W.style.land`, `W.info.pin/arrow` |
| when / how long / sequence | **Timeline scroll** or year counter | scroll prop + HTML year label |
| how many / how big / how fast | **Data insert** (counter, bars, height ruler, icons vanishing "1 in 3") | `W.info.*`, HTML labels |
| how a thing works (device, body, method) | **Diagram / cutaway** on paper | `W.bg.paper`, `W.info.shadowed`, `wound/blob/crack` |
| what people did / how it felt | **Scene** with characters in a place | `W.bg.*` + `W.person` |
| the narrator's opinion, irony, "guess what happened" | **Host reaction**: the monk narrator on a plain or simple background, medium shot | narrator monk preset |
| a historical source / real painting | **Insert** with slow push/pan (Ken Burns) | public-domain image asset |

Rotate modes: never more than ~3 shots in a row of the same mode.

## 4. Choosing the device (how the picture represents the words)
- **Literal** — show exactly what is said (monks copying books by candlelight). Default for actions and places.
- **Literal-taken-too-far (the visual gag)** — act out a figure of speech literally: "reading nearly vanished" → pages fly away from a man reading; "knowledge on life support" → a book on a hospital drip. Use for abstract verbs.
- **Metaphor object** — one object stands for the idea: a chain pulling past frames = "connected stories"; three ingredients (helmet, cross, arm) = "Roman + Christian + barbarian". Keep the object simple and centred.
- **Symbol on a map** — heads, crowns, skulls, ships or crosses popping onto regions; a face on a country that trembles.
- **Data** — counters that tick, icons that disappear, a ruler that grows; numbers are BIG and short ("1/3", "6 FT", "700 LBS").
- **Character reaction** — a cut to the narrator or a bystander whose face says what the viewer should feel (worried, shocked, smug). Use after every big reveal.
- **Skit with dialogue** — 10–15 s mini-scene, 2–3 short speech lines (HTML speech bubbles), modern deadpan phrasing. One skit every ~60–90 s.

## 5. Motion vocabulary (what moves and how)
- **Pop-in**: scale 0 → 1.15 → 1.0 in ~0.25 s (`eob` 1.6), + `pop` SFX. For icons, heads, labels, props.
- **Slide-in**: from off-frame with ease-out (~0.35 s), slight overshoot. Characters entering, Pope "sneaking in".
- **Drop**: falls with gravity, squash on landing (15%), `thud`. Skulls, crowns, money bags, paintings onto a map.
- **Fill / spread**: colour floods a region along a soft edge over 0.6–1.5 s. Empires, plague, religion.
- **Split / shatter**: region breaks into pieces that separate 20–40 px. Empires splitting.
- **Vanish**: fade + slight shrink, or "poof" puff. People dying in statistics, soldiers/coins disappearing.
- **Reaction take**: hold → anticipation (head dips 4°) → take (head squash 1.1, eyes widen, brows up, optional tremble 6–8 Hz for 0.4 s) → hold.
- **Talking**: mouth `talk` ↔ `neutral` flipping on syllables (~8 fps) while the line plays; one small gesture per line.
- **Walk** (stepped 4-pose, 8 fps) ONLY when the travel matters (exodus, a journey, entering a gate); otherwise slide.
- **Idle life**: blink every 2–4 s, breathing ±1.5%, flames flicker, camera creeps 1–3% on holds.
- **Holds are fine**: a still with a slow push for 3–6 s is better than busy motion. Everything else stays still so the one moving thing is read.

## 6. Timing and rhythm
- **Events land on the trigger word** (from the word timings). Labels appear with the word they spell.
- **Cut on the first content word** of the next sentence, or on an impact.
- **Fast–slow–fast**: a run of 3–5 s fact shots → a 10–15 s skit or scene → back to fast facts.
- **Breathing room**: after a big reveal hold 0.6–1.0 s (reaction shot) before the next fact.
- **Year/place stamps** appear in the first 0.5 s of a map shot and stay until it changes.
- **Openers** (first 15–20 s): a 3–5 shot montage of the strangest moments of the video, each 2–4 s, then the promise line, then the roadmap.

## 7. Sound design (one sound per event)
- `pop` = something appears · `thud` = something lands/falls · `whoosh` = slide/whip/turn · `shing` = metal/blade · `click/tick` = counters, ticking time · low drone/wind = desolate places · fire crackle = torches.
- Music bed: low, steady, ducks under the voice; stops dead for a punchline (0.3 s silence) then returns.
- Never put a sound on something the viewer cannot see.

## 8. Dark and violent subjects (channel rule)
- Show the **setup, the tool and the reaction**, never the injury in progress: cut away (sky, the narrator's face, a door closing), show a shadow or silhouette, or switch to a diagram.
- Injury only as flat stylised shapes (`W.info.wound`, `blob`), never realistic blood or opened bodies.
- Humour targets the absurdity of the system (judges, kings, rules, bureaucracy), never the victim's suffering.
- The tone pivots: a joke can come before or after the horror beat, not during it; the horror beat itself is held quietly with sound.

## 9. Retention devices
- **Hook montage** + **promise** ("by the end you'll know…") in the first 20 s.
- **Roadmap scroll** (timeline of chapters) after the intro and between chapters; tick off the finished chapter.
- **Questions to the viewer** ("Guess which half this story is about?") with a big `?` pop and a 1 s hold.
- **Escalation**: each threat bigger than the last (one enemy → three enemies attacking at once).
- **Callbacks**: reuse an earlier gag or object later with a twist (the Vikings paid to leave… come straight back).
- **Recurring host**: the monk narrator reacts at least once a minute.

## 10. Shot list template (`presets/timing/<name>.json`)
```json
{ "shots": [
  { "id": "s01", "start": 0.26, "end": 4.10, "vo": "The question that no executioner…",
    "mode": "scene|map|timeline|data|diagram|host|insert|skit",
    "device": "literal|gag|metaphor|symbol|data|reaction|skit",
    "mood": "stoneBlue", "bg": "stoneRoom", "cast": ["narrator"],
    "events": [ { "word": "recorded", "t": 3.24, "do": "page flips blank", "sfx": "whoosh" } ],
    "camera": "slow push 1.02→1.06", "cut_in": "hard cut", "notes": "" } ] }
```

## 11. Cost rules (cheap to produce, like the reference)
- One master puppet per recurring character (W.person presets) and one base map per region; only the top layers change.
- Reuse backgrounds across shots by changing camera framing and props.
- Prefer pops, slides, fills and holds over full animation; animate one thing at a time.
- Cache everything: voice (`scripts/tts.py`), shot lists, film snapshots.

## 12. Worked example — "The Saw" script, directed in this style
| Time | VO | Mode / device | Picture and events |
|---|---|---|---|
| 0.0–5.3 | "The question that no executioner … ever recorded an answer to is this:" | host + gag | Narrator monk at a lectern; "Holy Roman Empire" stamp pops on *Holy*; he flips the executioners' ledger on *recorded* → blank page (`whoosh`), `?` pops (`pop`). |
| 5.3–10.7 | "At what point during the vertical bisection … does consciousness end?" | diagram + reaction | Paper diagram: a plain white stick outline; a dashed vertical line draws down on *vertical*; a small "?" brain icon flickers on *consciousness*; cut to monk's worried take on *end*. |
| 10.7–14.3 | "The method was reserved for crimes beyond ordinary treason." | data/symbol | Scale of crimes: icons pop left→right (theft, murder, treason) on a ruler; a red bar shoots past "treason" on *beyond* (`thud`). |
| 14.3–19.9 | "The condemned was stripped, bound at the ankles, and suspended upside down from a wooden frame." | scene, literal (silhouette) | `stoneBlue` yard; frame builds by pop-ins (posts, beam) on *wooden frame*; the condemned only as a faceless silhouette hoisted, `thud` on *frame*; executioner reaction neutral. |
| 19.9–23.1 | "A large two-handled saw was positioned …" | insert | Close insert: the saw drops into frame on *saw* (`shing`), two white hands grip the handles on *two-handled*. |
| 23.1–27.1 | "Two executioners began pulling the blade downward…" | cut-away | Cut on *began* to the crowd's faces (crowd of white heads, worried takes rippling left→right), then to the monk closing his eyes; saw rasps only in sound. |
