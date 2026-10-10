(function () {
  const $ = id => document.getElementById(id);

  // ---- PWA ----
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
  let deferred = null;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; $("installBtn").hidden = false; });
  window.addEventListener("appinstalled", () => { $("installBtn").hidden = true; });
  $("installBtn").addEventListener("click", async () => {
    if (!deferred) return;
    deferred.prompt(); await deferred.userChoice;
    deferred = null; $("installBtn").hidden = true;
  });

  // ---- Namaz timings (aladhan.com free API) ----
  const CITIES = ["Islamabad", "Lahore", "Karachi", "Peshawar", "Quetta", "Abbottabad"];
  const sel = $("city");
  sel.innerHTML = CITIES.map(c => `<option>${c}</option>`).join("");
  sel.value = localStorage.getItem("lh-city") || "Islamabad";
  let timings = null;
  const today = () => { const d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };
  const hm = s => s.slice(0, 5).split(":").map(Number);
  function fmt(s) { const [h, m] = hm(s); return ((h % 12) || 12) + ":" + String(m).padStart(2, "0") + " " + (h >= 12 ? "PM" : "AM"); }
  function showPrayer() {
    const el = $("prayer");
    if (!timings) { el.textContent = "-"; return; }
    const now = new Date(), mins = now.getHours() * 60 + now.getMinutes();
    const names = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    const next = names.find(n => { const [h, m] = hm(timings[n]); return h * 60 + m > mins; }) || "Fajr";
    el.textContent = next + " " + fmt(timings[next]);
  }
  async function loadPrayer() {
    const city = sel.value, key = "lh-prayer-" + city + "-" + today();
    try { timings = JSON.parse(localStorage.getItem(key)); } catch { timings = null; }
    if (!timings) {
      try {
        const r = await fetch("https://api.aladhan.com/v1/timingsByCity?city=" + encodeURIComponent(city) + "&country=Pakistan&method=1&school=1");
        const j = await r.json();
        timings = j.data.timings;
        localStorage.setItem(key, JSON.stringify(timings));
      } catch { timings = null; }
    }
    showPrayer();
  }
  sel.addEventListener("change", () => { localStorage.setItem("lh-city", sel.value); loadPrayer(); });
  loadPrayer();
  setInterval(showPrayer, 60000);

  // ---- USD / PKR (open.er-api.com free API) ----
  async function loadFx() {
    const el = $("fx");
    let c = null;
    try { c = JSON.parse(localStorage.getItem("lh-fx")); } catch {}
    if (!c || Date.now() - c.t > 6 * 3600 * 1000) {
      try {
        const r = await fetch("https://open.er-api.com/v6/latest/USD");
        const j = await r.json();
        c = { t: Date.now(), v: j.rates.PKR };
        localStorage.setItem("lh-fx", JSON.stringify(c));
      } catch {}
    }
    el.textContent = c && c.v ? "1 USD = " + c.v.toFixed(1) + " PKR" : "-";
  }
  loadFx();

  // ---- Mobile bottom bar ----
  document.querySelector(".bnav").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    const act = b.dataset.nav;
    if (act === "home") {
      const s = $("search"); s.value = ""; s.dispatchEvent(new Event("input"));
      if ($("favToggle").classList.contains("active")) $("favToggle").click();
      const all = document.querySelector("#cats [data-all]"); if (all) all.click();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (act === "search") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => $("search").focus(), 350);
    } else if (act === "fav") {
      $("favToggle").click();
    } else if (act === "lang") {
      $("langToggle").click();
    }
  });
})();