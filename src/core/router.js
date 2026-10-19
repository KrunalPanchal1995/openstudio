// Hash router. A route is "<view>?k=v&k=v" after the "#", the same shape the previous Studio used
// (#atlas?ch=S32&ex=0), so existing deep links keep working.

export function parse(hash = location.hash) {
  const raw = hash.replace(/^#\/?/, "");
  const [view, qs = ""] = raw.split("?");
  return { view: view || "subjects", params: Object.fromEntries(new URLSearchParams(qs)), raw };
}

export const href = (view, params) => {
  const q = new URLSearchParams(params || {}).toString();
  return "#" + view + (q ? "?" + q : "");
};

export function go(view, params) {
  location.hash = href(view, params).slice(1);
}

const handlers = new Map();
export function route(view, fn) {
  handlers.set(view, fn);
}

let onChange = () => {};
export function onRoute(fn) {
  onChange = fn;
}

export async function dispatch(target) {
  const r = target || parse();
  const fn = handlers.get(r.view) || handlers.get("*");
  onChange(r);
  return fn ? fn(r) : null;
}

export function start() {
  addEventListener("hashchange", () => dispatch());
  return dispatch();
}
