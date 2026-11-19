# Scenes, props, infographics and colour — channel guide

Code: `presets/scenes/scenes.js` (`W.MOODS`, `W.bg.*`, `W.prop.*`, `W.info.*`). Preview: `presets/scenes/sheet.html`
(serve `presets/` with `python3 -I -m http.server 8766` and open http://127.0.0.1:8766/scenes/sheet.html).

## 1. Colour moods — one dominant family per scene
Pick the mood from the story beat, not at random. Characters keep their own colours on top.

| Mood (`W.MOODS.*`) | Use for | Main colours | Ref |
|---|---|---|---|
| `dungeonWarm` | cells, torture rooms, cellars, anything enclosed and grim-but-warm | terracotta wall `#E7A577`, mustard stone highlights `#EBB65E`, sand floor `#CDA57F` | 17 |
| `hallSage` | monasteries, refectories, chapels, calm institutions | sage `#CFCF9A`, fire glow `#FFD878`, wood `#C99A62` | 05 |
| `prisonTeal` | prisons, castles, guard scenes, "official" spaces | teal `#7AD3C8` + mustard `#F0C36A`, sand floor | 10 |
| `stoneBlue` | cold interiors, stone corridors, devices/props on walls, sad beats | blue-grey `#8F9BA7`, darker floor `#6F7984` | 15, 18 |
| `stonePale` | plain medieval rooms, kitchens, day interiors | pale stone `#E3DFD6`, sky window `#BFE3F3` | 12 |
| `snowCold` | winters, sieges, establishing shots of towns, bleak outcomes | sky `#C9D6DE`, snow `#EDF1F3`, grey buildings `#BCC2C7`, black bare trees | 06 |
| `fieldSpring` | countryside, graves, "years later", hopeful beats | sky `#DCEFF6`, grass `#B4D98A`, fences `#B98A5F`, small flowers | 14, 16 |
| `hospitalMint` | medicine, recovery, modern science | mint wall `#CDE8C4`, tiles `#E8ECEE`, metal `#A9B2BA` | 08 |
| `infoPaper` | diagrams, comparisons, anatomy | white grid paper, shadow blue `#BFE0F2`, coral `#F08A7E` | 07, 09 |
| `prairieDust` | Wild West streets, cattle towns, daytime exteriors | sky `#F4E2B8`, sun-bleached wood `#D9A86C`, dirt `#E2BE8A`, mesas `#D98C5F` | — |
| `parlorRose` | Wild West interiors: parlor houses, saloons, cramped rooms | faded rose wallpaper `#C98F86`, dark wood `#8C5A3A`, red carpet `#8E3B3B`, lamp glow `#FFD58A` | — |
| `trailNight` | trail camps, night exteriors, campfires | night blue `#2F3A4F`, fire glow `#FFC86B` | — |
| `mapSea` | maps and geography | sea `#9ED3CC`, land `#E9C48A` | 11 |

## 2. Backgrounds (`W.bg.*`, full 1920×1080)
| Function | What you get | Options |
|---|---|---|
| `stoneRoom(mood,{seed,sparse,floorY,flagstones})` | flat wall with suggested rounded stone blocks, floor band | `sparse:false` = full courses |
| `vaultHall(mood,{fireplace,t})` | gothic ribbed arches, floor, arched fireplace with live fire | `fireplace:false` |
| `dungeon(mood,{seed,bars,t})` | barrel vault, highlighted stones, barred window, torch glow, straw, cell bars | `bars:false` |
| `corridor(mood,{seed,gates,t})` | one-point perspective arch corridor, gates, two torches | `gates:false` |
| `snowTown(mood,{seed})` | rolling snow hills, church, walled town with towers, bare trees | — |
| `field(mood,{seed})` | layered hills, broken fences, grass tufts, flowers | — |
| `ward(mood,{beds})` | tall windows with light streaks, perspective tiles, metal beds | `beds:false` |
| `mainStreet(mood,{blank})` | cattle-town main street: sun, mesas, 5 false-front stores (door centres x = 192+384·i, boardwalk top y 760), dirt street; `blank:i` = store i has no sign board. Sign text = HTML (`W.F.signs` in the Wild West film kit) | — |
| `parlor(mood,{peel,door,window,stairs})` | cramped parlor: floral wallpaper with peeling seams, wainscot, worn carpet runner, curtained window, doorway at x 110–310, staircase right | — |
| `paper(mood)` | infographic grid paper | — |
| `sea(mood)` | flat sea for maps (draw land with `W.style.land(d)`) | — |

Rules: flat fills + one soft wash (`wash()` is built in); same outline weight as characters (4 px on 1920); light comes from a source you can see (torch, fire, window) as a soft radial glow (`W.glow`); keep the area behind captions calm.

## 3. Props (`W.prop.*(x, y, scale, mood?)`, base at x,y)
Furniture: `table`, `bench`, `stool`, `barrel`, `bed`, `door`. Tableware/food: `bowl`, `cup`, `bread` (character item). Light: `torch(t)`, `fire(t)` (flicker from time `t`). Architecture: `window(arched)`, `barredWindow`, `bars(w,h)`, `tower(roof)`, `church`, `house`. Nature: `tree(seed)` (bare, black), `fence(n)`, `flower(col)`, `grass`, `cloud`, `straw(n,seed)`. Paper: `scroll`, `quill`. Wild West: `storefront(o)`, `hitchPost`, `cactus`, `settee(col)`, `piano` (upright), `keroLamp(t,on)`, `washstand`.
Rules: wood has 2–3 grain lines; metal is flat grey with dark outline; objects sit on the floor line (no floating), drawn at a scale that matches the characters.

## 4. Infographics (`W.info.*`)
- `shadowed(d)` — any shape as a white object with the light-blue offset shadow; `bone(x,y,s,rot)` example.
- `arrow(x1,y1,x2,y2)` — chunky coral "before → after" arrow. `pointer()` thin arrow, `leader()` curved leader line.
- `crack()`, `impact()` (little white shards), `pin()` (map dot).
- `wound()`, `blob()` — the only way injuries appear: flat coral/red shapes, no realistic blood or open bodies.
- Labels: `labelHTML(text, x, y, {size, width, align})` → HTML in hand-lettered caps (font "Patrick Hand SC"; add `W.info.CSS` to base.css). Never write words inside SVG.
Layout: object(s) centred, label above/right with a leader line, 2 labels max per frame, 60–80 px lettering on 1920.

## 5. Framing (from the frames)
- Establishing wide → medium (waist up, characters ~60% frame height) → close-up (head/hands fill the frame, peach skin for bare bodies, 4-finger hands).
- Groups are lined up across the frame at the same scale (05, 10) or packed crowds with overlapping heads (17).
- Back views for travel/leaving (16): the white head seen from behind with no face.
