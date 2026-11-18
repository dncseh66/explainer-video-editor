# 3D "How it works" explainer — style study (read this before building anything in this folder)

Reference: **Jared Owen, "How the Orion Spacecraft works"** — https://www.youtube.com/watch?v=0AqxJn_iLxs
(14:43 total, 1.27 M views in 11 days, 14.7 k likes. Made in Blender 5.2 / Cycles. Team: lead, 3 modelling studios, 1 researcher/script writer, 1 generalist.)
Studied: **0:00–4:42**, the first part, which ends where the sponsor read starts at 4:42.

Evidence in this folder:
- `study/frames/overview_1..9.jpg` — one frame every 2 s, 0:00–4:40 (labelled tiles).
- `study/frames/closeup_*.jpg` — 0.3 s steps through 5 key animations (title/compare, highlight, scale reveal, stacking, leader label).
- `study/transcript/orion_part1_0-4m42.txt` (script text) + `orion_full_transcript.json` (timed captions, whole video).
- `study/ai_watch_notes.md` — AI watch-through incl. audio (unverified second opinion).

> Important: this channel's house style (`presets/style/STYLE.md`, stickmen, flat 2D) does **not** apply to this folder.
> This is a separate 3D project. Everything below is the rule set for it.

---

## 1. The formula in one paragraph

A single hero object, modelled in **obsessive, accurate detail**, is taken apart and explained piece by piece in front of a plain backdrop,
while a friendly narrator talks at speed. Every sentence has its own picture, and **every noun the narrator says appears on screen at that moment**
as a 3D model, a highlight, a label or a diagram. Context comes from **side-by-side comparisons** (old vs new, small vs big, us vs them),
**scale reveals** (zoom out to show the thing on top of something bigger) and **simple trajectory/timeline graphics**. There is no talking head,
no stock footage montage and no drama. The pleasure is clarity: "oh, *that's* how it fits together."

---

## 2. Why people love it (the psychology)

1. **The x-ray / toy feeling.** Viewers get to see inside something they can never touch: a cutaway capsule full of seats, bags and
   people, or the inside of the Vehicle Assembly Building. It feels like taking apart a perfect scale model.
2. **Zero confusion, ever.** Only one idea is on screen at a time. Everything not being talked about is removed, dimmed or kept out of
   frame. A 10-year-old and an engineer can both follow it.
3. **Constant small rewards.** Something new (a part moving, a label, a comparison) lands every ~2 s, so the curiosity loop never goes slack.
4. **Trust through precision.** Real decals, rivets, cable runs, correct proportions, real dates, real names, real NASA photos.
   Viewers sense the research, which makes them believe every claim.
5. **Context makes it meaningful.** The hero is never shown alone for long. It is compared with what came before (Apollo, Shuttle),
   what is similar (Soyuz, Crew Dragon) and what is bigger, so the viewer knows *why it matters*.
6. **A warm, humble host voice.** "My team has worked very hard on this video and we're excited to finally show it to you", followed by
   a 3-second clip of the Blender file and a team video call waving at the camera. It is human, builds goodwill, and quietly shows the effort.
