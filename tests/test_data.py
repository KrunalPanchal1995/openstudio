"""Data checks for openstudio. Run: python -m pytest tests -q  (or python tests/test_data.py)."""
import glob
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load(p):
    with open(os.path.join(ROOT, p), encoding="utf-8") as f:
        return json.load(f)


def test_indexes_are_current():
    """data/index.json and data/presets.json must match what tools/build_data.py produces."""
    before = (load("data/index.json"), load("data/presets.json"))
    subprocess.run([sys.executable, os.path.join(ROOT, "tools", "build_data.py")], check=True, capture_output=True)
    assert before == (load("data/index.json"), load("data/presets.json"))


def test_parity_with_previous_studio():
    """Every one of the 401 presets of the previous Studio still has a route here."""
    old = load("data/presets_old.json")["items"]
    new = {p["key"]: p for p in load("data/presets.json")["presets"]}
    assert len(old) == 401
    missing = [i["key"] for i in old if i["key"] not in new]
    assert not missing, missing[:5]


def test_explainer_files_and_index():
    files = {os.path.basename(p)[:-5] for p in glob.glob(os.path.join(ROOT, "data", "explainers", "*.json"))}
    idx = load("data/index.json")["explainers"]
    assert len(files) == 263 and {e["id"] for e in idx} == files


def test_explainer_schema():
    for p in glob.glob(os.path.join(ROOT, "data", "explainers", "*.json")):
        d = json.load(open(p, encoding="utf-8"))
        for k in ("id", "type", "title", "summary", "subjects", "media", "steps", "checks"):
            assert k in d, (p, k)
        assert d["media"]["alt"].strip(), p  # every figure has a text description
        assert d["type"] in ("figure", "plot", "concept")


def test_images_exist():
    for p in glob.glob(os.path.join(ROOT, "data", "explainers", "*.json")):
        m = json.load(open(p, encoding="utf-8"))["media"]
        for k in ("src", "src_light"):
            if m.get(k) and not m[k].startswith("assets/"):  # assets/... lives on the main site
                assert os.path.exists(os.path.join(ROOT, m[k])), (p, m[k])


def test_subjects_reference_existing_things():
    subs = {s["id"] for s in load("data/subjects.json")["subjects"]}
    for e in load("data/index.json")["explainers"]:
        assert set(e["subjects"]) <= subs, e["id"]


def test_relative_links_in_html_and_js_modules_resolve():
    html = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
    for ref in re.findall(r'(?:href|src)="((?!http|data:|#)[^"]+)"', html):
        assert os.path.exists(os.path.join(ROOT, ref)), ref
    for js in glob.glob(os.path.join(ROOT, "src", "**", "*.js"), recursive=True):
        for ref in re.findall(r'from "(\.[^"]+)"', open(js, encoding="utf-8").read()):
            assert os.path.exists(os.path.normpath(os.path.join(os.path.dirname(js), ref))), (js, ref)


def test_licences_present():
    assert os.path.exists(os.path.join(ROOT, "vendor", "katex", "LICENSE"))
    assert os.path.exists(os.path.join(ROOT, "fonts", "LICENSES.md"))
    assert os.path.exists(os.path.join(ROOT, "LICENSE"))


if __name__ == "__main__":
    for name, fn in list(globals().items()):
        if name.startswith("test_"):
            fn()
            print("ok", name)
