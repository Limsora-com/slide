/* Style & theme checker: node tools/check-styles.js
   Guards the three things a white theme can silently break:
   1. every animation named in the CSS has a matching @keyframes block
   2. every text/figure colour combination reaches WCAG AA contrast
   3. every animated diagram draws inside its viewBox, with no dangling refs */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const css = read("assets/styles.css");
const appjs = read("assets/app.js");
const fails = [];
const ok = [];
const say = (cond, msg) => (cond ? ok : fails).push(msg);

/* ---------------- 1. keyframes, vars, animation names ----------------- */
const kf = new Set([...css.matchAll(/@keyframes\s+([A-Za-z0-9_-]+)/g)].map((m) => m[1]));
const NOISE = new Set(["none", "infinite", "alternate", "both", "backwards", "forwards", "ease",
  "ease-in", "ease-out", "ease-in-out", "linear", "running", "paused", "normal", "reverse"]);
const usedAnim = new Set();
[...css.matchAll(/animation(?:-name)?:\s*([^;{}]+)/g)].forEach((m) => {
  m[1].split(",").forEach((part) => part.trim().split(/\s+/).forEach((tok) => {
    if (/^[A-Za-z][A-Za-z0-9_-]*$/.test(tok) && !NOISE.has(tok)) usedAnim.add(tok);
  }));
});
usedAnim.forEach((n) => say(kf.has(n), `@keyframes ${n} exists`));
[...kf].forEach((n) => say(usedAnim.has(n), `@keyframes ${n} is used by a rule`));

const defined = new Set([...css.matchAll(/(--[A-Za-z0-9-]+)\s*:/g)].map((m) => m[1]));
[...appjs.matchAll(/setProperty\("(--[A-Za-z0-9-]+)"/g)].forEach((m) => defined.add(m[1]));
/* --i/--n/--slot/--dur/--tw and the accent set are handed over inline by app.js */
const INLINE = /^--(i|n|slot|dur|tw|accent(-ink|-soft|-line)?)$/;
[...css.matchAll(/var\((--[A-Za-z0-9-]+)/g)].forEach((m) => {
  if (INLINE.test(m[1])) return;
  say(defined.has(m[1]), `${m[1]} is defined`);
});

/* ---------------- 2. contrast on the light theme ---------------------- */
const vars = {};
[...css.matchAll(/^\s*(--[A-Za-z0-9-]+):\s*([^;]+);/gm)].forEach((m) => { if (!(m[1] in vars)) vars[m[1]] = m[2].trim(); });
const parse = (c) => {
  if (Array.isArray(c)) return c;
  c = String(c).trim();
  if (c.startsWith("#")) {
    let h = c.slice(1);
    if (h.length === 3) h = h.split("").map((x) => x + x).join("");
    const n = parseInt(h, 16);
    return isNaN(n) ? null : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = c.match(/rgba?\(([^)]+)\)/);
  return m ? m[1].split(",").slice(0, 3).map(Number) : null;
};
const lum = (rgb) => { const f = (v) => (v /= 255) <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]); };
const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
const blend = (fg, bgc, alpha) => fg.map((v, i) => Math.round(v * alpha + bgc[i] * (1 - alpha)));
const need = (tok) => { const v = parse(vars[tok]); if (!v) { fails.push(`cannot resolve colour var ${tok}`); return [0, 0, 0]; } return v; };

/* the shipped implementation, read out of app.js so this can never drift */
const impl = appjs.slice(appjs.indexOf("function hex2rgb"), appjs.indexOf("function styleFor"));
const accentTokens = new Function(impl + "; return accentTokens;")();

const bg = need("--bg"), surface = need("--surface"), WHITE = [255, 255, 255];
const pairs = [
  ["body text on the page", "--ink", bg, 4.5],
  ["body text on a card", "--ink", surface, 4.5],
  ["secondary text on a card", "--ink-2", surface, 4.5],
  ["secondary text on the page", "--ink-2", bg, 4.5],
  ["muted footer text", "--muted", surface, 4.5],
  ["muted text on a tinted panel", "--muted", need("--surface-2"), 4.5],
  ["text on surface-3", "--ink-2", need("--surface-3"), 4.5],
  ["danger text", "--bad", surface, 4.5],
  ["danger text on its tint", "--bad", need("--bad-soft"), 4.5],
  ["success text", "--good", surface, 4.5],
  ["success text on its tint", "--good", need("--good-soft"), 4.5],
  ["warning text", "--warn", surface, 4.5],
  ["warning text on its tint", "--warn", need("--warn-soft"), 4.5],
  ["white label on success chips", WHITE, need("--good"), 4.5],
  ["white label on danger chips", WHITE, need("--bad"), 4.5],
  ["default diagram ink (no var)", [0, 0, 0], surface, 4.5]
];
pairs.forEach(([label, token, onto, min]) => {
  const r = ratio(Array.isArray(token) ? token : need(token), onto);
  say(r >= min, `contrast ${label}: ${r.toFixed(2)}:1 (needs ${min})`);
});
say(ratio(bg, surface) < 1.35, `page and card surfaces stay close (${ratio(bg, surface).toFixed(2)}:1) so cards read as raised, not loud`);