7. **A gentle problem, not drama.** The first part ends on a real tension ("Orion is slightly underpowered, so it can't do the landing
   alone"). It is a puzzle the video then solves, not clickbait.

---

## 3. Visual / rendering look (verified on frames)

**Models**
- One hero model with **extreme detail**: panel lines, rivets, flags and logos, warning decals ("NO STEP"), solar-panel cell grids, wiring,
  heat-shield edge, the real NASA "worm" logo. Interiors are modelled too (seats, cargo nets, consoles, bags).
- Supporting models (comparisons) get **slightly less detail but correct silhouettes and proportions**.
- Real-world colours, not stylised: white/grey metal, NASA orange foam, gold foil. PBR materials (metal reads as metal, foil crinkles).
- **Environments switch between two modes**:
  - *Realistic*: space with stars, photoreal Earth with clouds, cratered Moon, detailed factory interior.
  - *Simplified "maquette"*: Kennedy Space Center as a bright **flat-green ground, grey roads, white blocky buildings**, toy cars in
    car parks. Buildings are clean grey/white massing models. This reads as a "map", is cheap to make and keeps attention on the hero.
- Characters (astronauts, workers) are realistic 3D people, used **small and sparingly**: in the cabin cutaway, an EVA astronaut waving,
  tiny technicians in the factory for scale. They are never the focus.

**Backdrops** (pick one per sequence, keep it constant inside that sequence)
| Backdrop | Used for |
|---|---|
| Black space + fine star field | Default for the hero, comparisons, part breakdowns |
| Saturated **flat royal blue** studio (≈ #2F6BF0) | Height/size comparison of rockets (2:52–3:08). Blue sky = "on Earth" |
| Neutral **mid-grey** studio with soft floor shadow | Isolated building model (Operations & Checkout Building), fuel-tank x-ray |
| Flat green map with grey roads | Locations / site overview |
| Blue sky + grey floor with a 3D ruler | Timeline sequence |

**Lighting**: one strong key light (the "sun") from upper front-left, soft fill, crisp contact shadows, slight rim light. On black, the
models never vanish: the key light always gives a bright edge. No heavy bloom, no lens flares, no colour grade. It reads clean and neutral.

**Camera**: mostly slow, eased orbits and push-ins, with **no shake and no handheld feel**. Depth of field only on interior close-ups
(the foreground blurs). Motion blur on fast moves (solar panels folding, objects sliding in).

**Highlight language** (used again and again; copy it exactly):
- **Cyan/teal outline** (thin glowing contour, ≈ #3FE0D0) traces the part being named. It appears on the noun and fades after about 1 s
  (crew module 1:31.7–1:33.2, service module 1:44, shuttle engines 2:58, service module 4:08).
- **Tint wash**: the whole part is flooded with a flat translucent colour while its *function* is named (gold-yellow for "thermal control", 1:48).
- **Dim everything else**: when one item in a lineup matters, the others fade to about 25 % (0:36: a dark rounded box spotlights 3 of 5
  craft; 0:50: Shuttle and Crew Dragon fade while Orion stays bright).
- **X-ray**: the hull turns semi-transparent grey to show tanks inside (3:54).
- **Red 3D arrow** (bright red, chunky) bobs next to the thing to look at (0:26 Apollo, 4:02 lander on the timeline).
- **Trajectory lines**: glowing **magenta/purple** line (≈ #C040E0) that draws itself; the spacecraft is a bright blue-white dot with a
  glow at its head. Re-entry heat is shown as a yellow-orange section of that line.
- **Region outline**: a white glowing outline + label on a 3D globe (Florida, United States), and a warm hot-spot glow on Europe.

---

## 4. On-screen text (verified)

- **Font**: bold **serif** (Merriweather/Cambria-like) in white for names ("Orion", "Crew Module", "Space Launch System").
  Secondary line in a smaller **sans-serif**: dates ("1968–1975", "2022–"), maker in *italics* ("Blue Origin", "SpaceX"), size ("98.1m").
- **Two label types**:
  1. *Caption label*, centred **under** an object in a lineup (name + date line). This is used for every comparison.
  2. *Callout label*, placed to the **right of the part** in empty space, sometimes with a **thin white leader line** to the part (Lunar Module 3:16).
     It has a soft dark drop shadow or a faint dark plate behind it so it reads on any background.
- **Title cards in-scene**: a small bold serif heading top-centre for a diagram ("Artemis 2", "Low Earth Orbit" top-right).
- **Animation**: labels **fade in over ~0.3–0.5 s** (no bounce, no typewriter). The second line fades in ~0.3 s after the first
  ("Space Launch System" → then italic "SLS"). When the next part is named, the previous label **fades out as the new one fades in**
  (Solid Rocket Boosters → Core Stage, 2:41).
- The big hero title at 0:24 ("Orion" filling the bottom of frame) **shrinks with the camera pull-back** and becomes the caption label.
  Text lives in the scene's space, not as a flat overlay.
- **Timing**: a label appears **on the exact word** and stays only while that thing is discussed (2–6 s).
- **Text density**: names, dates, numbers, places only. **Never sentences.** No subtitles burned in.
- A small constant watermark (cyan logo) bottom-right.

---

## 5. Editing & transitions

- Mostly **hard cuts** between sequences, but **inside a sequence the camera is continuous**, and the *objects* do the transitioning:
  - Hero slides out of frame and the next object slides in (0:25: camera trucks left, Orion moves right, Apollo slides in from the left).
  - **Scale reveal** (1:58–2:03, the signature move): solar panels fold up → camera pulls back fast → Orion becomes a dot → the SLS core
    stage rises up under it → boosters slide in from both sides → label fades in. *One continuous shot, about 4.5 s.*
  - **Explode / reassemble**: parts separate vertically along their axis with even gaps (launch abort tower, crew module, service module),
    hold for the label, then come back together.
  - **Stacking**: parts descend from above into place one by one (boosters → core stage → upper stage → Orion → abort system), each with
    its label the moment it lands (2:37–2:50).
  - **Lineup growth**: comparison items are added one at a time from off-screen while the camera pulls back to make room
    (Apollo → +Orion → +Crew Dragon → +Space Shuttle, 1:04–1:12; crew icons drop in above each).
- Short **dissolves** only for "zoom out to the big picture" (LEO ring → whole Earth tiny → dissolve to ISS) and into/out of real photos.
- **Real photos/graphics** are shown flat, full-frame or centred on black (crew photo 1:00, NASA concept-of-ops chart 3:42, launch photos
  3:26 as a split screen). They are used as *proof*, briefly (2–5 s), then the video goes straight back to 3D. Photos also appear as **cards
  pinned on the 3D timeline** with leader lines.
- Behind-the-scenes insert (Blender viewport, team call) right after the hook: 3 s, then straight back to the hero.

---

## 6. Pacing (measured)

- **Narration speed: ~200 words per minute** (954 words in 282 s). It is fast, but it never feels rushed because the picture always shows exactly what is said.
- **Visual beat ≈ every 2 s**: a new label, part movement, item entering or highlight. Measured on 2 s frames: almost no two
  consecutive frames are identical.
- **Distinct shot/setup ≈ every 4–6 s** (~55 setups in 4:42). The longest single setups are the stacking (≈15 s) and the timeline (≈35 s), and they stay alive with continuous
  camera moves + elements added every 2–3 s.
- **Sentence = shot.** A new sentence or clause almost always brings a new framing or a new element. Lists ("power, thermal control,
  propulsion, consumables") get **one beat per item** (1:44–1:54: outline → tint → engine glow → label).
- Rhythm: fast hook montage (0–23 s, cuts every 2 s), then the first **comparison** section breathes a little (4–6 s), then the anatomy
  section uses slow orbits, and the timeline/problem section speeds up again.
- There are no dead pauses. Music carries the gaps between sentences (0.3–0.6 s).

---

## 7. Story structure of the first part (0:00–4:42)

| Time | Beat | Device |
|---|---|---|
| 0:00–0:23 | **Hook / promise**: "This is X. It does Y. Let's look at the parts, how it launches, and an inside tour." Shows a 2 s teaser of each promised chapter + the big-picture payoff (Moon base) | Teaser montage, cutaway interior, team insert |
| 0:23–0:47 | **Lineage**: "looks a lot like Apollo… programs since stayed in low Earth orbit… zoom out, it's like they never left" | Side-by-side lineup, zoom-out scale gag |
| 0:47–1:02 | **Why now**: Artemis, first crew around the Moon in 50 years | Trajectory line, real crew photo |
| 1:02–1:28 | **Quick spec comparisons**: crew size, mission length, the cone shape and why it's safe on return | Icon counts above each craft, re-entry heat |
| 1:28–1:56 | **Anatomy**: crew module, service module and each function | Explode + cyan outline + labels, one beat per item |
| 1:56–3:08 | **How it gets there**: the rocket, where parts are built, final assembly, stacking, height comparison, reused Shuttle engines | Scale reveal, globe map, building models, stacking, blue-studio lineup |
| 3:08–3:56 | **The missing piece**: it can't land; Apollo had a lunar module; Artemis uses landers launched separately; rendezvous | Lineup with leader label, landers lineup, real launch photos, docking animation |
| 3:56–4:42 | **The twist / history**: designed in 2006 for a program that was cancelled, so it's slightly underpowered → careful fuel planning | 3D ruler timeline with program bars + photo cards, trajectory recap |

Writing patterns to copy:
- **Plain, conversational sentences**, second person and "we": "Let's get familiar with Orion." "So we're missing something."
- **Define jargon in the same breath**: "thermal control, which means keeping the temperature comfortable; propulsion, or in other words, the engines."
- **Rhetorical question as a section turn**: "What about Orion?"
- **Name the official term after the plain idea**: "Then it will meet up with Orion… They call this a rendezvous."
- **Honest caveats** build trust: "NASA is still working out the details." "It might look a little different in future missions."
- Numbers are concrete and shown: "four", "three weeks", "98 m tall". There is always a visual for each number.
- **Re-hook the chapters** with a small mystery ("it turns out that it's complicated") and pay it off within ~30 s.

---

## 8. What makes it feel precise and premium (checklist)

- [ ] Hero model is accurate to reference photos (proportions, colours, logos, part count). Research before modelling.
- [ ] Every move is eased (ease-in-out, often a soft overshoot-free settle). **No linear moves**, no snapping.
- [ ] The camera is always slightly moving, even on "static" shots (slow orbit or push-in of a few degrees).
- [ ] Exploded parts separate **along their real assembly axis** with even, deliberate gaps.
- [ ] One highlight colour language used everywhere: cyan outline = "this part", magenta line = "path", red arrow = "look here".
- [ ] Labels are pixel-aligned, same font/size per level, same distance from object, consistent shadow.
- [ ] Composition: the subject is centred or on the left third with its label in the empty right third. Generous negative space.
- [ ] Clean backgrounds with no clutter; only one backdrop type per sequence.
- [ ] Real proof (photo/official graphic) appears briefly whenever a claim could be doubted.
- [ ] Sound: music bed always under, ducked well below voice; subtle whoosh/click SFX only on mechanical moves.

---

## 9. How to recreate this in our pipeline (plan for the next task)

Our existing renderer is headless Chrome → MP4 (see memory: render pipeline). For 3D, the matching approach:

1. **Engine**: three.js scenes (one module per sequence), rendered deterministically frame by frame in headless Chrome, same muxing step.
   - `MeshStandardMaterial`/`MeshPhysicalMaterial` (PBR), one `DirectionalLight` with soft shadows + `HemisphereLight` fill + rim light.
   - Star field = instanced points on black. Studio backdrops = infinite cyclorama plane in flat blue / mid-grey.
   - Cyan outline = `OutlinePass` (postprocessing) or an inverted-hull mesh; fade by opacity.
   - Labels = HTML/CSS overlay projected from 3D anchor points (crisp text, easy fades) + SVG leader lines.
   - Trajectories = `Line2`/tube geometry with an animated draw range, additive glow.
   - Easing: a shared `ease(t)` library (cubic/quint in-out); the camera on spline paths with eased progress.
2. **Assets**: hero + comparison models from free/CC sources (NASA 3D resources, Sketchfab CC, Poly Haven) or procedural low-poly built in code,
   or the Magnific `models3d_*` tools. Detail level is the biggest quality lever. Budget most of the time on the hero.
3. **Workflow**: script (`scripts_text/`) → TTS → word timings → **shot list where each sentence maps to one visual beat** (§6) →
   build sequences → render → mix music + light SFX (Epidemic Sound, log choices in the timing JSON).
4. **Reusable "devices" to build once** (each as a function):
   `explode(parts, axis, gap)`, `stack(parts, from:'above')`, `scaleReveal(hero, bigger)`, `lineup(items, labels)`,
   `highlight(part, 'outline'|'tint'|'xray')`, `dimOthers(items, keep)`, `label(anchor, title, sub, leader?)`, `arrow(target)`,
   `trajectory(path, drawFrom, drawTo)`, `globeFocus(region)`, `timeline(years, bars, cards)`, `photoCard(img)`.

Target for our version: 1920×1080, 30 fps, ~200 wpm narration, a visual beat every ~2 s, a new setup every ~5 s,
the hook teasing every chapter in the first 20 s, and a "problem / twist" by ~3–4 minutes.
