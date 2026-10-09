const Theme = {
  key: "lh-theme",
  init() {
    const saved = localStorage.getItem(this.key);
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    this.set(saved || "light" || prefers);
    document.getElementById("themeToggle").addEventListener("click", () => {
      this.set(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    });
  },
  set(mode) {
    document.documentElement.dataset.theme = mode;
    localStorage.setItem(this.key, mode);
    const b = document.getElementById("themeToggle");
    if (b) b.innerHTML = mode === "dark" ? "&#9728;" : "&#9790;";
  }
};
document.addEventListener("DOMContentLoaded", () => Theme.init());