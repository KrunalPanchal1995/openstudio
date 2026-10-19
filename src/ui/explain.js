// One explainer: the figure, how to read it, the maths step by step, a worked example, questions with hidden answers,
// the live instruments that go with it, and where the figure came from.
import { h, clear, getJSON, append } from "../core/dom.js";

const put = (el, ...kids) => append(el, kids);
import { tex } from "../core/math.js";
import { href } from "../core/router.js";
import * as theme from "../core/theme.js";
import { asset } from "../core/assets.js";

const view = () => document.getElementById("view");

function mathLine(src) {
  const el = h("div.tex");
  tex(el, src, true);
  return el;
}

function inlineMath(text) {
  return text;
}

function reveal(label, body) {
  return h("details.reveal", h("summary", label), h("div.reveal__body", body));
}

function liveLink(l) {
  const route = typeof l === "string" ? l : l.route;
  const label = typeof l === "string" ? route : l.label || route;
  return h("a.live", { href: "#" + route }, label);
}

function figure(m) {
  const dark = theme.current() === "dark";
  const src = dark ? m.src : m.src_light || m.src;
  return h(
    "figure.fig",
    m.kind === "video" || m.video
      ? h("p.note", "A video version of this figure is planned for the Manim reels.")
      : null,
    h("img", { src: asset(src), alt: m.alt, "data-dark": asset(m.src), "data-light": asset(m.src_light || m.src) }),
    m.caption ? h("figcaption", m.caption) : null,
    h("details.reveal", h("summary", "Describe this figure in words"), h("p", m.alt))
  );
}

const list = (items) => h("ul", items.map((i) => h("li", inlineMath(i))));

export async function explain(id) {
  const root = clear(view());
  let d;
  try {
    d = await getJSON("data/explainers/" + encodeURIComponent(id) + ".json");
  } catch (e) {
    return put(root, h("p", "That lesson was not found. "), h("a", { href: "#subjects" }, "All subjects"));
  }
  const rf = d.read_the_figure || {};
  const worked = d.apply && d.apply.worked;
  const subj = d.subjects && d.subjects[0];
  put(root, 
    h("p.crumb", h("a", { href: "#subjects" }, "Subjects"), subj ? [" / ", h("a", { href: href("subjects", { s: subj }) }, subj)] : null, " / ", d.type),
    h("article.lesson",
      h("header", h("p.eyebrow", d.type + (d.status === "draft" ? " · draft" : "")), h("h1", d.title), h("p.lede", d.summary)),
      figure(d.media),
      h("section", h("h2", "Read the figure"),
        rf.question ? h("p", h("b", "Question. "), rf.question) : null,
        rf.axes ? h("p", h("b", "Axes. "), rf.axes) : null,
        rf.look_at && rf.look_at.length ? [h("p", h("b", "Look at")), list(rf.look_at)] : null,
        rf.proves ? h("p", h("b", "What it shows. "), rf.proves) : null,
        rf.if_wrong ? h("p", h("b", "If it looks wrong. "), rf.if_wrong) : null,
        rf.must_check ? h("p", h("b", "Check before trusting it. "), rf.must_check) : null),
      d.live && d.live.length ? h("section", h("h2", "Try it live"), h("ul.list", d.live.map((l) => h("li", liveLink(l))))) : null,
      d.understand && d.understand.length
        ? h("section", h("h2", "Understand"), d.understand.map((u) => (typeof u === "string" ? h("p", u) : h("div", h("h3", u.title), h("p", u.text)))))
        : null,
      d.steps && d.steps.length
        ? h("section", h("h2", "The maths, step by step"),
            h("ol.steps", d.steps.map((s) => h("li", h("h3", s.title), mathLine(s.tex), s.note ? h("p", s.note) : null, s.live ? h("p", liveLink(s.live)) : null))))
        : null,
      d.remember && d.remember.length ? h("section", h("h2", "Remember"), list(d.remember)) : null,
      d.terms && d.terms.length
        ? h("section", h("h2", "Terms"), h("dl.terms", d.terms.map((t) => [h("dt", t.term, t.symbol ? h("span.sym", " " + t.symbol) : null), h("dd", t.meaning)])))
        : null,
      worked
        ? h("section", h("h2", "Worked example"), h("h3", worked.title), h("p", worked.problem),
            h("ol", worked.solution.map((s) => h("li", h("p", s.text), s.tex ? mathLine(s.tex) : null))),
            h("p.answer", h("b", "Answer. "), worked.answer))
        : null,
      d.apply && d.apply.code ? h("section", h("h2", "Code"), h("pre", h("code", typeof d.apply.code === "string" ? d.apply.code : JSON.stringify(d.apply.code, null, 2)))) : null,
      ["analyze", "evaluate"].map((k) =>
        d[k] && d[k].length
          ? h("section", h("h2", k === "analyze" ? "Analyse" : "Evaluate"), d[k].map((q) => h("div.q", h("p", q.q), q.hint ? reveal("Hint", h("p", q.hint)) : null)))
          : null
      ),
      d.create && d.create.length ? h("section", h("h2", "Create"), list(d.create)) : null,
      d.checks && d.checks.length
        ? h("section", h("h2", "Check yourself"), d.checks.map((c) => h("div.q", h("p", h("span.chip", c.tier), " ", c.q), c.hint ? reveal("Hint", h("p", c.hint)) : null, reveal("Answer", h("p", c.answer)))))
        : null,
      d.values && d.values.length
        ? h("section", h("h2", "Numbers used"), h("table.values", h("thead", h("tr", h("th", "Quantity"), h("th", "Value"), h("th", "From"))),
            h("tbody", d.values.map((v) => h("tr", h("td", v.label), h("td", v.value), h("td", v.from))))))
        : null,
      h("footer.src", h("h2", "Source"), d.source && d.source.note ? h("p", d.source.note) : null,
        d.source && d.source.project_url ? h("p", h("a", { href: "https://krunalpanchal1995.github.io" + d.source.project_url }, d.source.project_title || "Project page")) : null,
        d.cite && d.cite.length ? h("p.meta", "References: " + d.cite.join(", ")) : null,
        d.provenance ? h("p.meta", `Written ${d.provenance.date}${d.provenance.reviewed_by_owner ? "" : ", not yet reviewed by the owner"}. ${d.provenance.notes || ""}`) : null)
    )
  );
}
