// KaTeX is vendored (vendor/katex, v0.16.9) and loaded on first use.
let ready = null;

function load() {
  if (!ready) {
    ready = new Promise((resolve, reject) => {
      if (window.katex) return resolve(window.katex);
      const s = document.createElement("script");
      s.src = new URL("vendor/katex/katex.min.js", document.baseURI).href;
      s.onload = () => resolve(window.katex);
      s.onerror = () => reject(new Error("KaTeX failed to load"));
      document.head.append(s);
    });
  }
  return ready;
}

/** Render TeX into el (display mode by default). Falls back to the raw TeX text if KaTeX is unavailable. */
export async function tex(el, src, display = true) {
  el.textContent = src;
  try {
    const k = await load();
    k.render(src, el, { displayMode: display, throwOnError: false, output: "htmlAndMathml" });
  } catch (e) {
    el.classList.add("tex--raw");
  }
  return el;
}
