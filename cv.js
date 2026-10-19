const THEME_KEY = "cv_theme";
const STAT_KEY = "cv_demo_stats";

function initTheme() {
  // Initialize theme based on saved preference
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) document.documentElement.setAttribute("data-theme", saved);

  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
  });
}

function initFilter() {
  const filter = document.getElementById("sectionFilter");
  const blocks = Array.from(document.querySelectorAll(".cv-block"));
  const empty = document.getElementById("emptyState");

  if (!filter || !blocks.length || !empty) return;

  function applyFilter() {
    const value = filter.value;

    let visibleCount = 0;
    for (const block of blocks) {
      const section = block.getAttribute("data-section");
      const show = value === "all" || section === value;
      block.style.display = show ? "block" : "none";
      if (show) visibleCount++;
    }
    empty.hidden = visibleCount > 0;
  }

  filter.addEventListener("change", applyFilter);
  applyFilter();
}

function downloadProjects() {
  const btn = document.getElementById("downloadProjectsBtn");
  const projects = Array.from(document.querySelectorAll("[data-project]"));
  if (!btn || !projects.length) return;

  btn.addEventListener("click", () => {
    const lines = [];
    lines.push("=== PROJECTS ===");
    lines.push("");

    projects.forEach((p, idx) => {
      const title = p.querySelector(".item-title")?.textContent?.trim() || `Project ${idx + 1}`;
      const meta = p.querySelector(".item-meta")?.textContent?.trim() || "";
      const desc = p.querySelector(".muted")?.textContent?.trim() || "";

      lines.push(`${idx + 1}. ${title}`);
      if (meta) lines.push(`   ${meta}`);
      if (desc) lines.push(`   ${desc}`);
      lines.push("");
    });

    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "projects.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  });
}
    
initTheme();
initFilter();
downloadProjects();
initStats();
initQuickContactModal();

function initStats() {
  const stats = JSON.parse(localStorage.getItem(STAT_KEY) || "{}");
  console.log("Demo stats:", stats);
}
function initQuickContactModal() {
  const modal = document.getElementById("quickContactModal");
  const openBtn = document.getElementById("openQuickContactModal");
  const closeBtn = document.getElementById("closeQuickContactModal");

  if (!modal || !openBtn || !closeBtn) return;

  openBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}