/* Inlines CSS + JS into one portable file you can e-mail or open offline.
   Usage: node tools/build-standalone.js  ->  cleanroom-gmp-deck.html      */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const out = path.join(root, "cleanroom-gmp-deck.html");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

let html = read("index.html");

// swap the stylesheet link for the CSS itself
html = html.replace(
  /<link rel="stylesheet" href="assets\/styles\.css">/,
  "<style>\n" + read("assets/styles.css") + "\n</style>"
);

// swap the three script tags for their contents (order matters)
html = html.replace(
  /<script src="assets\/data\.js"><\/script>\s*<script src="assets\/data2\.js"><\/script>\s*<script src="assets\/app\.js"><\/script>/,
  "<script>\n" +
  read("assets/data.js") + "\n" +
  read("assets/data2.js") + "\n" +
  read("assets/app.js") + "\n</script>"
);

const leftovers = html.match(/<script src=|assets\//g);
if (leftovers) {
  console.error("✗ standalone build did not inline everything:", leftovers);
  process.exit(1);
}

fs.writeFileSync(out, html);
const kb = (fs.statSync(out).size / 1024).toFixed(1);
console.log(`✓ cleanroom-gmp-deck.html written (${kb} KB, single file, works from file://)`);
