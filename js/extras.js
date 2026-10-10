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