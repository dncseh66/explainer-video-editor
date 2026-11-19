# Shot list + sound for build.py (exec'd with T, sc, END, words, scenes available).
SHOTS = {  # id: (mode, device, mood, [(word, do, sfx)])
    "title": ("host", "data", "prairieDust", [(3, "narrator points", ""), (5, "big 10 drops", "thud"), (6, "THE DOOR", "")]),
    "doors": ("scene", "literal", "prairieDust", [(13, "parlor house door glows (no sign)", ""), (23, "every door glows in turn, camera glides the block", "")]),
    "closeup": ("insert", "literal", "prairieDust", [(30, "pine frame glows", ""), (33, "push on the iron latch", ""), (38, "paint cracks", ""), (43, "sun glare", "")]),
    "walk": ("scene", "literal", "prairieDust", [(51, "1878 tag", ""), (60, "DRY GOODS sign bounces", ""), (65, "BARBER", ""), (68, "LAND OFFICE", ""), (70, "stops at the blank door", ""), (79, "? pops", "")]),
    "latch": ("insert", "literal", "prairieDust", [(85, "latch lifts", "latch"), (89, "door swings inward, light floods", "creak"), (93, "warm flash, push through", "")]),
    "inside": ("scene", "literal", "parlorRose", [(96, "haze in the air", ""), (100, "amber lamplight", "")]),
    "smell": ("scene", "reaction", "parlorRose", [(104, "smell wisps hit his face", ""), (107, "dark: eyes adjusting", "")]),
    "campfire": ("scene", "literal", "trailNight", [(119, "trail song notes", ""), (122, "bunkhouse story + fantasy bubble (chandelier)", "")]),
    "jar": ("diagram", "metaphor", "infoPaper", [(135, "kerosene lamp, amber layer", ""), (139, "arrow on the first layer", ""), (142, "lye soap, pale layer", ""), (151, "washbasin", "")]),
    "stain": ("scene", "literal", "parlorRose", [(154, "cigar smoke", ""), (162, "thousands of butts", ""), (174, "wallpaper stains", ""), (177, "curtains", ""), (180, "carpet", ""), (190, "ghosts of past men", "")]),
    "perfume": ("diagram", "metaphor", "infoPaper", [(200, "atomizer", ""), (205, "aggressive puff, jar shakes", ""), (208, "sweet-sour layer under the perfume", ""), (214, "?", ""), (222, "hat", "thud"), (224, "coins", "thud"), (226, "watch", "thud")]),
    "squeeze": ("scene", "gag", "parlorRose", [(227, "walls squeeze the parlor", "thud"), (235, "ranch sitting-room outline", "")]),
    "piano": ("scene", "literal", "parlorRose", [(245, "notes go sour", "")]),
    "chatter": ("scene", "literal", "parlorRose", [(259, "door opens", "creak"), (262, "everyone freezes and turns", ""), (267, "first timer steps in", "")]),
    "quiet": ("scene", "reaction", "parlorRose", [(273, "only the clock ticks", ""), (284, "sight lines to the door", "")]),
    "looked": ("scene", "reaction", "parlorRose", [(298, "eyes open in the dark", ""), (314, "worried take", "")]),
}
SFX = {"thud": {"id": "aaa36e82-f3f3-44b9-b27a-5895326bb47b", "title": "Cartoon, Impact, Wood Knocks, Fast", "file": "assets/sound/sfx/thud.mp3"},
       "latch": {"id": "85252586-62f7-4aa0-aba6-126390b0e049", "title": "Doors, Hardware, Latch, Shed, Open", "file": "assets/sound/sfx/latch.mp3"},
       "creak": {"id": "ea90dd96-1588-488b-be01-984ebc4f9140", "title": "Doors, Wood, Old, Open, Creak 01", "file": "assets/sound/sfx/door-creak.mp3"}}
sc = {s["id"]: s for s in scenes}
CUES = [  # music bed + ambience beds (mix places each from..to with fades)
    {"section": "street + parlor until the room goes quiet", "file": "assets/sound/music/desert-wind.mp3", "id": "9b9872c2-f093-407e-8d8e-ee3c8b023e6b", "title": "Desert Wind", "artist": "Tellsonic",
     "from": 0.0, "to": T(262), "vol": 0.16, "fade_in": 1.2, "fade_out": 0.08},
    {"section": "silence: conversation stopped", "file": "", "from": T(262), "to": T(295)},
    {"section": "he is the thing being looked at", "file": "assets/sound/music/desert-wind.mp3", "src": 150.0, "from": T(295), "to": END, "vol": 0.12, "fade_in": 2.0, "fade_out": 1.5},
    {"section": "amb: boots on the boardwalk", "file": "assets/sound/sfx/boardwalk-steps.mp3", "id": "2be17a1c-5932-428e-b262-f46b6d1bc2bc", "from": sc["walk"]["start"], "to": T(70), "vol": 0.3, "fade_in": 0.3, "fade_out": 0.3},
    {"section": "amb: campfire", "file": "assets/sound/sfx/campfire.mp3", "id": "fa82d1a8-3fcc-4125-b793-a35ef14dd1eb", "from": sc["campfire"]["start"], "to": sc["campfire"]["end"], "vol": 0.3, "fade_in": 0.3, "fade_out": 0.4},
    {"section": "amb: parlor chatter (stops dead)", "file": "assets/sound/sfx/walla.mp3", "id": "4bb74dea-8302-4973-9b07-4a98d3374645", "from": sc["squeeze"]["start"], "to": T(262), "vol": 0.18, "fade_in": 0.6, "fade_out": 0.06},
    {"section": "amb: the out-of-tune piano", "file": "assets/sound/sfx/piano-out-of-tune.mp3", "id": "dda2527a-bc9b-407e-bcc0-c9821fc0d9dc", "from": sc["piano"]["start"], "to": T(262), "vol": 0.3, "fade_in": 0.1, "fade_out": 0.06},
]