const dataSrc = read("assets/data.js") + "\n" + read("assets/data2.js");
const topics = new Function(dataSrc + "\nreturn TOPICS_A.concat(TOPICS_B);")();
topics.forEach((t) => {
  const tk = accentTokens(t.accent);
  const inkRgb = parse(tk.ink);
  const onWhite = ratio(inkRgb, surface);
  const onSoft = ratio(inkRgb, blend(parse(t.accent), surface, 0.10));
  say(onWhite >= 4.5, `${t.id}: accent-ink on white = ${onWhite.toFixed(2)}:1`);
  say(onSoft >= 4.5, `${t.id}: accent-ink on its own tint = ${onSoft.toFixed(2)}:1`);
  say(ratio(WHITE, inkRgb) >= 4.5, `${t.id}: white label on an accent-ink button = ${ratio(WHITE, inkRgb).toFixed(2)}:1`);
  say(/^rgb\(/.test(tk.ink) && /^rgba?\(/.test(tk.soft) && /^rgba?\(/.test(tk.line), `${t.id}: accent tokens are well formed`);
});

/* white-on-accent is the classic light-theme trap: a rule that sets white text
   must never paint its background with the raw topic accent */
const whiteRules = (css.match(/\{[^{}]*\}/g) || []).filter((b) => /color:\s*(#fff|white|var\(--surface\))/.test(b));
say(whiteRules.length >= 4, `found ${whiteRules.length} rules with white text to audit`);
whiteRules.forEach((b) => {
  const bgs = (b.match(/background[^;]*;?/g) || []).join(" ");
  const raw = /var\(--accent\)(?!-)/.test(bgs) || /var\(--good\)/.test(bgs) && /var\(--accent\)(?!-)/.test(bgs);
  say(!raw, `rule "${b.replace(/\s+/g, " ").trim().slice(0, 44)}" keeps white text off the raw accent`);
});

/* ---------------- 3. diagram geometry -------------------------------- */
new Function(read("assets/anim.js"))();
const A = globalThis.DECK_ANIM;
say(!!A, "DECK_ANIM is reachable from node, so the diagrams are testable");
const W = 640, H = 210, PAD = 8;
const num = parseFloat;
if (A) {
  /* measure the real words, not placeholders — that is where overflow lives */
  const realFor = (kind) => {
    for (const t of topics) for (const s of t.slides) if (s.k === "diagram" && s.anim === kind) return [t, s];
    return [topics[0], { anim: kind, track: [["a", "b"]], items: [["a", "b"]] }];
  };
  const dgBlock = css.slice(css.indexOf(".dg {"));
  const dgCss = dgBlock.slice(0, Math.max(dgBlock.indexOf("@media print"), dgBlock.indexOf("@media (prefers")));
  const FS = { "dg-cap": 11.6, "dg-sub": 10.6, "dg-lbl": 11.6, "dg-tiny": 10, "dg-micro": 9.2, "dg-num": 12.6, "dg-ct": 11.6 };
  A.names.forEach((kind) => {
    let html = "";
    const [rtopic, rslide] = realFor(kind);
    const rt = rtopic.accent;
    try { html = A.build(kind, rslide, rtopic, (x) => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")); }
    catch (e) { fails.push(`${kind}: builder threw — ${e.message}`); return }
    if (/failed to render/.test(html)) { fails.push(`${kind}: builder threw — ${html.slice(0, 120)}`); return; }
    say(/<svg class="dg-svg"[^>]*viewBox="0 0 640 210"/.test(html), `${kind}: draws on a 640x210 viewBox`);
    say(/role="img" aria-label="[^"]{20,}"/.test(html), `${kind}: says what it shows to a screen reader`);
    say(/<figcaption>/.test(html), `${kind}: explains itself in a caption`);
    say(/data-act="replay"/.test(html), `${kind}: can be replayed`);
    say(/--slot:/.test(html), `${kind}: carries its own timing`);
    say(!/undefined|NaN|\[object/.test(html), `${kind}: no undefined or NaN leaked into the markup`);
    /* text must survive strict XML too (print pipelines are picky) */
    say(!/<(?![/!a-zA-Z])/.test(html), `${kind}: no raw "<" in text nodes`);
    say(!/&(?!amp;|lt;|gt;|quot;|#\d+;)/.test(html), `${kind}: no unescaped ampersands`);
    /* informational colour must be readable, so the raw accent is banned here */
    say(!/(fill|stroke): var\(--accent\)(?!-)/.test(dgCss), `${kind}: diagram colours use --accent-ink`);

    for (const [attr, max] of [["x", W], ["cx", W], ["x1", W], ["x2", W], ["y", H], ["cy", H], ["y1", H], ["y2", H]]) {
      [...html.matchAll(new RegExp(`\\b${attr}="(-?[\\d.]+)"`, "g"))].forEach((m) => {
        const v = num(m[1]);
        if (!(v >= -PAD && v <= max + PAD)) fails.push(`${kind}: ${attr}="${v}" is outside the canvas`);
      });
    }
    [...html.matchAll(/\bx="(-?[\d.]+)"[^>]*\bwidth="([\d.]+)"/g)].forEach((m) => {
      if (num(m[1]) + num(m[2]) > W + PAD) fails.push(`${kind}: rect overflows the right edge (${m[1]}+${m[2]})`);
    });
    [...html.matchAll(/\by="(-?[\d.]+)"[^>]*\bheight="([\d.]+)"/g)].forEach((m) => {
      if (num(m[1]) + num(m[2]) > H + PAD) fails.push(`${kind}: rect overflows the bottom edge (${m[1]}+${m[2]})`);
    });
    [...html.matchAll(/\bcx="(-?[\d.]+)"\s+cy="(-?[\d.]+)"[^>]*\br="([\d.]+)"/g)].forEach((m) => {
      const c = num(m[1]), cy = num(m[2]), r = num(m[3]);
      if (c - r < -PAD || c + r > W + PAD) fails.push(`${kind}: circle r=${r} at cx=${c} overflows sideways`);
      if (cy - r < -PAD || cy + r > H + PAD) fails.push(`${kind}: circle r=${r} at cy=${cy} overflows top/bottom`);
    });
    /* text is the thing that silently spills off a canvas: estimate its box
       from the class font size and require it to stay inside the figure */
    [...html.matchAll(/<text([^>]*)>([\s\S]*?)<\/text>/g)].forEach((m) => {
      const attrs = m[1], raw = m[2];
      const s = raw.replace(/<[^>]*>/g, "").replace(/&[a-z]+;|&#\d+;/g, "x").trim();
      if (!s) { fails.push(`${kind}: empty text node`); return; }
      const cls = (attrs.match(/class="([^"]*)"/) || [0, ""])[1].split(/\s+/);
      const size = Math.max(...cls.map((k) => FS[k] || 0), 9);
      const x = num((attrs.match(/x="(-?[\d.]+)"/) || [0, "0"])[0].replace(/[^\d.-]/g, ""));
      const y = num((attrs.match(/y="(-?[\d.]+)"/) || [0, "0"])[0].replace(/[^\d.-]/g, ""));
      const anchor = (attrs.match(/text-anchor="(\w+)"/) || [0, "start"])[1];
      const wEst = s.length * size * 0.545;
      const left = anchor === "middle" ? x - wEst / 2 : anchor === "end" ? x - wEst : x;
      const right = left + wEst;
      if (y < 11 || y > 203) fails.push(`${kind}: text baseline y=${y} clips ("${s.slice(0, 30)}")`);
      if (left < -3 || right > W + 3) fails.push(`${kind}: text spills sideways by ${Math.round(Math.max(-left, right - W))}px ("${s.slice(0, 34)}")`);
    });
    say(!/<text[^>]*>(?:(?!<\/text>)[\s\S])*<text/.test(html), `${kind}: no text element nested inside another`);
    {
      const groups = html.split(/<\/g>/);
      let offBox = 0;
      groups.forEach((g) => {
        const rect = g.match(/<rect[^>]*\bx="([\d.]+)"[^>]*\by="([\d.]+)"[^>]*\bwidth="([\d.]+)"[^>]*\bheight="([\d.]+)"/);
        if (!rect) return;
        const rl = +rect[1], rr = rl + +rect[3], rt = +rect[2], rb = rt + +rect[4];
        [...g.matchAll(/<text[^>]*\bx="([\d.]+)"[^>]*?(?:class="([^"]*)")?[^>]*>([^<]+)<\/text>/g)].forEach((m) => {
          const anchor = /text-anchor="middle"/.test(m[0]) ? "middle" : /text-anchor="end"/.test(m[0]) ? "end" : "start";
          const size = Math.max(...String(m[2] || "").split(/\s+/).map((k) => FS[k] || 0), 9);
          const w = m[3].replace(/&[a-z]+;|&#\d+;/g, "x").trim().length * size * 0.545;
          const l = anchor === "middle" ? +m[1] - w / 2 : anchor === "end" ? +m[1] - w : +m[1];
          const ty = +((m[0].match(/y="([\d.]+)"/) || [0, 0])[1]);
          if (ty <= rt || ty >= rb) return; /* annotation beside the box, not on it */
          const overlaps = l < rr && l + w > rl;      /* a side label is not on the box */
          if (overlaps && (l < rl - 2 || l + w > rr + 2)) offBox++;
        });
      });
      say(offBox === 0, `${kind}: every label fits the box it is drawn on${offBox ? " (" + offBox + " spill over)" : ""}`);
    }
    /* a panel painted after the marks it should sit behind hides them */
    const area = (tag) => {
      const m = [...html.matchAll(new RegExp(`<${tag}[^>]*\\bw(?:idth)?="([\\d.]+)"[^>]*h(?:eight)?="([\\d.]+)"`))];
      return m;
    };
    {
      const rects = [...html.matchAll(/<rect[^>]*>/g)].map((m) => {
        const g = (k) => +((m[0].match(new RegExp(k + '="([\d.]+)"')) || [0, 0])[1]);
        const inLate = html.slice(m.index).search(/<g class="dg-(vial|stop|col|node|row|sat|ask)"/) >= 0;
        return { w: g("width"), h: g("height"), late: inLate && g("width") * g("height") > 12000 };
      });
      const covering = rects.filter((r) => r.late);
      say(covering.length === 0, `${kind}: no large panel painted over its own contents`);
    }
    [...html.matchAll(/\bd="([^"]+)"/g)].forEach((m) => {
      const pts = (m[1].match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
      for (let i = 0; i + 1 < pts.length; i += 2) {
        if (pts[i] < -20 || pts[i] > W + 20 || pts[i + 1] < -20 || pts[i + 1] > H + 20)
          fails.push(`${kind}: path point (${pts[i]},${pts[i + 1]}) is far outside the canvas`);
      }
    });
    [...new Set((html.match(/class="[^"]+"/g) || []).flatMap((a) => a.slice(7, -1).split(/\s+/)))].forEach((cls) => {
      if (!/^(dg-|items|legend|fnum|flow|note)/.test(cls)) return;
      say(new RegExp("\\." + cls.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![\\w-])").test(css), `${kind}: .${cls} is styled`);
    });
    const nMax = num((html.match(/--n:(\d+)/) || [0, 0])[1]);
    const seqIdx = [...html.matchAll(/class="([^"]*)"[^>]*style="--i:(\d+)/g)]
      .filter((m) => /dg-(col|step|stop|row|node|sat|ask|layer|tick|zone|beat)\b/.test(m[1]))
      .map((m) => +m[2]);
    if (seqIdx.length) say(Math.max(...seqIdx) + 1 <= nMax,
      `${kind}: sequence reaches step ${Math.max(...seqIdx) + 1} inside --n:${nMax}`);
    const cycle = nMax * 1.5;
    say(cycle <= 14, `${kind}: the build completes in ${cycle.toFixed(1)}s (a presenter can wait for that)`);
    const lit = (html.match(/--i:\d/g) || []).length;
    say(lit >= 2, `${kind}: has ${lit} elements that light up in sequence`);
  });

  const want = topics.flatMap((t) => t.slides.filter((s) => s.k === "diagram").map((s) => s.anim));
  want.forEach((a) => say(A.names.includes(a), `content animation "${a}" has a builder`));
  A.names.forEach((a) => say(want.includes(a), `builder "${a}" is used by the content`));
}

/* ---------------- 4. light-theme hygiene ------------------------------ */
say(!/background:\s*var\(--bg2\)/.test(css), "no undefined surface tokens in use");
say(/@media print/.test(css) && /!important/.test(css.slice(css.indexOf("@media print"))), "print forces the built state of every diagram");
say(/prefers-reduced-motion/.test(css), "reduced-motion viewers get a static, legible diagram");
const dark = (css.match(/#0[0-9a-f]{5}/gi) || []).filter((h) => lum(parse(h)) > 0.5);
say(dark.length === 0, `no near-black-on-dark leftovers (${dark.join(", ") || "clean"})`);
say(/--bg:\s*#(f|e)/i.test(css), "the page background is light, as the white theme requires");

/* ---------------- report -------------------------------------------- */
console.log(`${ok.length} checks passed`);
if (fails.length) {
  console.log(`${fails.length} FAILED:`);
  [...new Set(fails)].forEach((f) => console.log("  ✗ " + f));
  process.exit(1);
}
console.log("styles, contrast and diagram geometry: all good");
