import { route, onRoute, start, go, parse } from "./core/router.js";
import * as theme from "./core/theme.js";
import * as host from "./core/host.js";
import * as views from "./ui/views.js";
import { explain } from "./ui/explain.js";
import { WORKSPACES } from "./workspaces/registry.js";
import { isLive, run as runLive } from "./ui/live.js";

host.init();

// routes
route("subjects", (r) => (r.params.s ? views.subject(r.params.s) : views.subjects()));
route("explain", (r) => explain(r.params.id));
route("workspaces", () => views.workspaces());
route("w", (r) => (isLive(r.params.id) ? runLive(r.params.id, r.params) : views.workspace(r.params.id, r.params)));
route("search", (r) => views.search(r.params.q));
// old deep links: #atlas?ch=S32&ex=0 and the rest
for (const w of WORKSPACES) route(w.id, (r) => (isLive(w.id) ? runLive(w.id, r.params) : views.workspace(w.id, r.params)));
route("*", (r) => views.subjects());

// chrome
const nav = [...document.querySelectorAll("[data-nav]")];
onRoute((r) => {
  const active = r.view === "w" || WORKSPACES.some((w) => w.id === r.view) ? "workspaces" : r.view === "explain" ? "subjects" : r.view;
  nav.forEach((a) => a.toggleAttribute("aria-current", a.dataset.nav === active));
  const main = document.getElementById("view");
  main.scrollTop = 0;
  window.scrollTo(0, 0);
  document.title = "openstudio" + (r.view !== "subjects" ? " · " + r.view : "");
});
document.getElementById("theme").addEventListener("click", () => theme.toggle());
theme.onChange(() => views.retheme());
document.getElementById("quick").addEventListener("submit", (e) => {
  e.preventDefault();
  go("search", { q: document.getElementById("q").value.trim() });
});

start().then(() => {
  const m = document.getElementById("view");
  if (!parse().raw) m.focus({ preventScroll: true });
});
