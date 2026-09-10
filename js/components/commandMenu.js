/**
 * Command Menu Modal Component (Cmd / Ctrl + K)
 */

export function renderCommandMenu(isOpen = false, searchQuery = "") {
  if (!isOpen) return "";

  const actions = [
    { id: "cmd-dashboard", label: "Go to Overview Dashboard", category: "Navigation" },
    { id: "cmd-plan", label: "Start Today's Study Plan", category: "Study" },
    { id: "cmd-weak", label: "Review Weak Topics (Deadlocks)", category: "Study" },
    { id: "cmd-tutor", label: "Open AI Tutor Workspace", category: "AI Tools" },
    { id: "cmd-practice", label: "Generate Practice Quiz", category: "Assessment" },
    { id: "cmd-exam", label: "Start AI Exam Simulator", category: "Assessment" },
    { id: "cmd-flashcards", label: "Start Quick Review Flashcards", category: "Study" },
    { id: "cmd-theme", label: "Toggle Dark / Light Theme", category: "System" },
    { id: "cmd-demo", label: "Reset to Demo Mode", category: "System" }
  ];

  const filtered = actions.filter(a => a.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return `
    <div class="modal-overlay" id="cmd-overlay">
      <div class="cmd-menu" id="cmd-menu-box">
        <input type="text" class="cmd-input" id="cmd-input-field" placeholder="Search or jump to... (Press Esc to close)" value="${searchQuery}" autofocus />
        <div class="cmd-list">
          ${filtered.length === 0 ? '<div style="padding: 16px; color: var(--text-muted); text-align: center;">No matching actions found.</div>' : filtered.map(a => `
            <div class="cmd-item" data-action-id="${a.id}">
              <span class="badge badge-secondary" style="font-size: 10px;">${a.category}</span>
              <span style="font-weight: 500;">${a.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export function bindCommandMenuEvents(container, onSelectAction, onClose) {
  const overlay = container.querySelector("#cmd-overlay");
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) onClose();
    });
  }

  const inputField = container.querySelector("#cmd-input-field");
  if (inputField) {
    inputField.focus();
    inputField.addEventListener("keydown", (e) => {
      if (e.key === "Escape") onClose();
    });
  }

  container.querySelectorAll(".cmd-item").forEach(item => {
    item.addEventListener("click", (e) => {
      const actId = e.currentTarget.getAttribute("data-action-id");
      if (actId) {
        onSelectAction(actId);
        onClose();
      }
    });
  });
}
