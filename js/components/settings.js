/**
 * Settings & System Controls Component
 */

export function renderSettings(state) {
  return `
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 20px; font-weight: 700;">System Settings & Preferences</h2>
      <p style="font-size: 13px; color: var(--text-muted);">Manage your profile, active study subject, theme, and LocalStorage data</p>
    </div>

    <div class="card" style="max-width: 600px; margin: 0 auto;">
      <div style="font-weight: 700; font-size: 16px; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 10px;">
        Appearance & Theme
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <div style="font-weight: 600; font-size: 14px;">Color Theme</div>
          <div style="font-size: 12px; color: var(--text-muted);">Switch between dark charcoal and light mode</div>
        </div>
        <button class="btn btn-outline" id="settings-toggle-theme">
          ${state.theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>

      <div style="font-weight: 700; font-size: 16px; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 10px;">
        Active Course Information
      </div>

      <div class="form-group">
        <label>Course Title</label>
        <input type="text" id="settings-subject" value="${state.subject?.name || ''}" />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div class="form-group">
          <label>Exam Target Date</label>
          <input type="date" id="settings-date" value="${state.subject?.examDate || ''}" />
        </div>

        <div class="form-group">
          <label>Daily Study Time (mins)</label>
          <input type="number" id="settings-time" value="${state.subject?.dailyMinutes || 60}" />
        </div>
      </div>

      <button class="btn btn-primary" id="settings-save-btn" style="width: 100%; margin-bottom: 24px;">
        Save Changes
      </button>

      <div style="font-weight: 700; font-size: 16px; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 10px; color: var(--danger);">
        Data & Reset Options
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 600; font-size: 14px;">Reset to Operating Systems Demo Mode</div>
          <div style="font-size: 12px; color: var(--text-muted);">Restore sample topics, tasks, and weak Deadlocks state</div>
        </div>
        <button class="btn btn-outline btn-sm" id="settings-demo-btn" style="border-color: var(--danger); color: var(--danger);">
          Reset to Demo
        </button>
      </div>
    </div>
  `;
}

export function bindSettingsEvents(container, { onToggleTheme, onSaveSettings, onResetDemo }) {
  const themeBtn = container.querySelector("#settings-toggle-theme");
  if (themeBtn) themeBtn.addEventListener("click", onToggleTheme);

  const saveBtn = container.querySelector("#settings-save-btn");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const name = container.querySelector("#settings-subject").value;
      const date = container.querySelector("#settings-date").value;
      const mins = container.querySelector("#settings-time").value;
      onSaveSettings({ name, examDate: date, dailyMinutes: parseInt(mins, 10) });
      alert("Settings saved successfully.");
    });
  }

  const demoBtn = container.querySelector("#settings-demo-btn");
  if (demoBtn) {
    demoBtn.addEventListener("click", () => {
      if (confirm("Reset to Operating Systems Demo Mode?")) {
        onResetDemo();
      }
    });
  }
}
