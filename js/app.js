(function () {
  const $ = id => document.getElementById(id);
  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const state = { q: "", cat: "All", group: null, onlyFav: false, sort: "default", lang: "en" };

  const T = {
    pill: ["For students, freelancers and everyone", "طلبہ، فری لانسرز اور سب کے لیے"],
    h1a: ["All the essential websites,", "تمام ضروری ویب سائٹس،"],
    h1b: ["in one place", "ایک جگہ"],
    sub: ["Government, jobs, education and daily tools. Search and open instantly.", "سرکاری سروسز، نوکریاں، تعلیم اور روزمرہ ٹولز۔ تلاش کریں اور سیدھا کھولیں۔"],
    ph: ["Search... (e.g. nadra, pdf, scholarship)", "تلاش کریں... (جیسے: nadra, pdf)"],
    fav: ["Favorites", "پسندیدہ"],
    suggest: ["+ Suggest a link", "+ لنک بھیجیں"],
    install: ["Install app", "ایپ انسٹال کریں"],
    sortl: ["Sort:", "ترتیب:"],
    s_def: ["Default", "عام"],
    s_az: ["A-Z", "A-Z"],
    s_za: ["Z-A", "Z-A"],
    s_open: ["My most opened", "میرے سب سے زیادہ کھولے"],
    today: ["Tool of the day", "آج کا ٹول"],
    recent: ["Recently opened", "حال ہی میں کھولے گئے"],
    student: ["Student corner:", "طلبہ کارنر:"],
    next: ["Agli namaz", "اگلی نماز"],
    all: ["All", "سب"],
    copied: ["Link copied", "لنک کاپی ہو گیا"],
    empty: ["Nothing found. Try another word.", "کچھ نہیں ملا۔ کوئی اور لفظ آزمائیں۔"],
    home: ["Home", "ہوم"],
    search: ["Search", "تلاش"],
    lang: ["اردو", "English"]
  };
  const GN = { "Pakistan": "پاکستان", "Study": "تعلیم", "Work & Money": "کام اور پیسہ", "Tech": "ٹیک", "Creative": "تخلیقی", "Life": "زندگی", "Fun": "تفریح" };
  const t = k => T[k][state.lang === "ur" ? 1 : 0];

  function applyLang() {
    const ur = state.lang === "ur";
    document.documentElement.lang = ur ? "ur" : "en";
    document.body.classList.toggle("ur", ur);
    document.querySelectorAll("[data-i18n]").forEach(el => { if (T[el.dataset.i18n]) el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  }

  // duplicate links hatao
  const seen = new Set();
  const links = (window.LINKS || []).filter(l => {
    const k = String(l.url).replace(/\/+$/, "").toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k); return true;
  });
  const byUrl = {}; links.forEach(l => byUrl[l.url] = l);

  const META = {
    "Government": { i: "\u{1F3DB}\uFE0F", c: "#2f8f6b" }, "Jobs": { i: "\u{1F4BC}", c: "#3b82c4" },
    "Freelancing": { i: "\u{1F4BB}", c: "#7c5cd6" }, "Education": { i: "\u{1F393}", c: "#d2793a" },
    "Scholarships": { i: "\u{1F3C6}", c: "#c9a227" }, "AI Tools": { i: "\u{1F916}", c: "#8e44ad" },
    "Design": { i: "\u{1F3A8}", c: "#e0527a" }, "Developer": { i: "\u{1F9D1}\u200D\u{1F4BB}", c: "#2d6cdf" },
    "Utilities": { i: "\u{1F6E0}\uFE0F", c: "#0f9d9a" }, "News": { i: "\u{1F4F0}", c: "#6b7280" },
    "Finance": { i: "\u{1F4B0}", c: "#2e9e4f" }, "Banking": { i: "\u{1F3E6}", c: "#1f7a8c" },
    "Health": { i: "\u{1FA7A}", c: "#e04848" }, "Entertainment": { i: "\u{1F3AC}", c: "#d6407a" },
    "Shopping": { i: "\u{1F6D2}", c: "#e07b1a" }, "Travel": { i: "\u2708\uFE0F", c: "#2aa1d6" },
    "Social Media": { i: "\u{1F4AC}", c: "#4a6ee0" }, "Productivity": { i: "\u2705", c: "#5b8c2a" },
    "Writing": { i: "\u270D\uFE0F", c: "#a0522d" }, "Learning": { i: "\u{1F4DA}", c: "#b8651b" },
    "Religion": { i: "\u{1F54C}", c: "#1f8a5f" }, "Sports": { i: "\u26BD", c: "#d1481f" },
    "Free Downloads": { i: "\u2B07\uFE0F", c: "#4b6584" }, "Business": { i: "\u{1F4C8}", c: "#b5651d" },
    "Marketing": { i: "\u{1F4E3}", c: "#c2410c" }, "Agriculture": { i: "\u{1F33E}", c: "#4d7c0f" },
    "Cooking": { i: "\u{1F373}", c: "#d97706" }, "Kids & Family": { i: "\u{1F9F8}", c: "#ec4899" },
    "Home & DIY": { i: "\u{1F528}", c: "#78716c" }, "Law": { i: "\u2696\uFE0F", c: "#475569" },
    "Lifestyle": { i: "\u{1F338}", c: "#db2777" }, "Science": { i: "\u{1F52C}", c: "#0e7490" },
    "History": { i: "\u{1F3FA}", c: "#92400e" }, "Fitness": { i: "\u{1F4AA}", c: "#16a34a" },
    "Careers": { i: "\u{1F9ED}", c: "#0369a1" }, "Media": { i: "\u{1F39E}\uFE0F", c: "#7c3aed" },
    "Languages": { i: "\u{1F5E3}\uFE0F", c: "#0891b2" }, "Gaming": { i: "\u{1F3AE}", c: "#6d28d9" },
    "Automotive": { i: "\u{1F697}", c: "#b91c1c" }, "Urdu": { i: "\u{1F4D6}", c: "#047857" },
    "Gadgets": { i: "\u{1F4F1}", c: "#0284c7" }, "Tech": { i: "\u{1F5A5}\uFE0F", c: "#4338ca" },
    "Pakistan Local": { i: "\u{1F1F5}\u{1F1F0}", c: "#15803d" }, "Engineering": { i: "\u2699\uFE0F", c: "#475569" },
    "Medical": { i: "\u{1F489}", c: "#be123c" }, "Architecture": { i: "\u{1F3D7}\uFE0F", c: "#a16207" },
    "Photography": { i: "\u{1F4F7}", c: "#0f766e" }, "Music": { i: "\u{1F3B5}", c: "#9333ea" },
    "Crafts": { i: "\u{1F9F5}", c: "#c026d3" }, "Mental Health": { i: "\u{1F9E0}", c: "#0d9488" },
    "Exams": { i: "\u{1F4DD}", c: "#b45309" }, "Islamic Studies": { i: "\u{1F54B}", c: "#0f766e" },
    "Channels": { i: "\u{1F4FA}", c: "#dc2626" }, "Open Source": { i: "\u{1F427}", c: "#ca8a04" },
    "Cybersecurity": { i: "\u{1F6E1}\uFE0F", c: "#be185d" }, "Data Science": { i: "\u{1F4CA}", c: "#1d4ed8" },
    "Gardening": { i: "\u{1F331}", c: "#15803d" }, "Pets": { i: "\u{1F43E}", c: "#b45309" },
    "Environment": { i: "\u{1F30D}", c: "#0d9488" }, "Universities": { i: "\u{1F3EB}", c: "#b45309" }, "Books": { i: "\u{1F4D5}", c: "#9a3412" }
  };
  const FALLBACK = ["#d2793a", "#3b82c4", "#2f8f6b", "#8e44ad", "#e0527a", "#0f9d9a", "#c9a227"];
  function meta(cat) {
    if (META[cat]) return META[cat];
    let h = 0; for (const ch of cat) h = (h * 31 + ch.charCodeAt(0)) % FALLBACK.length;
    return { i: "\u{1F517}", c: FALLBACK[h] };
  }

  const GROUPS = [
    { n: "Pakistan", i: "\u{1F1F5}\u{1F1F0}", c: "#15803d", cats: ["Government", "Pakistan Local", "Banking", "Law", "Urdu", "News", "Agriculture", "Religion", "Islamic Studies"] },
    { n: "Study", i: "\u{1F393}", c: "#d2793a", cats: ["Education", "Scholarships", "Learning", "Exams", "Writing", "Science", "History", "Languages", "Books", "Engineering", "Medical", "Architecture", "Data Science", "Universities"] },
    { n: "Work & Money", i: "\u{1F4BC}", c: "#3b82c4", cats: ["Jobs", "Freelancing", "Careers", "Business", "Marketing", "Finance", "Productivity"] },
    { n: "Tech", i: "\u{1F4BB}", c: "#4338ca", cats: ["Developer", "Tech", "Cybersecurity", "Open Source", "Utilities", "Free Downloads", "Gadgets", "AI Tools"] },
    { n: "Creative", i: "\u{1F3A8}", c: "#e0527a", cats: ["Design", "Media", "Photography", "Music", "Crafts", "Home & DIY", "Channels"] },
    { n: "Life", i: "\u{1F33F}", c: "#16a34a", cats: ["Health", "Fitness", "Mental Health", "Cooking", "Lifestyle", "Shopping", "Travel", "Automotive", "Kids & Family", "Gardening", "Pets", "Environment"] },
    { n: "Fun", i: "\u{1F389}", c: "#9333ea", cats: ["Entertainment", "Social Media", "Sports", "Gaming"] }
  ];
  const QUICK = [["Board Results", "board results"], ["Past Papers", "pastpapers"], ["Scholarships", "scholarship"], ["Admissions", "admissions"], ["Jobs", "jobs"], ["Free Courses", "free courses"]];

  const host = u => { try { return new URL(u).hostname.replace("www.", ""); } catch { return u; } };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let toastTimer;
  function toast(m) {
    const el = $("toast"); el.textContent = m; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch {}
      ta.remove();
    }
    toast(t("copied"));
  }

  function track(url) {
    const r = LS.get("lh-recent", []).filter(u => u !== url);
    r.unshift(url); LS.set("lh-recent", r.slice(0, 10));
    const c = LS.get("lh-clicks", {}); c[url] = (c[url] || 0) + 1; LS.set("lh-clicks", c);
  }

  function dailyPick() {
    if (!links.length) return null;
    const d = new Date();
    const key = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    return links[(key * 7919) % links.length];
  }

  function groupsWithData() {
    const counts = {};
    links.forEach(l => counts[l.category] = (counts[l.category] || 0) + 1);
    const known = new Set(GROUPS.flatMap(g => g.cats));
    const out = GROUPS.map(g => {
      const cats = g.cats.filter(c => counts[c]);
      return { ...g, cats, total: cats.reduce((s, c) => s + counts[c], 0) };
    }).filter(g => g.cats.length);
    const extra = Object.keys(counts).filter(c => !known.has(c));
    if (extra.length) out.push({ n: "More", i: "\u2728", c: "#78716c", cats: extra, total: extra.reduce((s, c) => s + counts[c], 0) });
    return { out, counts };
  }

  function renderCats() {
    const { out, counts } = groupsWithData();
    let h = `<div class="gtabs">`;
    h += `<button class="gtab ${!state.group && state.cat === "All" ? "active" : ""}" style="--c:#d2793a" data-all="1">\u2728 ${esc(t("all"))} <small>${links.length}</small></button>`;
    out.forEach(g => {
      const name = state.lang === "ur" ? (GN[g.n] || g.n) : g.n;
      h += `<button class="gtab ${state.group === g.n ? "active" : ""}" style="--c:${g.c}" data-group="${esc(g.n)}">${g.i} ${esc(name)} <small>${g.total}</small></button>`;
    });
    h += `</div>`;
    const cur = out.find(g => g.n === state.group);
    if (cur) {
      h += `<div class="tiles">` + cur.cats.map(c => {
        const m = meta(c);
        return `<button class="tile ${state.cat === c ? "active" : ""}" style="--c:${m.c}" data-cat="${esc(c)}"><span class="ti">${m.i}</span><span><span class="tn">${esc(c)}</span><span class="tc">${counts[c]} links</span></span></button>`;
      }).join("") + `</div>`;
    }
    $("cats").innerHTML = h;
  }

  function renderQuick() {
    const cur = state.q.trim().toLowerCase();
    $("quickchips").innerHTML = QUICK.map(([n, q]) => `<button class="qchip ${cur === q ? "active" : ""}" data-q="${esc(q)}">${esc(n)}</button>`).join("");
  }

  function card(l) {
    const m = meta(l.category), h = host(l.url);
    return `
    <a class="card" style="--c:${m.c}" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">
      <button class="star ${Fav.has(l.url) ? "on" : ""}" data-url="${esc(l.url)}" aria-label="Favorite">&#9733;</button>
      <div class="logo-box"><img loading="lazy" alt="" data-letter="${esc((l.name || "?").charAt(0).toUpperCase())}" src="https://www.google.com/s2/favicons?domain=${esc(h)}&sz=128"></div>
      <h3>${esc(l.name)}</h3>
      <div class="host">${esc(h)}</div>
      <p class="desc">${esc(l.desc || "")}</p>
      <div class="acts">
        <button class="act" data-act="copy" data-url="${esc(l.url)}" title="Copy link" aria-label="Copy link">&#128203;</button>
        <button class="act" data-act="wa" data-url="${esc(l.url)}" data-name="${esc(l.name)}" title="WhatsApp share" aria-label="Share on WhatsApp">&#128172;</button>
      </div>
      <div class="card-foot"><span class="badge">${m.i} ${esc(l.category)}</span><span class="go">Open &rarr;</span></div>
    </a>`;
  }

  function sortList(a) {
    if (state.sort === "az") return a.slice().sort((x, y) => x.name.localeCompare(y.name));
    if (state.sort === "za") return a.slice().sort((x, y) => y.name.localeCompare(x.name));
    if (state.sort === "opened") { const c = LS.get("lh-clicks", {}); return a.slice().sort((x, y) => (c[y.url] || 0) - (c[x.url] || 0)); }
    return a;
  }

  function topSections() {
    let h = "";
    const d = dailyPick();
    if (d) h += `<section class="sec today" style="--c:#d2793a"><h2 class="sec-title"><span class="sec-ico">&#127775;</span>${esc(t("today"))}</h2><div class="tgrid">${card(d)}</div></section>`;
    const r = LS.get("lh-recent", []).map(u => byUrl[u]).filter(Boolean);
    if (r.length) h += `<section class="sec" style="--c:#78716c"><h2 class="sec-title"><span class="sec-ico">&#128344;</span>${esc(t("recent"))} <small>${r.length}</small></h2><div class="grid">${r.map(card).join("")}</div></section>`;
    return h;
  }

  function syncHash() {
    try {
      const p = new URLSearchParams();
      if (state.group) p.set("g", state.group);
      if (state.cat !== "All") p.set("c", state.cat);
      if (state.q.trim()) p.set("q", state.q.trim());
      const s = p.toString();
      history.replaceState(null, "", s ? "#" + s : location.pathname + location.search);
    } catch {}
  }
  function readHash() {
    try {
      const p = new URLSearchParams(location.hash.slice(1));
      const cats = new Set(links.map(l => l.category));
      const gd = groupsWithData().out;
      const c = p.get("c"); if (c && cats.has(c)) state.cat = c;
      const g = p.get("g"); if (g && gd.some(x => x.n === g)) state.group = g;
      if (state.cat !== "All" && !state.group) { const f = gd.find(x => x.cats.includes(state.cat)); if (f) state.group = f.n; }
      const q = p.get("q"); if (q) { state.q = q; $("search").value = q; }
    } catch {}
  }

  function render() {
    let res = Search.filter(links, state);
    if (state.group && state.cat === "All") {
      const g = groupsWithData().out.find(x => x.n === state.group);
      if (g) res = res.filter(l => g.cats.includes(l.category));
    }
    const order = [...new Set(res.map(l => l.category))];
    res = sortList(res);
    const grouped = state.cat === "All" && !state.q.trim() && !state.onlyFav;
    if (grouped) {
      const by = {};
      res.forEach(l => (by[l.category] = by[l.category] || []).push(l));
      let h = state.group ? "" : topSections();
      h += order.map(c => {
        const m = meta(c);
        return `<section class="sec" style="--c:${m.c}"><h2 class="sec-title"><span class="sec-ico">${m.i}</span>${esc(c)} <small>${by[c].length}</small></h2><div class="grid">${by[c].map(card).join("")}</div></section>`;
      }).join("");
      $("content").innerHTML = h;
    } else {
      $("content").innerHTML = `<div class="grid">${res.map(card).join("")}</div>`;
    }
    $("empty").hidden = res.length > 0;
    $("stats").textContent = state.lang === "ur" ? `${links.length} میں سے ${res.length} لنکس` : `${res.length} of ${links.length} links`;
    $("favCount").textContent = Fav.count();
    renderQuick();
    syncHash();
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("year").textContent = new Date().getFullYear();
    applyLang();
    readHash();
    $("sort").value = state.sort;
    renderCats(); render();

    $("search").addEventListener("input", e => { state.q = e.target.value; render(); });

    $("sort").addEventListener("change", e => { state.sort = e.target.value; render(); });

    ($("langToggle") || document.createElement("i")).addEventListener("click", () => {
      state.lang = state.lang === "ur" ? "en" : "ur";
      LS.set("lh-lang", state.lang);
      applyLang(); renderCats(); render();
    });

    $("quickchips").addEventListener("click", e => {
      const b = e.target.closest(".qchip"); if (!b) return;
      const q = b.dataset.q;
      state.q = state.q.trim().toLowerCase() === q ? "" : q;
      state.cat = "All"; state.group = null;
      $("search").value = state.q;
      renderCats(); render();
      $("content").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    $("cats").addEventListener("click", e => {
      const all = e.target.closest("[data-all]");
      const g = e.target.closest("[data-group]");
      const tl = e.target.closest(".tile");
      if (all || g || tl) { state.q = ""; $("search").value = ""; }
      if (all) { state.group = null; state.cat = "All"; }
      else if (g) { state.group = state.group === g.dataset.group ? null : g.dataset.group; state.cat = "All"; }
      else if (tl) { state.cat = state.cat === tl.dataset.cat ? "All" : tl.dataset.cat; }
      else return;
      renderCats(); render();
      if (tl || g) $("content").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    $("content").addEventListener("click", e => {
      const s = e.target.closest(".star");
      if (s) { e.preventDefault(); e.stopPropagation(); Fav.toggle(s.dataset.url); render(); return; }
      const a = e.target.closest(".act");
      if (a) {
        e.preventDefault(); e.stopPropagation();
        if (a.dataset.act === "copy") copyText(a.dataset.url);
        else window.open("https://wa.me/?text=" + encodeURIComponent(a.dataset.name + " - " + a.dataset.url), "_blank", "noopener");
        return;
      }
      const c = e.target.closest("a.card");
      if (c) track(c.getAttribute("href"));
    });

    $("content").addEventListener("error", e => {
      const img = e.target; if (img.tagName !== "IMG") return;
      const s = document.createElement("span");
      s.className = "ini"; s.textContent = img.dataset.letter || "?";
      img.replaceWith(s);
    }, true);

    $("favToggle").addEventListener("click", e => {
      state.onlyFav = !state.onlyFav;
      e.currentTarget.classList.toggle("active", state.onlyFav);
      render();
    });

    document.addEventListener("keydown", e => {
      if (e.key === "/" && document.activeElement !== $("search")) { e.preventDefault(); $("search").focus(); }
    });

    const up = document.createElement("button");
    up.id = "toTop"; up.setAttribute("aria-label", "Back to top"); up.innerHTML = "&uarr;";
    up.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    document.body.appendChild(up);
    window.addEventListener("scroll", () => up.classList.toggle("show", window.scrollY > 700), { passive: true });
  });
})();