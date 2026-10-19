// Tiny DOM helpers shared by every view.

/** h("div.card#id", {class: "x", onclick: fn}, child, "text", [children]) -> HTMLElement */
export function h(spec, attrs, ...kids) {
  const m = /^([a-z0-9]+)?((?:[.#][\w-]+)*)$/i.exec(spec);
  const el = document.createElement((m && m[1]) || "div");
  for (const part of (m && m[2] ? m[2].match(/[.#][\w-]+/g) : []) || []) {
    if (part[0] === "#") el.id = part.slice(1);
    else el.classList.add(part.slice(1));
  }
  if (attrs !== undefined && (attrs === null || typeof attrs !== "object" || attrs instanceof Node || Array.isArray(attrs))) {
    kids.unshift(attrs);
    attrs = null;
  }
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
    else if (k === "class") v.split(" ").filter(Boolean).forEach((c) => el.classList.add(c));
    else el.setAttribute(k, v === true ? "" : v);
  }
  append(el, kids);
  return el;
}

export function append(el, kids) {
  for (const k of kids.flat(Infinity)) {
    if (k == null || k === false) continue;
    el.append(k instanceof Node ? k : document.createTextNode(String(k)));
  }
  return el;
}

export const clear = (el) => {
  el.replaceChildren();
  return el;
};

/** fetch JSON relative to the app root, cached. */
const cache = new Map();
export function getJSON(path) {
  if (!cache.has(path)) {
    cache.set(
      path,
      fetch(new URL(path, document.baseURI)).then((r) => {
        if (!r.ok) throw new Error(path + ": " + r.status);
        return r.json();
      })
    );
  }
  return cache.get(path);
}
