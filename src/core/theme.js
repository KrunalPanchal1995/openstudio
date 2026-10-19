// Light / dark theme: stored per viewer, overridable with ?theme=light|dark (used by the host page).
const KEY = "openstudio-theme";
const root = document.documentElement;
const listeners = [];

export const current = () => root.dataset.theme;

export function set(t, remember = true) {
  if (t !== "light" && t !== "dark") return;
  root.dataset.theme = t;
  if (remember) {
    try {
      localStorage.setItem(KEY, t);
    } catch (e) {
      /* storage can be blocked; the page still works */
    }
  }
  listeners.forEach((f) => f(t));
}

export const toggle = () => set(current() === "dark" ? "light" : "dark");
export const onChange = (f) => listeners.push(f);
