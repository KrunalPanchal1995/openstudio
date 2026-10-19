// Messaging with a host page (same origin only), compatible with the previous Studio's protocol.
//   parent -> studio: {type:'go', route}, {type:'theme', theme}, {type:'ping'}
//   studio -> parent: {type:'studio-ready'}, {type:'studio-route', route}
import * as theme from "./theme.js";
import { parse } from "./router.js";

export const embedded = (() => {
  try {
    return window.parent !== window;
  } catch (e) {
    return true;
  }
})();

export function init() {
  const q = new URLSearchParams(location.search);
  if (q.get("embed") === "1") document.documentElement.classList.add("embed");
  if (!embedded) return;
  const post = (m) => parent.postMessage(m, location.origin);
  addEventListener("message", (e) => {
    if (e.origin !== location.origin || !e.data) return;
    if (e.data.type === "go") location.hash = String(e.data.route || "").replace(/^#/, "");
    else if (e.data.type === "theme") theme.set(e.data.theme, false);
    else if (e.data.type === "ping") post({ type: "studio-ready" });
  });
  addEventListener("hashchange", () => post({ type: "studio-route", route: parse().raw }));
  addEventListener("load", () => {
    post({ type: "studio-ready" });
    post({ type: "studio-route", route: parse().raw });
  });
}
