# Shot list + sound for build.py (exec'd with T, sc, END, words, scenes available). Word numbers = scripts_text/wild-west-ch09.txt.
SHOTS = {k: ("scene", "literal", "", []) for k in [s["id"] for s in scenes]}
SHOTS.update({
    "t9": ("host", "data", "prairieDust", [(1, "big 9 drops", "thud"), (2, "THE COURAGE", "")]),
    "bible": ("insert", "literal", "infoPaper", [(58, "letter into the Bible", ""), (65, "three generations", ""), (72, "donation bin", "thud")]),
    "apart": ("host", "gag", "prairieDust", []),
    "ceasefire": ("data", "metaphor", "infoPaper", [(272, "whiskey = ceasefire", "")]),
    "dozen": ("scene", "gag", "", [(447, "up/down ×12", "")]),
    "money": ("data", "metaphor", "infoPaper", [(645, "money bag vs coins", "")]),
    "nightmare": ("host", "reaction", "", [(803, "heroic pose crossed out", ""), (818, "collapse", "thud")]),
    "broke": ("data", "metaphor", "infoPaper", [(948, "heart cracks", "")]),
})
SFX = {"thud": {"id": "aaa36e82-f3f3-44b9-b27a-5895326bb47b", "title": "Cartoon, Impact, Wood Knocks, Fast", "file": "assets/sound/sfx/thud.mp3"}}
CUES = [
    {"section": "the letter, the war inside", "file": "assets/sound/music/raised-by-wolves.mp3", "id": "da09bb59-e892-4e48-b447-20b933e872d4", "title": "Raised by Wolves", "artist": "Tellsonic", "src": 40.0,
     "from": 0.0, "to": T(793), "vol": 0.15, "fade_in": 1.0, "fade_out": 0.8},
    {"section": "the nightmare begins", "file": "assets/sound/music/desert-wind.mp3", "id": "9b9872c2-f093-407e-8d8e-ee3c8b023e6b", "title": "Desert Wind", "artist": "Tellsonic", "src": 120.0,
     "from": T(793), "to": END, "vol": 0.15, "fade_in": 0.8, "fade_out": 2.0},
    {"section": "amb: saloon murmur", "file": "assets/sound/sfx/walla.mp3", "id": "4bb74dea-8302-4973-9b07-4a98d3374645", "from": sc["letter"]["start"], "to": sc["vocab"]["start"], "vol": 0.1, "fade_in": 0.5, "fade_out": 0.5},
    {"section": "amb: night on the trail", "file": "assets/sound/sfx/campfire.mp3", "id": "fa82d1a8-3fcc-4125-b793-a35ef14dd1eb", "src": 30.0, "from": sc["nights"]["start"], "to": sc["nights"]["end"], "vol": 0.22, "fade_in": 0.3, "fade_out": 0.3},
    {"section": "amb: saloon murmur (ritual)", "file": "assets/sound/sfx/walla.mp3", "id": "4bb74dea-8302-4973-9b07-4a98d3374645", "src": 5.0, "from": sc["ritual"]["start"], "to": sc["dozen"]["end"], "vol": 0.1, "fade_in": 0.5, "fade_out": 0.5},
]
