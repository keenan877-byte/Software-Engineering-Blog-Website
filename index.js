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

function animateNumber(el, target, duration = 900) {
  const start = 0;
  const startTime = performance.now();

  function tick(now) {
    const t = Math.min(1, (now - startTime) / duration);
    const value = Math.floor(start + (target - start) * (t * (2 - t))); // easeOutQuad
    el.textContent = String(value);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initStats() {
  // You can edit these values
  const stats = [
    { id: "statYear", value: 2, suffix: "" },
    { id: "statProjects", value: 6, suffix: "" },
    { id: "statSkills", value: 7, suffix: "" }
  ];

  const done = localStorage.getItem(STAT_KEY);
  if (done === "true") {
    stats.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) el.textContent = String(s.value);
    });
    return;
  }

  stats.forEach((s, i) => {
    const el = document.getElementById(s.id);
    if (!el) return;
    setTimeout(() => animateNumber(el, s.value), i * 120);
  });

  // mark done after a moment
  setTimeout(() => localStorage.setItem(STAT_KEY, "true"), 1200);
}

function initQuickContactModal() {
  const openBtn = document.getElementById("openContactBtn");
  const backdrop = document.getElementById("contactBackdrop");
  const modal = document.getElementById("contactModal");
  const closeBtn = document.getElementById("closeContactBtn");
  const form = document.getElementById("quickContactForm");
  const status = document.getElementById("qcStatus");

  if (!openBtn || !backdrop || !modal || !closeBtn || !form || !status) return;

  function show() {
    backdrop.hidden = false;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function hide() {
    backdrop.hidden = true;
    modal.hidden = true;
    document.body.style.overflow = "";
    status.textContent = "";
  }

  openBtn.addEventListener("click", show);
  closeBtn.addEventListener("click", hide);
  backdrop.addEventListener("click", hide);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) hide();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.style.color = "";

    const name = document.getElementById("qcName").value.trim();
    const email = document.getElementById("qcEmail").value.trim();
    const message = document.getElementById("qcMessage").value.trim();

    // Simple validation (HTML required+minlength exists too)
    if (name.length < 2) {
      status.style.color = "var(--danger)";
      status.textContent = "Please enter your name.";
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      status.style.color = "var(--danger)";
      status.textContent = "Please enter a valid email.";
      return;
    }
    if (message.length < 5) {
      status.style.color = "var(--danger)";
      status.textContent = "Message is too short.";
      return;
    }

    // Save demo message locally (same key as contact.js)
    const key = "cv_saved_messages";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.unshift({
      name,
      email,
      topic: "Quick Contact",
      message,
      when: new Date().toISOString()
    });
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 20)));

    status.style.color = "var(--success)";
    status.textContent = "Sent! (saved locally for demo)";
    form.reset();
  });
}

initTheme();
initStats();
initQuickContactModal();