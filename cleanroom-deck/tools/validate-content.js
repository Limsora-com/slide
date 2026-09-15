/* Content validator: node tools/validate-content.js
   Fails the build when the deck data would render broken slides. */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const src = ["assets/data.js", "assets/data2.js"]
  .map((f) => fs.readFileSync(path.join(root, f), "utf8"))
  .join("\n");

const ctx = new Function(src + "\nreturn TOPICS_A.concat(TOPICS_B);");
const topics = ctx();

const KNOWN = ["intro", "points", "cards", "table", "flow", "split", "stats", "callout", "quiz", "end", "diagram"];

/* the animation library has to stay in step with the content: every diagram
   slide names a builder that exists, and no builder sits unused */
new Function(fs.readFileSync(path.join(root, "assets", "anim.js"), "utf8"))();
const ANIMS = new Set((globalThis.DECK_ANIM || { names: [] }).names);
const animUsed = new Map();
const errors = [];
const warns = [];
const say = (arr, msg) => arr.push(msg);

if (topics.length !== 9) say(errors, `expected 9 topics, found ${topics.length}`);

let totalSlides = 0, words = 0;
topics.forEach((t, i) => {
  const at = `topic ${i + 1} (${t.id})`;
  ["id", "title", "tagline", "icon", "accent", "slides"].forEach((k) => {
    if (!t[k]) say(errors, `${at}: missing "${k}"`);
  });
  if (t.n !== i + 1) say(errors, `${at}: index n=${t.n} should be ${i + 1}`);
  if (!/^#[0-9a-f]{6}$/i.test(t.accent || "")) say(errors, `${at}: accent is not a hex colour`);
  if (!t.refs || t.refs.length < 1) say(errors, `${at}: no regulatory refs`);
  if (t.slides.length < 6) say(warns, `${at}: only ${t.slides.length} slides`);
  if (!t.slides.some((s) => s.k === "quiz")) say(errors, `${at}: no quiz slide`);
  if (t.slides[t.slides.length - 1].k !== "end") say(errors, `${at}: last slide must be the takeaways slide`);

  t.slides.forEach((s, j) => {
    const where = `${at} slide ${j + 1}`;
    totalSlides++;
    if (!KNOWN.includes(s.k)) return say(errors, `${where}: unknown layout "${s.k}"`);
    if (s.k === "diagram") {
      if (!s.anim) say(errors, `${where}: diagram slide has no "anim"`);
      else if (!ANIMS.has(s.anim)) say(errors, `${where}: diagram slide names unknown animation "${s.anim}"`);
      else animUsed.set(s.anim, (animUsed.get(s.anim) || 0) + 1);
      if (!(s.items || []).length) say(errors, `${where}: diagram slide needs legend items`);
      if (!(s.items || []).every((x) => Array.isArray(x) && x.length === 2))
        say(errors, `${where}: diagram legend items must be [title, description]`);
      if (!s.note) say(warns, `${where}: diagram slide has no takeaway note`);
    }
    if (s.anim && s.k !== "diagram") say(errors, `${where}: "anim" is only valid on a diagram slide`);
    if (!s.t) say(errors, `${where}: no title`);
    if (s.k === "intro") {
      if (!s.lead || !s.objectives) say(errors, `${where}: intro needs lead + objectives`);
      if (j !== 0) say(warns, `${where}: intro is not the first slide`);
    }
    if (s.k === "points" && !(s.items || []).every((x) => Array.isArray(x) && x.length === 2))
      say(errors, `${where}: points items must be [title, description]`);
    if (s.k === "cards" && !(s.items || []).every((x) => Array.isArray(x) && x.length === 3))
      say(errors, `${where}: cards items must be [icon, title, description]`);
    if (s.k === "stats" && !(s.items || []).every((x) => Array.isArray(x) && x.length >= 2))
      say(errors, `${where}: stats items must be [value, label, detail?]`);
    if (s.k === "flow" && (s.steps || []).length > 8)
      say(warns, `${where}: ${s.steps.length} flow steps will crowd the slide`);
    if (s.k === "table") {
      const cols = (s.cols || []).length;
      if (!cols) say(errors, `${where}: table has no cols`);
      (s.rows || []).forEach((r, ri) => {
        if (r.length !== cols) say(errors, `${where}: row ${ri + 1} has ${r.length} cells, header has ${cols}`);
      });
    }
    if (s.k === "split") {
      ["left", "right"].forEach((side) => {
        if (!s[side] || !s[side].h || !s[side].items) say(errors, `${where}: split.${side} needs h + items`);
      });
    }
    if (s.k === "quiz") {
      (s.questions || []).forEach((q, qi) => {
        if (!q.q || !Array.isArray(q.opts) || q.opts.length < 2) say(errors, `${where} q${qi + 1}: malformed question`);
        if (!(q.a >= 0 && q.a < q.opts.length)) say(errors, `${where} q${qi + 1}: answer index ${q.a} out of range`);
        if (!q.why) say(errors, `${where} q${qi + 1}: missing rationale`);
        if (new Set(q.opts).size !== q.opts.length) say(warns, `${where} q${qi + 1}: duplicate options`);
      });
      if ((s.questions || []).length < 3) say(warns, `${where}: fewer than 3 questions`);
    }
    // length sanity: keep slides readable
    const flat = JSON.stringify(s);
    (flat.match(/"[^"]{240,}"/g) || []).forEach((x) =>
      say(warns, `${where}: very long string (${x.length - 2} chars) may overflow`)
    );
    words += flat.replace(/[^A-Za-z0-9'’-]+/g, " ").split(/\s+/).filter(Boolean).length;
  });

  if (new Set(t.slides.map((s) => s.t)).size !== t.slides.length)
    say(warns, `${at}: duplicate slide titles`);
});

const ids = topics.map((t) => t.id);
if (new Set(ids).size !== ids.length) say(errors, `duplicate topic ids: ${ids.join(", ")}`);

console.log("topics      :", topics.length);
console.log("slides      :", totalSlides, "(" + topics.map((t) => t.slides.length).join(", ") + ")");
console.log("words       :", words);
console.log("diagrams    :", [...animUsed.values()].reduce((a, b) => a + b, 0), "slides using", animUsed.size, "of", ANIMS.size, "builders");
const unused = [...ANIMS].filter((n) => !animUsed.has(n));
if (unused.length) say(errors, `unused animation builders: ${unused.join(", ")}`);
console.log("errors      :", errors.length);
errors.forEach((e) => console.log("  ✗ " + e));
console.log("warnings    :", warns.length);
warns.forEach((w) => console.log("  ! " + w));
process.exit(errors.length ? 1 : 0);
