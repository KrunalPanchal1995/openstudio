// Views: subjects, one subject, workspaces, a workspace, search.
import { h, clear, getJSON, append } from "../core/dom.js";

const put = (el, ...kids) => append(el, kids);
import { href } from "../core/router.js";
import { WORKSPACES, byId } from "../workspaces/registry.js";
import * as theme from "../core/theme.js";
import { asset } from "../core/assets.js";

const view = () => document.getElementById("view");

export function thumb(rec) {
  const src = theme.current() === "dark" ? rec.thumb : rec.thumb_light || rec.thumb;
  return src ? h("img.thumb", { src: asset(src), alt: "", loading: "lazy", "data-dark": asset(rec.thumb) || "", "data-light": asset(rec.thumb_light || rec.thumb) || "" }) : null;
}

/** Re-point theme-dependent images after a theme change. */
export function retheme() {
  const dark = theme.current() === "dark";
  document.querySelectorAll("img[data-dark]").forEach((img) => {
    const s = dark ? img.dataset.dark : img.dataset.light;
    if (s && img.getAttribute("src") !== s) img.setAttribute("src", s);
  });
}

export async function subjects() {
  const [{ subjects: list }, { explainers }] = await Promise.all([getJSON("data/subjects.json"), getJSON("data/index.json")]);
  const counts = {};
  explainers.forEach((e) => e.subjects.forEach((s) => (counts[s] = (counts[s] || 0) + 1)));
  const root = clear(view());
  put(root, 
    h("section.hero", h("h1", "Subjects"), h("p.lede", "Pick a subject. Each one collects its explained figures, concepts and live instruments.")),
    h(
      "ul.grid",
      list.map((s) =>
        h(
          "li.card.card--" + s.color,
          h(
            "a.card__link",
            { href: href("subjects", { s: s.id }) },
            h("span.card__glyph", { "aria-hidden": "true" }, s.glyph),
            h("h2", s.title),
            h("p", s.blurb),
            h("p.meta", `${counts[s.id] || 0} lessons · ${s.atlas.length} atlas chapters`)
          )
        )
      )
    )
  );
}

export async function subject(id) {
  const [{ subjects: list }, { explainers }] = await Promise.all([getJSON("data/subjects.json"), getJSON("data/index.json")]);
  const s = list.find((x) => x.id === id);
  const root = clear(view());
  if (!s) return put(root, h("p", "Unknown subject. "), h("a", { href: "#subjects" }, "All subjects"));
  const items = explainers.filter((e) => e.subjects.includes(id));
  const groups = [
    ["figure", "Explained figures"],
    ["plot", "Plot types"],
    ["concept", "Concepts"],
  ];
  put(root, 
    h("p.crumb", h("a", { href: "#subjects" }, "Subjects"), " / ", s.title),
    h("section.hero", h("h1", s.title), h("p.lede", s.blurb)),
    s.atlas.length
      ? h("section", h("h2", "Atlas chapters"), h("ul.list", s.atlas.map((a) => h("li", h("a", { href: "#" + a.route }, `${a.id} · ${a.title}`), h("span.meta", ` ${a.examples} examples`)))))
      : null,
    groups.map(([t, label]) => {
      const rows = items.filter((e) => e.type === t);
      return rows.length
        ? h("section", h("h2", `${label} (${rows.length})`), h("ul.tiles", rows.map(tile)))
        : null;
    }),
    s.projects.length
      ? h("section", h("h2", "Related projects"), h("ul.list", s.projects.map((p) => h("li", h("a", { href: "https://krunalpanchal1995.github.io/projects/" + p.slug + "/" }, p.title)))))
      : null
  );
}

export function tile(e) {
  return h(
    "li.tile",
    h("a", { href: href("explain", { id: e.id }) }, thumb(e), h("span.tile__t", e.title), e.status === "draft" ? h("span.chip.chip--warn", "draft") : null)
  );
}

export async function workspaces() {
  const { presets } = await getJSON("data/presets.json");
  const n = {};
  presets.forEach((p) => (n[p.ws] = (n[p.ws] || 0) + 1));
  const groups = [...new Set(WORKSPACES.map((w) => w.group))];
  const root = clear(view());
  put(root, 
    h("section.hero", h("h1", "Instruments"), h("p.lede", "Live tools you can drag and slide. Every preset has its own link.")),
    groups.map((g) =>
      h(
        "section",
        h("h2", g),
        h(
          "ul.grid",
          WORKSPACES.filter((w) => w.group === g).map((w) =>
            h(
              "li.card",
              h("a.card__link", { href: href("w", { id: w.id }) }, h("h3", w.title), h("p", w.blurb), h("p.meta", `${n[w.id] || 0} presets`, w.live ? "" : ` · coming in phase ${w.phase}`))
            )
          )
        )
      )
    )
  );
}

export async function workspace(id, params) {
  const w = byId[id];
  const { presets } = await getJSON("data/presets.json");
  const root = clear(view());
  if (!w) return put(root, h("p", "Unknown instrument. "), h("a", { href: "#workspaces" }, "All instruments"));
  const mine = presets.filter((p) => p.ws === id);
  put(root, 
    h("p.crumb", h("a", { href: "#workspaces" }, "Instruments"), " / ", w.title),
    h("section.hero", h("h1", w.title), h("p.lede", w.blurb)),
    h("p.note", { role: "note" }, `This instrument is being rebuilt to run fully in the browser (phase ${w.phase} of the plan). The presets below keep their links, so old bookmarks to #${id}?... will open here once it is ready.`),
    h("ul.list", mine.map((p) => h("li", h("a", { href: "#" + p.route }, p.title), h("span.meta", " " + p.sub))))
  );
  if (params && Object.keys(params).length > 1) {
    const hit = mine.find((p) => Object.entries(p.params).every(([k, v]) => String(params[k]) === String(v)));
    if (hit) root.prepend(h("p.note", `Preset: ${hit.title}`));
  }
}

export async function search(q) {
  const [{ explainers }, { presets }] = await Promise.all([getJSON("data/index.json"), getJSON("data/presets.json")]);
  const input = document.getElementById("q");
  if (input && input.value !== q) input.value = q || "";
  const terms = (q || "").toLowerCase().split(/\s+/).filter(Boolean);
  const score = (text) => (terms.length && terms.every((t) => text.includes(t)) ? 1 : 0);
  const root = clear(view());
  const exp = terms.length ? explainers.filter((e) => score((e.title + " " + e.summary + " " + e.tags.join(" ")).toLowerCase())) : [];
  const pre = terms.length ? presets.filter((p) => p.ws !== "explain" && score((p.title + " " + p.sub + " " + p.ws).toLowerCase())) : [];
  put(root, 
    h("section.hero", h("h1", "Search"), h("p.lede", terms.length ? `${exp.length + pre.length} results for "${q}"` : "Type in the box above: a topic, a formula name, a plot type.")),
    pre.length ? h("section", h("h2", `Instrument presets (${pre.length})`), h("ul.list", pre.map((p) => h("li", h("a", { href: "#" + p.route }, p.title), h("span.meta", " " + p.ws))))) : null,
    exp.length ? h("section", h("h2", `Lessons (${exp.length})`), h("ul.tiles", exp.slice(0, 80).map(tile))) : null
  );
}
