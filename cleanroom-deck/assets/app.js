/* =====================================================================
   CLEANROOM & GMP TRAINING DECK — APP
   Views: home (topic menu) and deck (slides). Hash-routed, keyboard
   driven, print/PDF ready. No dependencies.
   ===================================================================== */
(function () {
  "use strict";

  var TOPICS = [];
  if (typeof TOPICS_A !== "undefined") TOPICS = TOPICS.concat(TOPICS_A);
  if (typeof TOPICS_B !== "undefined") TOPICS = TOPICS.concat(TOPICS_B);

  var KEY = "cleanroom-gmp-deck-v1";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var ESC_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"]/g, function (c) { return ESC_MAP[c]; }); }
  function join(arr, sep) { return (arr || []).join(sep || " "); }

  /* ---- colour helpers: bright topic accents read badly on white, so each
     accent gets a darkened "ink" twin (text/icons) and soft tint/line ---- */
  function hex2rgb(h) {
    h = String(h || "").replace("#", "");
    if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
    var n = parseInt(h, 16);
    return isNaN(n) ? [10, 162, 216] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function chan(v) { v = v / 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }
  function luminance(rgb) { return .2126 * chan(rgb[0]) + .7152 * chan(rgb[1]) + .0722 * chan(rgb[2]); }
  function contrast(a, b) { var l1 = luminance(a), l2 = luminance(b); return (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05); }
  function accentTokens(hex) {
    var r = hex2rgb(hex), navy = [12, 34, 51];
    var ink = r.map(function (v, i) { return Math.round(v * .45 + navy[i] * .55); });
    /* keep nudging toward navy until the text is comfortably readable on white */
    var softBg = r.map(function (v, i) { return Math.round(v * .1 + 255 * .9); }); /* --accent-soft on white */
    for (var k = 0; k < 8 && (contrast(ink, [255, 255, 255]) < 4.6 || contrast(ink, softBg) < 4.6); k++) {
      ink = ink.map(function (v, i) { return Math.round(v * .85 + navy[i] * .15); });
    }
    return {
      base: hex,
      ink: "rgb(" + ink.join(",") + ")",
      soft: "rgba(" + r.join(",") + ",.10)",
      line: "rgba(" + r.join(",") + ",.34)",
      ratio: +contrast(ink, [255, 255, 255]).toFixed(2)
    };
  }
  function styleFor(hex) {
    var t = accentTokens(hex);
    return "--accent:" + t.base + ";--accent-ink:" + t.ink + ";--accent-soft:" + t.soft + ";--accent-line:" + t.line;
  }

  /* ------------------------------- storage ------------------------------ */
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { } }
  var store = load();
  store.visited = store.visited || {};
  store.done = store.done || {};
  store.scores = store.scores || {};

  /* ------------------------------- state -------------------------------- */
  var state = {
    view: "home",
    deck: [],            // [{topic, slide, gi}]
    deckTitle: "All topics",
    homeTopicId: null,   // topic used for head/next-topic navigation
    i: 0,
    quiz: {},            // topicId -> {qIndex: chosenIndex}
    auto: 0,
    autoTimer: null,
    overlay: null,
    force: false
  };

  /* ----------------------------- particle FX ---------------------------- */
  function initParticles() {
    var c = $("#fx"); if (!c || !c.getContext) return;
    var ctx = c.getContext("2d"); if (!ctx) return;
    var w = 0, h = 0, dots = [], reduce = false;
    try { reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { }
    function size() {
      w = c.width = window.innerWidth; h = c.height = window.innerHeight;
      var n = Math.min(70, Math.round(w * h / 32000));
      dots = [];
      for (var i = 0; i < n; i++) {
        /* downward drift, like the filtered air in a cleanroom */
        dots.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.7 + .4, vy: Math.random() * .24 + .06, vx: (Math.random() - .5) * .1, a: Math.random() * .2 + .05 });
      }
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.y += d.vy; d.x += d.vx;
        if (d.y > h + 10) { d.y = -10; d.x = Math.random() * w; }
        if (d.x < -10) d.x = w + 10; if (d.x > w + 10) d.x = -10;
        ctx.beginPath();
        ctx.fillStyle = "rgba(70,150,200," + d.a + ")";
        ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fill();
      }
      if (!reduce) requestAnimationFrame(frame);
    }
    size(); frame();
    window.addEventListener("resize", function () { size(); if (reduce) frame(); });
  }

  /* --------------------------- slide rendering -------------------------- */
  function refChip(ref) {
    return ref ? '<span class="ref" title="Regulatory reference">' + esc(ref) + "</span>" : "";
  }
  function head(s, topic) {
    var kicker = topic ? esc(topic.title) : "";
    return '<header class="s-head"><div class="s-kicker">' + kicker + "</div>" +
      "<h2>" + esc(s.t) + "</h2>" +
      (s.sub ? '<p class="s-sub">' + esc(s.sub) + "</p>" : "") +
      refChip(s.ref) + "</header>";
  }
  function listItems(items, cls) {
    return '<ul class="items ' + (cls || "") + '">' + items.map(function (it) {
      return '<li><b>' + esc(it[0]) + "</b><span>" + esc(it[1]) + "</span></li>";
    }).join("") + "</ul>";
  }

  function renderSlide(s, topic, gi, total) {
    var body = "", k = s.k;

    if (k === "intro") {
      body =
        '<div class="intro"><div class="intro-icon">' + (topic ? topic.icon : "🎓") + "</div>" +
        '<div class="intro-main"><p class="lead">' + esc(s.lead) + "</p>" +
        (s.objectives ? '<div class="obj"><h5>In this topic you will be able to</h5><ol>' +
          s.objectives.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") +
          "</ol></div>" : "") +
        (topic && topic.refs ? '<div class="refs">' + topic.refs.map(function (r) { return "<span>" + esc(r) + "</span>"; }).join("") + "</div>" : "") +
        "</div></div>";
      return wrap(s, topic, gi, total, body, "kind-intro");
    }

    if (k === "points") {
      var tight = (s.items || []).length >= 5;
      body = listItems(s.items || [], tight ? "col-2 tight" : "col-2");
      if (s.note) body += '<p class="note">' + esc(s.note) + "</p>";
    } else if (k === "cards") {
      body = '<div class="cards">' + (s.items || []).map(function (it) {
        return '<article class="card"><div class="card-ic">' + esc(it[0]) + "</div><h4>" + esc(it[1]) + "</h4><p>" + esc(it[2]) + "</p></article>";
      }).join("") + "</div>" + (s.note ? '<p class="note">' + esc(s.note) + "</p>" : "");
    } else if (k === "table") {
      body = '<div class="tw"><table><thead><tr>' + (s.cols || []).map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") +
        "</tr></thead><tbody>" + (s.rows || []).map(function (r, ri) {
          return "<tr" + (ri % 2 ? ' class="alt"' : "") + ">" + r.map(function (cell, ci) {
            return (ci === 0 ? "<th>" : "<td>") + esc(cell) + (ci === 0 ? "</th>" : "</td>");
          }).join("") + "</tr>";
        }).join("") + "</tbody></table></div>" + (s.note ? '<p class="note">' + esc(s.note) + "</p>" : "");
    } else if (k === "flow") {
      var nSteps = (s.steps || []).length;
      body = '<ol class="flow ' + (nSteps > 5 ? "many" : "") + '" style="--n:' + nSteps + ";--slot:" + SLOT + 's">' + (s.steps || []).map(function (st, i) {
        return '<li style="--i:' + i + '"><span class="fnum">' + (i + 1) + "</span><div><b>" + esc(st[0]) + "</b><span>" + esc(st[1]) + "</span></div></li>";
      }).join("") + "</ol>" + (s.note ? '<p class="note">' + esc(s.note) + "</p>" : "");
    } else if (k === "split") {
      body = '<div class="split">' + panel(s.left) + panel(s.right) + "</div>" + (s.note ? '<p class="note">' + esc(s.note) + "</p>" : "");
    } else if (k === "stats") {
      body = '<div class="stats">' + (s.items || []).map(function (it) {
        return '<div class="stat"><div class="sv">' + esc(it[0]) + '</div><div class="sl">' + esc(it[1]) + "</div>" +
          (it[2] ? '<div class="ss">' + esc(it[2]) + "</div>" : "") + "</div>";
      }).join("") + "</div>" + (s.note ? '<p class="note">' + esc(s.note) + "</p>" : "");
    } else if (k === "callout") {
      body = '<blockquote class="quote">“' + esc(s.quote) + '”</blockquote>' +
        (s.points ? listItems(s.points, "col-2 tight") : "") + (s.note ? '<p class="note">' + esc(s.note) + "</p>" : "");
    } else if (k === "diagram") {
      var fig = window.DECK_ANIM ? window.DECK_ANIM.build(s.anim, s, topic, esc) : "";
      body = fig + (s.items ? listItems(s.items, "legend col-" + Math.min(3, s.items.length)) : "") +
        (s.note ? '<p class="note">' + esc(s.note) + "</p>" : "");
    } else if (k === "quiz") {
      body = '<div class="quiz" data-topic="' + esc(topic && topic.id) + '">' + (s.questions || []).map(function (q, qi) {
        return '<div class="q" data-q="' + qi + '"><h4><span>' + (qi + 1) + ".</span> " + esc(q.q) + "</h4><div class=\"opts\">" +
          q.opts.map(function (o, oi) {
            return '<button class="opt" data-o="' + oi + '"><i>' + String.fromCharCode(65 + oi) + "</i>" + esc(o) + "</button>";
          }).join("") + "</div>" +
          '<p class="why"><b></b><span>' + esc(q.why) + "</span></p></div>";
      }).join("") + "</div>" +
        '<div class="quiz-bar"><span class="score" data-score>Not attempted yet</span><button class="btn ghost sm" data-quiz-reset>Reset answers</button></div>';
    } else if (k === "end") {
      body = '<ol class="takes">' + (s.items || []).map(function (it) {
        return '<li><b>' + esc(it[0]) + "</b><span>" + esc(it[1]) + "</span></li>";
      }).join("") + "</ol>" +
        '<div class="end-nav">' +
        '<button class="btn ghost" data-act="menu">← Back to all topics</button>' +
        (s.next !== false && topic ? '<button class="btn primary" data-act="next-topic">Next topic: ' + esc(nextTopic(topic.id).title) + " →</button>" : "") +
        "</div>";
    } else {
      body = listItems(s.items || [], "col-2");
    }

    return wrap(s, topic, gi, total, head(s, topic) + body, "kind-" + k);
  }

  function panel(p) {
    if (!p) return "";
    var tone = p.tone === "bad" ? "bad" : p.tone === "good" ? "good" : "info";
    return '<section class="panel ' + tone + '"><h4>' + esc(p.h) + "</h4><ul>" +
      (p.items || []).map(function (it) { return "<li>" + esc(it) + "</li>"; }).join("") + "</ul></section>";
  }

  var SLOT = (window.DECK_ANIM && window.DECK_ANIM.slot) || 1.5;

  function wrap(s, topic, gi, total, body, cls) {
    var slot = (window.DECK_ANIM && window.DECK_ANIM.slot) || SLOT;
    return '<article class="slide ' + cls + '" data-gi="' + gi + '" style="' + styleFor(topic ? topic.accent : "#00d4ff") +
      ";--slot:" + slot + 's;--n:' + ((s.steps && s.steps.length) || (s.items && s.items.length) || 4) + '">' +
      '<div class="s-body">' + body + "</div>" +
      '<div class="s-foot"><span>' + (topic ? esc(topic.title) : "") + "</span><span>" + (gi + 1) + " / " + total + "</span></div>" +
      "</article>";
  }

  function nextTopic(id) {
    for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].id === id) return TOPICS[(i + 1) % TOPICS.length];
    return TOPICS[0];
  }
  function prevTopic(id) {
    for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].id === id) return TOPICS[(i - 1 + TOPICS.length) % TOPICS.length];
    return TOPICS[0];
  }
  function topicById(id) {
    for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].id === id) return TOPICS[i];
    return null;
  }

  /* ------------------------------- home --------------------------------- */
  function renderHome() {
    var grid = $("#menuGrid");
    var total = TOPICS.length;
    var done = TOPICS.filter(function (t) { return store.done[t.id]; }).length;

    grid.innerHTML = TOPICS.map(function (t) {
      var score = store.scores[t.id];
      var visited = store.visited[t.id];
      return '<button class="topic-card" data-open="' + t.id + '" style="' + styleFor(t.accent) + '">' +
        '<span class="tc-num">' + String(t.n).padStart(2, "0") + "</span>" +
        (store.done[t.id] ? '<span class="tc-done" title="Completed">✓</span>' : "") +
        '<span class="tc-icon">' + t.icon + "</span>" +
        '<span class="tc-body"><span class="tc-title">' + esc(t.title) + "</span>" +
        '<span class="tc-tag">' + esc(t.tagline) + "</span></span>" +
        '<span class="tc-meta"><span>' + t.slides.length + " slides</span>" +
        (score ? '<span class="tc-score">quiz ' + score.s + "/" + score.t + "</span>" : "") +
        '<span class="tc-open">' + (visited ? "Resume" : "Open") + " →</span></span>" +
        "</button>";
    }).join("");

    $("#progText").innerHTML = "<b>" + done + "</b> of " + total + " topics completed";
    $("#progBar").style.width = (done / total * 100) + "%";
    $("#totalSlides").textContent = TOPICS.reduce(function (a, t) { return a + t.slides.length; }, 0);
    var dg = $("#diagramCount");
    if (dg) dg.textContent = TOPICS.reduce(function (n, t) { return n + t.slides.filter(function (s) { return s.k === "diagram"; }).length; }, 0);
    $("#topicCount").textContent = total;
  }

  /* ------------------------------- deck --------------------------------- */
  function buildDeck(topic) {
    var arr = [];
    var list = topic ? [topic] : TOPICS;
    list.forEach(function (t) {
      t.slides.forEach(function (s) { arr.push({ topic: t, slide: s }); });
    });
    return arr;
  }

  function openTopic(id, gi) {
    var t = topicById(id); if (!t) return goHome();
    state.deck = buildDeck(t);
    state.deckTitle = t.title;
    state.homeTopicId = id;
    renderDeck(gi || 0);
  }
  function openAll(gi) {
    state.deck = buildDeck(null);
    state.deckTitle = "Full presentation";
    state.homeTopicId = null;
    renderDeck(gi || 0);
  }

  function renderDeck(gi) {
    var total = state.deck.length;
    state.i = Math.max(0, Math.min(total - 1, gi || 0));
    var first = state.deck[0].topic;

    $("#deckTitle").textContent = state.deckTitle;
    $("#deckCount").textContent = total + " slides";
    $("#deckAccent").setAttribute("style", styleFor(state.homeTopicId ? first.accent : "#00d4ff"));
    $("#stage").innerHTML = state.deck.map(function (d, i) {
      return renderSlide(d.slide, d.topic, i, total);
    }).join("");

    $("#dots").innerHTML = state.deck.map(function (d, i) {
      return '<button class="dot" data-go="' + i + '" title="' + esc(d.slide.t || (d.topic && d.topic.title)) + '"><i></i></button>';
    }).join("");

    show(state.i, true);
    document.body.dataset.view = "deck";
  }

  function show(i, silent) {
    var total = state.deck.length;
    i = Math.max(0, Math.min(total - 1, i));
    state.i = i;
    var slides = $$("#stage .slide");
    slides.forEach(function (s, idx) {
      s.classList.toggle("active", idx === i);
      s.classList.remove("play");
      if (idx === i) { s.classList.remove("in"); void s.offsetWidth; s.classList.add("in"); }
    });
    fit(slides[i]);
    play(slides[i]);
    var d = state.deck[i];
    var t = d.topic;
    $("#crumb").innerHTML = '<button data-act="menu">Topics</button><span>/</span>' +
      '<b style="color:' + t.accent + '">' + esc(t.title) + "</b>";
    $("#deckIdx").textContent = (i + 1) + " / " + total;
    $("#progFill").style.width = ((i + 1) / total * 100) + "%";
    $$("#dots .dot").forEach(function (dot, idx) { dot.classList.toggle("on", idx === i); dot.classList.toggle("past", idx < i); });
    $("#btnPrev").disabled = i === 0;
    $("#btnNext").disabled = i === total - 1;
    var st = $("#stage"); st.scrollTop = 0;
    var act = slides[i]; if (act) { var b = $(".s-body", act); if (b) b.scrollTop = 0; }
    document.title = (d.slide.t || t.title) + " · Cleanroom & GMP Deck";
    setHash(t.id, i);
    store.visited[t.id] = true;
    if (i >= total - 1) { store.done[t.id] = true; }
    if (!silent) save(store);
    applyQuiz(d);
    setAuto();
  }

  function reduced() {
    try { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
    catch (e) { return false; }
  }

  /* Restart the CSS build animations and count the headline numbers up.
     Re-adding .play is what makes every diagram replay from zero. */
  function play(slide) {
    if (!slide || reduced()) return;
    void slide.offsetWidth;
    slide.classList.add("play");
    countUp(slide);
  }
  function countUp(slide) {
    if (!slide) return;
    $$(".stat .sv", slide).forEach(function (el, i) {
      var full = el.getAttribute("data-full") || el.textContent.trim();
      el.setAttribute("data-full", full);
      var m = full.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
      if (!m || reduced()) { el.textContent = full; return; }
      var target = parseFloat(m[2]);
      if (!isFinite(target)) { el.textContent = full; return; }
      var dec = (m[2].split(".")[1] || "").length;
      var t0 = 0, dur = 620 + i * 130;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = m[1] + (target * e).toFixed(dec) + m[3];
        if (p < 1 && el.isConnected !== false) requestAnimationFrame(step);
        else el.textContent = full;
      }
      requestAnimationFrame(step);
    });
  }

  /* Shrink the type one step if a slide would not fit the viewport, so a
     projector never gets a half-hidden slide. */
  function fit(slide) {
    if (!slide) return;
    slide.classList.remove("dense");
    if (state.force) { slide.classList.add("dense"); return; }
    var b = $(".s-body", slide);
    if (!b || !b.offsetHeight) return;
    if (b.scrollHeight > b.clientHeight + 4) slide.classList.add("dense");
  }

  function go(delta) {
    var n = state.i + delta;
    if (n < 0 || n > state.deck.length - 1) return;
    show(n);
  }
  function jumpTo(i) { show(i); }

  /* ------------------------------- quiz --------------------------------- */
  function quizState(topicId) {
    if (!state.quiz[topicId]) state.quiz[topicId] = {};
    return state.quiz[topicId];
  }
  function applyQuiz(d) {
    if (!d || d.slide.k !== "quiz") return;
    var slide = $$("#stage .slide")[state.i]; if (!slide) return;
    var qs = quizState(d.topic.id);
    var correct = 0, answered = 0, total = (d.slide.questions || []).length;
    $$(".q", slide).forEach(function (qEl) {
      var qi = +qEl.dataset.q, chosen = qs[qi], q = d.slide.questions[qi];
      var has = chosen !== undefined && chosen !== null;
      if (has) { answered++; if (chosen === q.a) correct++; }
      qEl.classList.toggle("done", has);
      $$(".opt", qEl).forEach(function (o) {
        var oi = +o.dataset.o;
        o.classList.toggle("chosen", has && oi === chosen);
        o.classList.toggle("right", has && oi === q.a);
        o.classList.toggle("wrong", has && oi === chosen && chosen !== q.a);
        o.setAttribute("aria-pressed", has && oi === chosen ? "true" : "false");
      });
      var why = $(".why", qEl);
      if (why) {
        why.classList.toggle("show", has);
        var b = $("b", why);
        if (b) b.textContent = chosen === q.a ? "Correct. " : "Not quite. ";
      }
    });
    var sc = $("[data-score]", slide);
    if (sc) sc.innerHTML = answered
      ? "Score so far <b>" + correct + " / " + total + "</b>" + (answered === total ? (correct === total ? " — perfect" : "") : " · " + (total - answered) + " left")
      : "Not attempted yet";
    if (answered === total && total) {
      store.scores[d.topic.id] = { s: correct, t: total };
      save(store);
    }
  }

  /* ------------------------------ overview ------------------------------ */
  function openOverlay(type) {
    var o = $("#overlay"), html = "";
    if (type === "grid") {
      var groups = [];
      state.deck.forEach(function (d, i) {
        var g = groups.filter(function (x) { return x.t === d.topic; })[0];
        if (!g) { g = { t: d.topic, items: [] }; groups.push(g); }
        g.items.push({ i: i, s: d.slide });
      });
      html = '<div class="ov-head"><h3>Jump to a slide</h3><button class="btn ghost" data-act="close-ov">Close ✕</button></div><div class="ov-body">' +
        groups.map(function (g) {
          return '<section class="ov-group" style="--accent:' + g.t.accent + '"><h4><span>' + g.t.icon + "</span>" + esc(g.t.title) + "</h4><div class=\"ov-grid\">" +
            g.items.map(function (it) {
              return '<button class="ov-cell" data-go="' + it.i + '"><span class="ov-n">' + (it.i + 1) + "</span>" +
                '<span class="ov-t">' + esc(it.s.t || g.t.title) + '</span><span class="ov-k">' + it.s.k + "</span></button>";
            }).join("") + "</div></section>";
        }).join("") + "</div>";
    } else if (type === "help") {
      html = '<div class="ov-head"><h3>Keyboard &amp; shortcuts</h3><button class="btn ghost" data-act="close-ov">Close ✕</button></div>' +
        '<div class="ov-body help"><table><tbody>' +
        [["→ / Space / PageDown", "Next slide"], ["← / PageUp", "Previous slide"], ["Home / End", "First / last slide"],
        ["Esc", "Back to the topic menu"], ["G", "Slide overview (this panel)"], ["F", "Fullscreen (best for presenting)"],
        ["T", "Presenter timer on / off"], ["P", "Print or save as PDF"], ["1 – 9", "Open a topic directly"],
        ["A", "Auto-advance: off / 15 s / 30 s"], ["C", "Force compact type (slides auto-fit anyway)"],
        ["R", "Replay the animation on this slide"], ["S", "Search topics (on the menu)"], ["?", "This help"]].map(function (r) {
          return "<tr><td><kbd>" + esc(r[0]) + "</kbd></td><td>" + esc(r[1]) + "</td></tr>";
        }).join("") + "</tbody></table>" +
        '<p class="ov-note">Swipe left / right on touch devices. Every view is linkable: <code>#/design/3</code> opens the design topic at slide 4.</p></div>';
    }
    o.innerHTML = html;
    o.classList.add("show");
    state.overlay = type;
  }
  function closeOverlay() { $("#overlay").classList.remove("show"); state.overlay = null; }

  /* ------------------------------- timer -------------------------------- */
  var timerOn = false, timerStart = 0, timerId = null;
  function toggleTimer() {
    timerOn = !timerOn;
    var el = $("#timer");
    if (timerOn) {
      timerStart = Date.now();
      el.classList.add("on");
      timerId = setInterval(function () {
        var s = Math.floor((Date.now() - timerStart) / 1000);
        el.textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
      }, 250);
    } else { el.classList.remove("on"); el.textContent = "00:00"; clearInterval(timerId); }
  }

  /* ------------------------------ auto-advance -------------------------- */
  function setAuto() {
    clearInterval(state.autoTimer);
    var btn = $("#btnAuto");
    if (!state.auto) { if (btn) { btn.textContent = "Auto: off"; btn.classList.remove("on"); } return; }
    if (btn) { btn.textContent = "Auto: " + state.auto + "s"; btn.classList.add("on"); }
    var fill = $("#autoFill");
    if (fill) { fill.style.transition = "none"; fill.style.width = "0%"; void fill.offsetWidth; fill.style.transition = "width " + state.auto + "s linear"; fill.style.width = "100%"; }
    state.autoTimer = setInterval(function () {
      if (state.i >= state.deck.length - 1) { clearInterval(state.autoTimer); return; }
      go(1);
    }, state.auto * 1000);
  }

  /* ------------------------------- printing ----------------------------- */
  function printDeck() {
    document.body.classList.add("printing");
    setTimeout(function () { window.print(); }, 60);
    setTimeout(function () { document.body.classList.remove("printing"); }, 1200);
  }

  /* ------------------------------- router ------------------------------- */
  /* Keep the URL shareable without letting the rewrite re-trigger routing
     (some engines fire hashchange on replaceState, which would rebuild
     the deck and lose "present all" mode). */
  function setHash(id, i) {
    var want = "#/" + id + "/" + i;
    state.lastHash = want.slice(2);
    if (location.hash === want) return;
    try { history.replaceState(null, "", want); }
    catch (e) { if (location.hash !== want) location.hash = want; }
  }

  function route() {
    var h = (location.hash || "").replace(/^#\/?/, "");
    if (h === state.lastHash) return;
    state.lastHash = h;
    if (!h) { goHome(); return; }
    if (h.indexOf("all") === 0) {
      var p = h.split("/");
      openAll(p[1] ? parseInt(p[1], 10) : 0);
      return;
    }
    var parts = h.split("/");
    var t = topicById(parts[0]);
    if (!t) { goHome(); return; }
    var idx = parts[1] != null ? parseInt(parts[1], 10) : 0;
    if (isNaN(idx) || idx < 0) idx = 0;
    openTopic(t.id, idx);
  }
  function goHome() {
    document.body.dataset.view = "home";
    document.title = "Cleanroom & GMP Training — Interactive Deck";
    renderHome();
    state.lastHash = "";
    if (location.hash !== "#/" && location.hash !== "#") {
      try { history.replaceState(null, "", "#/"); } catch (e) { location.hash = "#/"; }
    }
  }

  /* -------------------------------- wire -------------------------------- */
  function clickHandler(e) {
    var open = e.target.closest ? e.target.closest("[data-open]") : null;
    if (open) { location.hash = "#/" + open.dataset.open + "/0"; return; }

    var goEl = e.target.closest ? e.target.closest("[data-go]") : null;
    if (goEl) { closeOverlay(); jumpTo(+goEl.dataset.go); return; }

    var act = e.target.closest ? e.target.closest("[data-act]") : null;
    if (act) {
      var a = act.dataset.act;
      if (a === "menu") { location.hash = "#/"; }
      else if (a === "prev") go(-1);
      else if (a === "next") go(1);
      else if (a === "ov") state.overlay ? closeOverlay() : openOverlay("grid");
      else if (a === "close-ov") closeOverlay();
      else if (a === "help") state.overlay ? closeOverlay() : openOverlay("help");
      else if (a === "print") printDeck();
      else if (a === "print-all") { location.hash = "#/all/0"; setTimeout(printDeck, 350); }
      else if (a === "full") {
        if (document.fullscreenElement) { document.exitFullscreen(); }
        else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
      }
      else if (a === "timer") toggleTimer();
      else if (a === "auto") { state.auto = state.auto === 0 ? 15 : state.auto === 15 ? 30 : 0; setAuto(); }
      else if (a === "replay") {
        var sl = $$("#stage .slide")[state.i];
        if (sl) { sl.classList.remove("play"); countUp(sl); requestAnimationFrame(function () { if (!reduced()) sl.classList.add("play"); }); }
      }
      else if (a === "dense") {
        state.force = !state.force;
        act.classList.toggle("on", state.force);
        fit($$("#stage .slide")[state.i]);
      }
      else if (a === "next-topic") { location.hash = "#/" + nextTopic(state.homeTopicId).id + "/0"; }
      else if (a === "prev-topic") { location.hash = "#/" + prevTopic(state.homeTopicId).id + "/0"; }
      else if (a === "all") { location.hash = "#/all/0"; }
      else if (a === "reset") {
        if (confirm("Clear progress, completion ticks and quiz scores?")) {
          store.visited = {}; store.done = {}; store.scores = {}; save(store); renderHome();
        }
      }
      e.preventDefault();
      return;
    }

    var opt = e.target.closest ? e.target.closest(".opt") : null;
    if (opt) {
      var q = opt.closest(".q"), slide = opt.closest(".slide");
      var d = state.deck[+slide.dataset.gi];
      quizState(d.topic.id)[+q.dataset.q] = +opt.dataset.o;
      applyQuiz(d);
      return;
    }

    var reset = e.target.closest ? e.target.closest("[data-quiz-reset]") : null;
    if (reset) {
      var slide2 = reset.closest(".slide"), d2 = state.deck[+slide2.dataset.gi];
      state.quiz[d2.topic.id] = {};
      delete store.scores[d2.topic.id]; save(store);
      applyQuiz(d2);
    }
  }

  function keyHandler(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var inField = /input|textarea/i.test(e.target.tagName || "");
    if (state.overlay && e.key === "Escape") { closeOverlay(); return; }

    if (document.body.dataset.view === "deck") {
      if (inField) return;
      switch (e.key) {
        case "ArrowRight": case "PageDown": case " ": e.preventDefault(); go(1); break;
        case "ArrowLeft": case "PageUp": e.preventDefault(); go(-1); break;
        case "Home": jumpTo(0); break;
        case "End": jumpTo(state.deck.length - 1); break;
        case "Escape": location.hash = "#/"; break;
        case "g": case "G": state.overlay ? closeOverlay() : openOverlay("grid"); break;
        case "f": case "F": document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); break;
        case "p": case "P": printDeck(); break;
        case "t": case "T": toggleTimer(); break;
        case "a": case "A": state.auto = state.auto === 0 ? 15 : state.auto === 15 ? 30 : 0; setAuto(); break;
        case "c": case "C":
          state.force = !state.force;
          var db = $("[data-act='dense']"); if (db) db.classList.toggle("on", state.force);
          fit($$("#stage .slide")[state.i]);
          break;
        case "r": case "R":
          var cur = $$("#stage .slide")[state.i];
          if (cur) { cur.classList.remove("play"); countUp(cur); requestAnimationFrame(function () { if (!reduced()) cur.classList.add("play"); }); }
          break;
        case "?": openOverlay("help"); break;
      }
      return;
    }
    // home
    if (e.key === "/" || (e.key === "s" && !inField)) { e.preventDefault(); $("#search").focus(); return; }
    if (inField) {
      if (e.key === "Enter") {
        var first = $$(".topic-card").filter(function (c) { return c.style.display !== "none"; })[0];
        if (first) location.hash = "#/" + first.dataset.open + "/0";
      }
      if (e.key === "Escape") { $("#search").value = ""; filterTopics(""); $("#search").blur(); }
      return;
    }
    if (/^[1-9]$/.test(e.key)) { var t = TOPICS[+e.key - 1]; if (t) location.hash = "#/" + t.id + "/0"; }
    if (e.key === "?") openOverlay("help");
  }

  function filterTopics(q) {
    q = (q || "").toLowerCase().trim();
    $$(".topic-card").forEach(function (c) {
      var t = topicById(c.dataset.open);
      var hay = (t.title + " " + t.tagline + " " + t.refs.join(" ") + " " + t.slides.map(function (s) { return s.t || ""; }).join(" ")).toLowerCase();
      c.style.display = !q || hay.indexOf(q) > -1 ? "" : "none";
    });
    var shown = $$(".topic-card").filter(function (c) { return c.style.display !== "none"; }).length;
    $("#searchInfo").textContent = q ? shown + (shown === 1 ? " topic matches" : " topics match") : "";
  }

  function initTouch() {
    var x0 = null, y0 = null;
    $("#stage").addEventListener("touchstart", function (e) {
      var t = e.changedTouches[0]; x0 = t.clientX; y0 = t.clientY;
    }, { passive: true });
    $("#stage").addEventListener("touchend", function (e) {
      if (x0 == null) return;
      var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1);
      x0 = null;
    }, { passive: true });
  }

  function init() {
    // inject menu into DOM (keeps index.html short)
    $("#menuGrid").innerHTML = "";
    initParticles();
    document.addEventListener("click", clickHandler);
    document.addEventListener("keydown", keyHandler);
    $("#search").addEventListener("input", function (e) { filterTopics(e.target.value); });
    window.addEventListener("hashchange", route);
    var rT = null;
    window.addEventListener("resize", function () {
      clearTimeout(rT);
      rT = setTimeout(function () { fit($$("#stage .slide")[state.i]); }, 140);
    });
    // Poppins may land after first paint — re-fit once webfonts are ready
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(function () { fit($$("#stage .slide")[state.i]); });
    }
    initTouch();
    route();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
