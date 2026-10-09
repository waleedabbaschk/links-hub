const Search = {
  filter(links, { q = "", cat = "All", onlyFav = false }) {
    const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return links.filter(l => {
      if (cat !== "All" && l.category !== cat) return false;
      if (onlyFav && !Fav.has(l.url)) return false;
      if (!words.length) return true;
      const hay = (l.name + " " + l.desc + " " + l.category + " " + (l.tags || []).join(" ") + " " + l.url).toLowerCase();
      return words.every(w => hay.includes(w));
    });
  }
};