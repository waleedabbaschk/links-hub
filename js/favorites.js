const Fav = {
  key: "lh-favs",
  list() {
    try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch { return []; }
  },
  has(url) { return this.list().includes(url); },
  toggle(url) {
    let l = this.list();
    l = l.includes(url) ? l.filter(u => u !== url) : [...l, url];
    localStorage.setItem(this.key, JSON.stringify(l));
    return l.includes(url);
  },
  count() { return this.list().length; }
};