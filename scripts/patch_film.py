#!/usr/bin/env python3
"""Apply exact text replacements to a saved film module (presets/film-snapshot/modules/<doc>.json).
Usage: python3 -I scripts/patch_film.py <doc.json> <patch.json>
patch.json: [["old", "new", expected_count], ...]  -- fails without writing if any count differs.
"""
import json, sys

doc_path, patch_path = sys.argv[1], sys.argv[2]
doc = json.load(open(doc_path))
text = doc["text"]
for old, new, n in json.load(open(patch_path)):
    c = text.count(old)
    if c != n:
        sys.exit(f"expected {n}x, found {c}x: {old!r}")
    text = text.replace(old, new)
doc["text"] = text
json.dump(doc, open(doc_path, "w"), ensure_ascii=False)
print("patched", doc_path)
