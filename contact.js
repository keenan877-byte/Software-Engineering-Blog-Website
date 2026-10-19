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

const STORAGE_KEY = "cv_saved_messages";

function getHistory() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}
function setHistory(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function openModal(modal, backdrop) {
  backdrop.hidden = false;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeModal(modal, backdrop) {
  backdrop.hidden = true;
  modal.hidden = true;
  document.body.style.overflow = "";
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("submitStatus");

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const topic = document.getElementById("topic");
  const message = document.getElementById("message");

  const errName = document.getElementById("errName");
  const errEmail = document.getElementById("errEmail");
  const errMessage = document.getElementById("errMessage");

  if (!form || !status || !name || !email || !topic || !message) return;

  function setErr(el, msg) {
    el.textContent = msg || "";
  }

  function clearErrs() {
    setErr(errName, "");
    setErr(errEmail, "");
    setErr(errMessage, "");
  }

  function validate() {
    clearErrs();

    let ok = true;
    if (name.value.trim().length < 2) {
      setErr(errName, "Please enter at least 2 characters.");
      ok = false;
    }
    if (!validateEmail(email.value.trim())) {
      setErr(errEmail, "Please enter a valid email address.");
      ok = false;
    }
    if (message.value.trim().length < 10) {
      setErr(errMessage, "Message must be at least 10 characters.");
      ok = false;
    }
    return ok;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.style.color = "";
    if (!validate()) {
      status.textContent = "Please fix the highlighted fields.";
      status.style.color = "var(--danger)";
      return;
    }

    const entry = {
      name: name.value.trim(),
      email: email.value.trim(),
      topic: topic.value,
      message: message.value.trim(),
      when: new Date().toISOString()
    };

    const existing = getHistory();
    existing.unshift(entry);
    setHistory(existing.slice(0, 20));

    status.textContent = "Submitted! Saved locally for demo ✅";
    status.style.color = "var(--success)";

    form.reset();
  });
}

function initHistoryModal() {
  const openBtn = document.getElementById("openHistoryBtn");
  const clearBtn = document.getElementById("clearHistoryBtn");

  const backdrop = document.getElementById("historyBackdrop");
  const modal = document.getElementById("historyModal");
  const closeBtn = document.getElementById("closeHistoryBtn");

  const list = document.getElementById("historyList");
  const empty = document.getElementById("historyEmpty");

  if (!openBtn || !backdrop || !modal || !closeBtn || !list || !empty) return;

  function render() {
    const items = getHistory();
    list.innerHTML = "";

    if (!items.length) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "history-card";

      const when = new Date(item.when);
      const whenText = isNaN(when.getTime()) ? item.when : when.toLocaleString();

      card.innerHTML = `
        <div class="row">
          <div class="topic">${escapeHtml(item.topic)}</div>
          <div class="when">${escapeHtml(whenText)}</div>
        </div>
        <div class="body">
          <strong>${escapeHtml(item.name)}</strong> (${escapeHtml(item.email)})<br/>
          ${escapeHtml(item.message)}
        </div>
      `;
      list.appendChild(card);
    });
  }

  openBtn.addEventListener("click", () => {
    render();
    openModal(modal, backdrop);
  });

  closeBtn.addEventListener("click", () => closeModal(modal, backdrop));
  backdrop.addEventListener("click", () => closeModal(modal, backdrop));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal(modal, backdrop);
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      setHistory([]);
      if (!modal.hidden) render();
    });
  }
}

// Basic escaping to avoid HTML injection in history
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll(">", "&gt;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

initContactForm();
initHistoryModal();
initTheme();

