// Live instruments: each is a module exporting mount(host, data, opts), loaded on demand with its own data and stylesheet.
import { h, clear, getJSON, append } from "../core/dom.js";
import { byId } from "../workspaces/registry.js";

const MODULES = {
  periodic: {
    load: () => import("../workspaces/periodic.js"),
    data: "data/periodic.json",
    css: "styles/periodic.css",
    about: "Five steps, each one a move chemists made. Do the step, then see what history found. The course notes are on the main site.",
    links: [
      ["Course: How the Periodic Table Was Made", "https://krunalpanchal1995.github.io/projects/periodic-table-course/"],
      ["Stand-alone builder", "https://krunalpanchal1995.github.io/openperiodictable/app/"],
    ],
  },
};

export const isLive = (id) => id in MODULES;

function loadCss(href) {
  const url = new URL(href, document.baseURI).href;
  if (![...document.styleSheets].some((s) => s.href === url) && !document.querySelector(`link[data-live="${href}"]`)) {
    const l = h("link", { rel: "stylesheet", href: url, "data-live": href });
    document.head.append(l);
  }
}

export async function run(id, params) {
  const m = MODULES[id];
  const w = byId[id];
  const root = clear(document.getElementById("view"));
  const host = h("div.live-host");
  append(root, [
    h("p.crumb", h("a", { href: "#workspaces" }, "Instruments"), " / ", w.title),
    h("section.hero", h("h1", w.title), h("p.lede", m.about), h("p.meta", m.links.map(([t, u]) => [h("a", { href: u }, t), " · "]))),
    host,
  ]);
  loadCss(m.css);
  const [mod, data] = await Promise.all([m.load(), getJSON(m.data)]);
  mod.mount(host, data, params || {});
}
