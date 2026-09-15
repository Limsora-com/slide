/* =====================================================================
   EXPLANATORY ANIMATIONS — pure SVG + CSS, no dependencies.
   Each builder returns markup for a "diagram" slide: geometry that moves
   so the mechanism is visible, plus a legend. All motion is CSS, driven by
   --slot / --i custom properties and gated on .slide.play, so nothing runs
   until a slide is on screen and everything has a legible static state when
   the viewer prefers reduced motion.
   Canvas is 640 x 210.
   ===================================================================== */
var DECK_ROOT = typeof window !== "undefined" ? window : globalThis;
DECK_ROOT.DECK_ANIM = (function () {
  "use strict";

  var W = 640, H = 210;
  var SLOT = 1.5; /* seconds each step stays lit */

  /* ------------------------------ atoms -------------------------------- */
  function box(x, y, w, h, cls, label, i) {
    var st = i != null ? ' style="--i:' + i + '"' : "";
    /* a caller may hand us a plain label or already-built markup; nesting a
       <text> inside the one we generate would render in the wrong place */
    var inner = !label ? "" : /^\s*</.test(label) ? label :
      '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 4) + '" class="dg-ct" text-anchor="middle">' + label + "</text>";
    return '<g class="' + (cls || "") + '"' + st + '><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8"></rect>' + inner + "</g>";
  }
  function txt(x, y, s, cls, anchor) {
    return '<text x="' + x + '" y="' + y + '"' + (cls ? ' class="' + cls + '"' : "") +
      (anchor ? ' text-anchor="' + anchor + '"' : "") + ">" + s + "</text>";
  }
  function dot(cx, cy, r, cls, i) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="' + (cls || "dg-dot") + '"' +
      (i != null ? ' style="--i:' + i + '"' : "") + "></circle>";
  }
  function line(x1, y1, x2, y2, cls, i) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + (cls || "dg-line") + '"' +
      (i != null ? ' style="--i:' + i + '"' : "") + "></line>";
  }
  function arrow(x1, y1, x2, y2, cls, i) {
    return '<g class="' + (cls || "dg-arw") + '"' + (i != null ? ' style="--i:' + i + '"' : "") + ">" +
      line(x1, y1, x2, y2, "dg-arw-l") + '<polygon points="' + x2 + "," + y2 + " " + (x2 - 7) + "," + (y2 - 4) + " " + (x2 - 7) + "," + (y2 + 4) + '"></polygon></g>';
  }
  /* text metrics: one estimate shared by every builder, so a label that is
     measured to fit here can never be measured to overflow by the test */
  function textW(str, size) { return String(str).length * size * 0.55; }
  function clip(str, size, maxW) {
    str = String(str);
    if (textW(str, size) <= maxW) return str;
    var n = Math.max(4, Math.floor(maxW / (size * 0.55)) - 1);
    return str.slice(0, n).replace(/[\s,;:.\u2013-]+$/, "") + "\u2026";
  }
  function lines(str, size, maxW, max) {
    max = max || 2;
    var out = [""], i = 0;
    String(str).split(" ").forEach(function (w) {
      var join = (out[i] ? out[i] + " " : "") + w;
      if (out[i] && textW(join, size) > maxW && i + 1 < max) { out[++i] = w; }
      else out[i] = join;
    });
    out[i] = clip(out[i], size, maxW);
    return out;
  }

  /* deterministic pseudo-random, so a diagram looks the same every load */
  function rnd(seed) { var s = seed % 2147483647; if (s <= 0) s += 2147483646; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function scatter(n, x, y, w, h, seed, cls) {
    var r = rnd(seed), out = [];
    for (var i = 0; i < n; i++) {
      out.push(dot((x + r() * w).toFixed(1), (y + r() * h).toFixed(1), (1.6 + r() * 1.6).toFixed(1), cls || "dg-dot", i));
    }
    return out.join("");
  }
  function stage(inner, caption, n) {
    /* --n sizes the loops in CSS, so it must cover the largest --i actually
       emitted, not only what the caller guessed */
    var seen = 0;
    /* only the elements that light up one after another extend the build;
       a field of 20 drifting particles must not stretch it to 30 seconds */
    inner.replace(/class="([^"]*)"[^>]*style="--i:(\d+)/g, function (m, cls, v) {
      if (/dg-(col|step|stop|row|node|sat|ask|layer|tick|zone|beat)\b/.test(cls)) seen = Math.max(seen, +v + 1);
      return m;
    });
    n = Math.min(9, Math.max(n || 0, seen) || 1);
    var speak = String(caption || "").replace(/<[^>]+>/g, "").replace(/"/g, "&quot;");
    return '<figure class="dg" style="--slot:' + SLOT + "s;--n:" + n + '">' +
      '<svg class="dg-svg" viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + speak + '">' + inner + "</svg>" +
      (caption ? '<figcaption>' + caption + "</figcaption>" : "") +
      '<button class="dg-replay" data-act="replay" title="Replay animation" aria-label="Replay animation">↻</button>' +
      "</figure>";
  }
  function legend(items, esc) {
    if (!items || !items.length) return "";
    return '<ul class="items col-' + (items.length > 2 ? 3 : items.length) + ' legend">' + items.map(function (it, i) {
      return '<li style="--i:' + i + '"><b>' + esc(it[0]) + "</b><span>" + esc(it[1]) + "</span></li>";
    }).join("") + "</ul>";
  }

  /* ========================== 1. grade limits ========================= */
  function grades() {
    var g = [
      { n: "A", v: 3520, d: "Grade A · critical zone" },
      { n: "B", v: 3520, d: "Grade B · at rest" },
      { n: "C", v: 352000, d: "Grade C · at rest" },
      { n: "D", v: 3520000, d: "Grade D · at rest" }
    ];
    var out = "", bw = 118, gap = 24, x0 = (W - (bw * 4 + gap * 3)) / 2;
    out += line(x0 - 12, 168, W - x0 + 12, 168, "dg-axis");
    out += txt(x0 - 16, 30, "particles ≥0.5 µm / m³", "dg-cap", "start");
    out += txt(x0 - 16, 45, "log scale — each bar is 10× the previous", "dg-sub", "start");
    g.forEach(function (c, i) {
      var t = (Math.log10(c.v) - 3) / 4;
      var h = 18 + t * 122;
      var x = x0 + i * (bw + gap);
      var dots = Math.max(3, Math.round(3 + t * 22));
      out += '<g class="dg-col" style="--i:' + i + '">';
      out += '<rect class="dg-bar" x="' + x + '" y="' + (168 - h) + '" width="' + bw + '" height="' + h + '" rx="6"></rect>';
      out += '<rect class="dg-bar-hit" x="' + x + '" y="' + (168 - h) + '" width="' + bw + '" height="' + h + '" rx="6"></rect>';
      out += '<g class="dg-dens">' + scatter(dots, x + 8, 168 - h + 6, bw - 16, Math.max(6, h - 12), 7 + i * 13, "dg-dot soft") + "</g>";
      out += txt(x + bw / 2, 184, c.d, "dg-lbl", "middle");
      out += txt(x + bw / 2, (168 - h) - 8, c.v.toLocaleString("en-GB").replace(/,/g, " "), "dg-num", "middle");
      out += "</g>";
    });
    return stage(out, "Annex 1 Table 1: “3 520” and “3 520 000” are two different worlds — the fill zone carries roughly a thousand times fewer particles than a Grade D corridor.", 4);
  }

  /* ========================= 2. pressure cascade ====================== */
  function cascade() {
    var rooms = [
      { t: "Grade A", p: "+45", h: 116 }, { t: "Grade B", p: "+30", h: 96 },
      { t: "Airlock", p: "+20", h: 78 }, { t: "Grade C", p: "+10", h: 60 },
      { t: "Gown / D", p: "0", h: 42 }
    ];
    var out = "", bw = 104, gap = 16, x0 = 34, base = 176;
    out += line(14, base, W - 14, base, "dg-axis");
    rooms.forEach(function (r, i) {
      var x = x0 + i * (bw + gap);
      out += '<g class="dg-col" style="--i:' + i + '">';
      out += '<rect class="dg-bar tall" x="' + x + '" y="' + (base - r.h) + '" width="' + bw + '" height="' + r.h + '" rx="7"></rect>';
      out += txt(x + bw / 2, base - r.h - 20, r.p + " Pa", "dg-num", "middle");
      out += txt(x + bw / 2, base - r.h - 6, r.t, "dg-lbl", "middle");
      out += "</g>";
      if (i < rooms.length - 1) {
        var ay = base - r.h + 14;
        out += '<g class="dg-push" style="--i:' + i + '">' + arrow(x + bw - 2, ay, x + bw + gap + 4, ay, "dg-arw on") + "</g>";
        out += txt(x + bw + gap / 2, ay - 8, "≥10 Pa", "dg-tiny", "middle");
      }
    });
    /* a door cracks open: air leaves the clean area, then the room recovers */
    out += '<g class="dg-leak">' + line(378, 120, 378, 174, "dg-warn-line") +
      '<circle cx="386" cy="130" r="5" class="dg-dot hot"></circle>' +
      '<path d="M386 130 C 398 140 398 154 386 164" class="dg-warn-path"></path>' +
      txt(14, 200, "air leaves while the door is open — then the room returns to grade inside the clean-up time", "dg-tiny", "start") + "</g>";
    return stage(out, "Air always travels clean → less clean. Every boundary keeps at least 10 Pa, so when a door cracks open the air leaves the clean area — it never arrives into it.", rooms.length);
  }

  /* ====================== 3. first air / UDAF sweep =================== */
  function udaf() {
    var out = "", x0 = 60, x1 = W - 60;
    out += '<rect class="dg-hepa" x="' + (x0 - 16) + '" y="22" width="' + (x1 - x0 + 32) + '" height="18" rx="4"></rect>';
    for (var i = 0; i < 26; i++) {
      var hx = x0 - 12 + i * ((x1 - x0 + 24) / 25);
      out += line(hx, 24, hx, 38, "dg-hatch");
    }
    out += txt(x0 - 16, 16, "HEPA H14 · unidirectional airflow", "dg-cap", "start");
    for (var s = 0; s < 15; s++) {
      var sx = x0 + 6 + s * ((x1 - x0 - 12) / 14);
      out += line(sx, 46, sx, 150, "dg-stream") + '<polygon class="dg-stream-head" points="' + (sx - 3.5) + ',150 ' + (sx + 3.5) + ',150 ' + sx + ',158" style="--i:' + s + '"></polygon>';
    }
    /* the fill line: vials under first air */
    for (var v = 0; v < 9; v++) {
      var vx = x0 + 30 + v * ((x1 - x0 - 60) / 8);
      out += '<g class="dg-vial" style="--i:' + v + '"><rect x="' + vx + '" y="158" width="16" height="30" rx="3"></rect></g>';
    }
    out += txt(x0 + 6, 200, "open product — nothing may pass over it between the filter and here", "dg-tiny", "start");
    /* an obstructing hand + turbulence */
    var hx = x0 + 150;
    out += '<g class="dg-hand"><rect x="' + hx + '" y="96" width="86" height="26" rx="12"></rect>' +
      '<path d="M' + (hx + 8) + ' 132 q 12 14 -2 26 q -14 12 2 24" class="dg-warn-path"></path>' +
      txt(hx + 92, 112, "an arm across first air: the zone behind it is unprotected", "dg-tiny", "start") + "</g>";
    /* particles swept away */
    out += '<g class="dg-swept">' + dot(x1 - 40, 60, 3, "dg-dot hot") + dot(x1 - 78, 96, 2.4, "dg-dot hot") + dot(hx - 26, 74, 2.8, "dg-dot hot") + "</g>";
    return stage(out, "0.36–0.54 m/s of filtered air sweeps down over the critical zone and carries anything that falls into it away from the product — which is why what you place above the line matters more than what you wear.", 8);
  }

  /* ========================= 4. gowning build ========================= */
  function gown() {
    var cx = 150, out = "";
    /* person */
    out += '<g class="dg-person">' + dot(cx, 58, 15, "dg-fig") + '<rect x="' + (cx - 20) + '" y="76" width="40" height="66" rx="12" class="dg-fig"></rect>' +
      line(cx - 12, 142, cx - 14, 186, "dg-fig thick") + line(cx + 12, 142, cx + 14, 186, "dg-fig thick") + "</g>";
    /* shed particles, fading as layers arrive */
    var r = rnd(31), shed = "";
    for (var i = 0; i < 26; i++) {
      shed += dot((cx - 52 + r() * 104).toFixed(1), (40 + r() * 150).toFixed(1), (1.4 + r() * 1.7).toFixed(1), "dg-dot shed", i);
    }
    out += '<g class="dg-shed">' + shed + "</g>";
    /* layers, each lighting up in sequence */
    var layers = [
      { t: "hair + beard cover", y: 42, h: 22, w: 44, x: cx - 22, r: 11 },
      { t: "mask", y: 62, h: 12, w: 30, x: cx - 15, r: 6 },
      { t: "goggles", y: 50, h: 9, w: 40, x: cx - 20, r: 4 },
      { t: "coverall", y: 76, h: 70, w: 52, x: cx - 26, r: 14 },
      { t: "boots", y: 146, h: 40, w: 40, x: cx - 20, r: 6 },
      { t: "gloves ×2 + IPA", y: 100, h: 16, w: 78, x: cx - 39, r: 8 }
    ];
    layers.forEach(function (L, i) {
      out += '<rect class="dg-layer" x="' + L.x + '" y="' + L.y + '" width="' + L.w + '" height="' + L.h + '" rx="' + L.r + '" style="--i:' + i + '"></rect>';
    });
    /* the checklist to the right */
    var steps = ["remove outer wear, no cosmetics", "wash + dry, first stage only", "first step: hair, mask, coverall", "disinfect hands, sterile IPA", "second step: sterile gown + gloves", "mirror check, then enter"];
    var outX = 300;
    out += txt(outX, 26, "each step is a barrier; the order is the validation", "dg-cap", "start");
    steps.forEach(function (s, i) {
      var y = 46 + i * 26;
      out += '<g class="dg-step" style="--i:' + i + '"><rect x="' + outX + '" y="' + y + '" width="14" height="14" rx="4" class="dg-box"></rect>' +
        '<path d="M' + (outX + 3) + " " + (y + 8) + " l 3.4 3.6 l 5.6 -8" + '" class="dg-tick"></path>' +
        txt(outX + 24, y + 12, s, "dg-lbl", "start") + "</g>";
    });
    return stage(out, "Personnel are the dominant source: a shed skin fleck carries organisms with it. Gowning is built up layer by layer, in a validated order, and the shedding stops at the garment.", steps.length);
  }

  /* ========================== 5. media fill / APS ===================== */
  function aps() {
    var out = "", n = 16, x0 = 42, y0 = 96, step = (W - x0 * 2) / (n - 1);
    out += txt(x0 - 20, 34, "filling the line with nutrient medium instead of product", "dg-cap", "start");
    /* the chamber is scenery: it has to be drawn before the vials sit in it */
    out += '<g class="dg-inc"><rect x="' + (x0 - 20) + '" y="' + (y0 - 26) + '" width="' + (W - x0 * 2 + 40) + '" height="100" rx="12"></rect>' +
      txt(W / 2, y0 - 34, "incubate 20–25 °C then 30–35 °C · every unit read", "dg-tiny", "middle") + "</g>";
    for (var i = 0; i < n; i++) {
      var x = x0 + i * step;
      out += '<g class="dg-vial" style="--i:' + i + '"><rect x="' + x + '" y="' + y0 + '" width="20" height="46" rx="4"></rect>' +
        '<rect class="dg-fill" x="' + (x + 2) + '" y="' + (y0 + 26) + '" width="16" height="18" rx="3"></rect></g>';
    }
    out += '<g class="dg-growth">' + dot(x0 + 11 * step + 10, y0 + 34, 6, "dg-dot hot") + '<path d="M' + (x0 + 11 * step + 10) + ' ' + (y0 - 12) + " v -14\" class=\"dg-warn-line\"></path>" +
      txt(W - 20, y0 - 34, "turbidity = growth", "dg-tiny hot", "end") + "</g>";
    out += txt(x0 - 20, 184, "worst case: max operators, every intervention, ≥4 h, 5 000–10 000 units, every shift", "dg-tiny", "start");
    out += txt(x0 - 20, 200, "one contaminated unit → failed simulation, investigation, corrective action, three consecutive successful runs", "dg-tiny hot", "start");
    return stage(out, "The aseptic process simulation is the only test that proves people, gowning, behaviour and the barrier can work together on your line — because it rehearses the real thing.", n);
  }

  /* ================== 6. disinfection log reduction =================== */
  function logred() {
    var rows = [
      { t: "Bioburden on surface", v: "10⁴", w: 1.0, c: "hot" },
      { t: "After detergent", v: "10³", w: 0.78, c: "" },
      { t: "After disinfectant", v: "10¹", w: 0.42, c: "" },
      { t: "After sporicidal", v: "10⁰", w: 0.16, c: "ok" }
    ];
    var out = "", x0 = 210, bw = W - x0 - 70;
    out += txt(x0, 26, "log reduction, proven on your surface", "dg-cap", "start");
    out += txt(x0, 40, "two agents with different modes of action, each with its own contact time", "dg-micro", "start");
    rows.forEach(function (r, i) {
      var y = 44 + i * 34;
      out += '<g class="dg-row" style="--i:' + i + '">';
      out += txt(x0 - 12, y + 15, r.t, "dg-lbl", "end");
      out += '<rect x="' + x0 + '" y="' + y + '" width="' + bw + '" height="22" rx="6" class="dg-track"></rect>';
      out += '<rect x="' + x0 + '" y="' + y + '" width="' + (bw * r.w).toFixed(1) + '" height="22" rx="6" class="dg-bar ' + r.c + '"></rect>';
      out += txt(x0 + bw + 10, y + 15, r.v + " CFU", "dg-num", "start");
      out += "</g>";
    });
    /* organisms disappearing */
    var r2 = rnd(77), dots = "";
    for (var i = 0; i < 40; i++) {
      dots += dot((x0 + 6 + r2() * (bw * 0.94)).toFixed(1), (178 + r2() * 20).toFixed(1), 2.1, "dg-dot kill", i);
    }
    out += '<g class="dg-kill">' + dots + "</g>";
    out += txt(14, 194, "one log per step", "dg-tiny", "start");
    return stage(out, "Disinfection is not a wipe — it is a validated reduction. Clean first, use two agents with different modes of action, honour the contact time, and take sporicidals round on schedule.", rows.length + 2);
  }

  /* ===================== 7. EM trend & limits ========================= */
  function emtrend() {
    var x0 = 40, x1 = W - 110, yTop = 40, yBot = 158;
    var pts = [8, 12, 6, 18, 10, 22, 14, 46, 16, 11, 20, 9];
    var out = "";
    out += line(x0, yBot, x1 + 60, yBot, "dg-axis") + line(x0, yTop - 12, x0, yBot, "dg-axis");
    out += txt(x0, yTop - 18, "CFU per plate", "dg-cap", "start");
    /* control / alert / action bands */
    out += '<rect x="' + x0 + '" y="' + (yBot - 70) + '" width="' + (x1 - x0 + 60) + '" height="70" class="dg-band"></rect>';
    out += line(x0, yBot - 70, x1 + 60, yBot - 70, "dg-limit warn");
    out += txt(x1 + 66, yBot - 66, "alert", "dg-tiny warn", "start");
    out += line(x0, yBot - 104, x1 + 60, yBot - 104, "dg-limit hot");
    out += txt(x1 + 66, yBot - 100, "action", "dg-tiny hot", "start");
    var d = "", dots = "";
    pts.forEach(function (p, i) {
      var x = x0 + 12 + i * ((x1 - x0 - 4) / (pts.length - 1));
      var y = yBot - Math.min(112, p * 2.2);
      d += (i ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
      dots += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4" class="' + (p > 40 ? "dg-dot exc" : "dg-dot") + '" style="--i:' + i + '"></circle>';
    });
    out += '<path d="' + d + '" class="dg-plot"></path>' + dots;
    out += '<g class="dg-flag"><circle cx="' + (x0 + 12 + 7 * ((x1 - x0 - 4) / (pts.length - 1))) + '" cy="' + (yBot - 101) + '" r="11" class="dg-ring"></circle></g>';
    out += txt(x0, 186, "one point above action → deviation, organism ID, CAPA, batch impact assessment", "dg-tiny", "start");
    out += txt(x0, 202, "limits come from your own data: triggers for action, never specifications to meet", "dg-tiny", "start");
    return stage(out, "A single table of results proves nothing. Plotted against your own alert and action limits, the same data shows a state of control, a shift in flora, or a room that is drifting.", pts.length);
  }

  /* ================== 8. clean-up / recovery curve ==================== */
  function recovery() {
    var x0 = 40, x1 = W - 150, y0 = 40, y1 = 168;
    var out = "", d = "";
    for (var i = 0; i <= 24; i++) {
      var t = i / 24;
      var x = x0 + t * (x1 - x0);
      var y = y1 - (Math.exp(-3.4 * t) * (y1 - y0));
      d += (i ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
    }
    out += line(x0, y1, x1 + 6, y1, "dg-axis") + line(x0, y0 - 14, x0, y1, "dg-axis");
    out += txt(x0, 22, "particles ≥0.5 µm", "dg-cap", "start");
    out += line(x0, y0 + 8, x1 + 6, y0 + 8, "dg-limit ok");
    out += txt(x1 + 12, y0 + 12, "grade limit", "dg-tiny ok", "start");
    out += '<path d="' + d + '" class="dg-plot"></path>';
    for (var k = 0; k < 6; k++) out += '<g class="dg-puff" style="--i:' + k + '">' + dot(x0 + 30 + k * 26, y1 - 12 - k * 6, 3.2, "dg-dot") + "</g>";
    /* countdown ring */
    var cxx = x1 + 96, cyy = 104;
    out += '<g class="dg-clock"><circle cx="' + cxx + '" cy="' + cyy + '" r="34" class="dg-ring-bg"></circle>' +
      '<circle cx="' + cxx + '" cy="' + cyy + '" r="34" class="dg-ring-go"></circle>' +
      txt(cxx, cyy - 2, "&lt;20", "dg-num", "middle") + txt(cxx, cyy + 16, "min", "dg-tiny", "middle") + "</g>";
    out += txt(x1, 186, "clean-up time →", "dg-tiny", "end");
    out += txt(x0, 200, "100:1 recovery — the room clears 100× its own limit inside the qualified clean-up period", "dg-tiny", "start");
    return stage(out, "Air changes are what buy you the right to keep working. After an intervention, a door opening or a trip, the room flushes itself — and the recovery time is a measured number, not a hope.", 6);
  }

  /* ==================== 9. deviation lifecycle clock ================== */
  function timeline(s, topic, esc) {
    var steps = (s.track || s.steps || s.items || []).slice(0, 8);
    var out = "", n = steps.length, x0 = 76, x1 = W - 76, axis = 96, bw = 132, bh = 46;

    out += '<g class="dg-hold"><rect x="' + x0 + '" y="168" width="' + (x1 - x0) + '" height="12" rx="6" class="dg-track"></rect>' +
      '<rect x="' + x0 + '" y="168" width="' + (x1 - x0) + '" height="12" rx="6" class="dg-fill"></rect>' +
      txt((x0 + x1) / 2, 196, "the batch is on hold until the impact assessment is signed", "dg-tiny", "middle") + "</g>";
    out += line(x0 - 30, axis, x1 + 30, axis, "dg-axis");
    out += '<g class="dg-runner"><circle cx="' + x0 + '" cy="' + axis + '" r="7"></circle></g>';
    steps.forEach(function (st, i) {
      var x = n > 1 ? x0 + i * ((x1 - x0) / (n - 1)) : x0;
      var top = i % 2 === 0;
      var by = top ? 22 : 118;
      var ls = lines(st[1] || "", 9.2, bw - 14, 2);
      out += '<g class="dg-node" style="--i:' + i + '">' +
        line(x, top ? by + bh : axis + 9, x, top ? axis - 9 : by, "dg-tick-line") +
        '<rect x="' + (x - bw / 2) + '" y="' + by + '" width="' + bw + '" height="' + bh + '" rx="8" class="dg-box"></rect>' +
        dot(x, axis, 9, "dg-node-c") +
        '<text x="' + x + '" y="' + (axis + 4) + '" class="dg-node-n">' + (i + 1) + "</text>" +
        txt(x, by + 15, esc(clip(st[0], 10.5, bw - 14)), "dg-tiny strong", "middle") +
        txt(x, by + 29, esc(ls[0]), "dg-micro", "middle") +
        (ls[1] ? txt(x, by + 39, esc(ls[1]), "dg-micro", "middle") : "") + "</g>";
    });
    return stage(out, "Containment first, evidence preserved, then the reasoning: hold, record, investigate, assess impact, correct, verify. Nothing in the middle can be skipped, because the batch is waiting on it.", n);
  }
  /* ================== 10. QA / QC / release handoff =================== */
  function handoff(s, topic, esc) {
    var out = "", y = 74, w = 128, gap = 30, x0 = 28, hh = 56;
    var stops = [
      ["Production", "batch record, cycle data"],
      ["QC", "tests, EM, stability"],
      ["QA", "deviations, CAPA, PV"],
      ["QP / release", "the system, not a test"]
    ];
    stops.forEach(function (st, i) {
      var x = x0 + i * (w + gap);
      var ls = lines(st[1], 9.2, w - 14, 2);
      out += '<g class="dg-stop" style="--i:' + i + '">' +
        '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" rx="9" class="dg-box"></rect>' +
        txt(x + w / 2, y + 20, esc(clip(st[0], 11.6, w - 14)), "dg-lbl strong", "middle") +
        txt(x + w / 2, y + 35, esc(ls[0]), "dg-micro", "middle") +
        (ls[1] ? txt(x + w / 2, y + 45, esc(ls[1]), "dg-micro", "middle") : "") + "</g>";
      if (i < stops.length - 1) out += '<g class="dg-push" style="--i:' + i + '">' +
        arrow(x + w + 3, y + hh / 2, x + w + gap - 3, y + hh / 2, "dg-arw") + "</g>";
    });
    out += '<g class="dg-doc"><rect x="' + x0 + '" y="' + (y - 34) + '" width="24" height="17" rx="4" class="dg-box hi"></rect>' +
      txt(x0 + 32, y - 21, "one record, four different questions asked of it", "dg-micro", "start") + "</g>";
    var asks = ["was it done as written?", "is the data complete?", "is the conclusion justified?"];
    for (var i = 0; i < 3; i++) {
      var ax = 38 + i * 190;
      out += '<g class="dg-ask" style="--i:' + i + '">' +
        '<rect x="' + ax + '" y="158" width="176" height="24" rx="7" class="dg-box"></rect>' +
        txt(ax + 88, 174, esc(asks[i]), "dg-tiny", "middle") + "</g>";
    }
    return stage(out, "Release is not a stamp at the end of a queue: each function looks at the same batch through a different lens, and the decision is only as good as the weakest of the four reviews.", stops.length);
  }
  /* =================== 11. one product, many frameworks ============== */
  function framework(s, topic, esc) {
    var c = { x: W / 2, y: 104 }, out = "", bw = 140, bh = 40;
    var sats = [
      { t: "EU GMP", d: "Annex 1 · 11 · 15 · 16 · 19", a: -152 },
      { t: "US FDA", d: "21 CFR 210/211 · Part 11", a: -105 },
      { t: "ICH", d: "Q7 · Q8 · Q9(R1) · Q10 · Q12", a: -63 },
      { t: "ISO", d: "14644 · 14698 · 11133 · 1822", a: -22 },
      { t: "WHO / PIC/S", d: "TRS · PI 007 · PI 020 · PI 041", a: 22 },
      { t: "Pharmacopoeia", d: "USP · EP general chapters", a: 63 },
      { t: "Site", d: "your CCS, SOPs and specs", a: 105 },
      { t: "Evidence", d: "records that close the loop", a: 152 }
    ];

    sats.forEach(function (st, i) {
      var rad = st.a * Math.PI / 180, R = 88;
      var x = c.x + Math.cos(rad) * R * 2.45, y = c.y + Math.sin(rad) * R * 0.66;
      x = Math.max(14 + bw / 2, Math.min(W - 14 - bw / 2, x));
      y = Math.max(20 + bh / 2, Math.min(H - 34 - bh / 2, y));
      var ls = lines(st.d, 9.2, bw - 14, 2);
      out += '<g class="dg-sat" style="--i:' + i + '">' + line(c.x, c.y, x, y, "dg-line draw") +
        '<rect x="' + (x - bw / 2) + '" y="' + (y - bh / 2) + '" width="' + bw + '" height="' + bh + '" rx="8" class="dg-box"></rect>' +
        txt(x, y - 7, esc(clip(st.t, 11.6, bw - 14)), "dg-lbl strong", "middle") +
        txt(x, y + 5, esc(ls[0]), "dg-micro", "middle") +
        (ls[1] ? txt(x, y + 15, esc(ls[1]), "dg-micro", "middle") : "") + "</g>";
    });
    /* the hub is painted last so the spokes pass behind it, not through it */
    out += '<g class="dg-core">' +
      '<rect x="' + (c.x - 78) + '" y="' + (c.y - 26) + '" width="156" height="52" rx="10" class="dg-box hi"></rect>' +
      txt(c.x, c.y - 2, "the sterile batch", "dg-lbl strong", "middle") +
      txt(c.x, c.y + 14, "one CCS answers all of them", "dg-micro", "middle") + "</g>";
    return stage(out, "No single document makes a cleanroom compliant. Every framework above describes the same product from a different angle — the contamination control strategy is where you show they are answered consistently.", sats.length);
  }
  /* =================== 12. AHU air path train ======================== */
  function ahu(s, topic, esc) {
    var stages = [
      { t: "Outside air", s: "louvers + mesh" }, { t: "Pre-filter", s: "G4 / F7 panel" },
      { t: "Coils", s: "cool, heat, humidify" }, { t: "Fine filter", s: "ePM1 / F9 bag" },
      { t: "HEPA H14", s: "≥99.995 % MPPS" }, { t: "Cleanroom", s: "grade + cascade" }
    ];
    var out = "", n = stages.length, bw = 92, gap = 12, x0 = 14, y = 74;
    out += txt(x0, 30, "every box is a control — an untested control is an assumption", "dg-cap", "start");
    stages.forEach(function (s, i) {
      var x = x0 + i * (bw + gap);
      var hot = i === 4;
      out += '<g class="dg-stop" style="--i:' + i + '">' +
        '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="52" rx="8" class="dg-box' + (hot ? " hi" : "") + '"></rect>' +
        txt(x + bw / 2, y + 20, clip(s.t, 10.5, bw - 10), "dg-tiny strong", "middle") +
        lines(s.s, 9.2, bw - 10, 2).map(function (l, k) { return txt(x + bw / 2, y + 33 + k * 10, esc(l), "dg-micro", "middle"); }).join("") + "</g>";
      if (i < n - 1) out += '<g class="dg-push" style="--i:' + i + '">' + arrow(x + bw, y + 26, x + bw + gap + 2, y + 26, "dg-arw on") + "</g>";
    });
    /* particles that get caught at each filter */
    var r = rnd(19), dots = "";
    for (var i = 0; i < 30; i++) {
      var px = x0 + 8 + r() * 286, py = 46 + r() * 18;
      dots += dot(px.toFixed(1), py.toFixed(1), (1.6 + r() * 1.8).toFixed(1), "dg-dot drift", i);
    }
    for (var j = 0; j < 10; j++) {
      var qx = x0 + 5 * (bw + gap) + 4 + r() * (bw - 8);
      dots += dot(qx.toFixed(1), (46 + r() * 18).toFixed(1), (1.4 + r() * 1.4).toFixed(1), "dg-dot clean", 30 + j);
    }
    out += '<g class="dg-train">' + dots + "</g>";
    out += txt(x0, 156, "leak-tested at installation, after shutdown work, and at every requalification", "dg-tiny", "start");
    out += txt(x0, 176, "integrity acceptance: ≤0.01 % local, ≤0.005 % average penetration", "dg-tiny hot", "start");
    return stage(out, "The cleanroom's grade is set here, upstream. Filtration, velocity, humidity and pressure are decided by this train — and everything in the room is a consequence of it.", 6);
  }

  var BUILDERS = {
    grades: grades, cascade: cascade, udaf: udaf, gown: gown, aps: aps,
    logred: logred, emtrend: emtrend, recovery: recovery, timeline: timeline,
    handoff: handoff, framework: framework, ahu: ahu
  };

  return {
    slot: SLOT,
    has: function (k) { return !!BUILDERS[k]; },
    names: Object.keys(BUILDERS),
    build: function (k, slide, topic, esc) {
      var b = BUILDERS[k];
      if (!b) return "";
      try { return b(slide || {}, topic, esc); }
      catch (e) { return '<p class="note">Diagram "' + esc(k) + '" failed to render: ' + esc(e.message) + "</p>"; }
    }
  };
})();
