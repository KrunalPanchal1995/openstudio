"""Build the browse indexes from the explainer files.

    python tools/build_data.py

Reads data/explainers/*.json, data/subjects.json and data/presets_old.json (the 401 presets of the previous Studio, kept
as the parity manifest) and writes:
  data/index.json    one compact record per explainer (search, subject pages)
  data/presets.json  one record per preset: {key, ws, params, route, title, sub, thumb?}
"""
import glob
import json
import os
from urllib.parse import urlencode

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load(p):
    with open(os.path.join(ROOT, p), encoding="utf-8") as f:
        return json.load(f)


def dump(p, obj):
    with open(os.path.join(ROOT, p), "w", encoding="utf-8", newline="\n") as f:
        json.dump(obj, f, ensure_ascii=False, separators=(",", ":"))
        f.write("\n")


def main():
    idx = []
    for path in sorted(glob.glob(os.path.join(ROOT, "data", "explainers", "*.json"))):
        d = json.load(open(path, encoding="utf-8"))
        m = d["media"] or {}
        idx.append({"id": d["id"], "type": d["type"], "title": d["title"], "summary": d["summary"], "subjects": d["subjects"],
                    "status": d["status"], "thumb": m.get("src"), "thumb_light": m.get("src_light", m.get("src")),
                    "tags": d.get("plot_classes", [])})
    dump("data/index.json", {"explainers": idx})
    presets = []
    for it in load("data/presets_old.json")["items"]:
        ws, params = it["go"]
        q = urlencode(params)
        rec = {"key": it["key"], "ws": ws, "params": params, "route": ws + ("?" + q if q else ""), "title": it["title"],
               "sub": it["sub"]}
        presets.append(rec)
    dump("data/presets.json", {"presets": presets})
    print(len(idx), "explainers,", len(presets), "presets")


if __name__ == "__main__":
    main()
