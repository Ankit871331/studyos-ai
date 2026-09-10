/**
 * Study Plan Timeline Component
 */

export function renderStudyPlan(state) {
  const todayTasks = state.todayTasks || [];
  const upcomingPlan = state.upcomingPlan || [];

  return `
    <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h2 style="font-size: 20px; font-weight: 700;">Adaptive Study Plan</h2>
        <p style="font-size: 13px; color: var(--text-muted);">Organized chronologically based on your exam date and mastery levels</p>
      </div>
      <button class="btn btn-outline btn-sm" id="plan-add-task-btn">+ Add Task</button>
    </div>

    <div class="timeline">
      <!-- Today Section -->
      <div class="timeline-day" style="border-left: 4px solid var(--primary);">
        <div class="timeline-day-header">
          <div>
            <span class="badge badge-primary">TODAY</span>
            <span style="font-size: 15px; font-weight: 700; margin-left: 8px;">Monday, August 10</span>
          </div>
          <span style="font-size: 13px; color: var(--text-muted);">${todayTasks.filter(t=>t.completed).length}/${todayTasks.length} Completed</span>
        </div>

        <div class="task-list">
          ${todayTasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}">
              <div class="task-left">
                <div style="font-size: 12px; font-weight: 700; color: var(--text-muted); width: 50px;">${task.time || '09:00'}</div>
                <button class="task-checkbox ${task.completed ? 'checked' : ''}" data-task-id="${task.id}">
                  ${task.completed ? '✓' : ''}
                </button>
                <div>
                  <div class="task-title">${task.title}</div>
                  <div class="task-meta">${task.duration} min</div>
                </div>
              </div>
              <span class="badge ${task.completed ? 'badge-success' : 'badge-primary'}">
                ${task.completed ? 'Completed' : 'Start'}
              </span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Upcoming Days -->
      ${upcomingPlan.map(day => `
        <div class="timeline-day">
          <div class="timeline-day-header" style="flex-direction: column; align-items: flex-start;">
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
              <div>
                <span class="badge badge-secondary">${day.dayName}</span>
                <span style="font-size: 14px; font-weight: 600; margin-left: 8px;">${day.date || ''}</span>
              </div>
              <span style="font-size: 13px; color: var(--text-muted);">${day.focus}</span>
            </div>
            ${day.reason ? `<div class="timeline-reason">⚡ Adaptive Update: ${day.reason}</div>` : ''}
          </div>

          <div class="task-list">
            ${day.tasks.map(task => `
              <div class="task-item">
                <div class="task-left">
                  <div style="font-size: 12px; font-weight: 600; color: var(--text-muted);">○</div>
                  <div>
                    <div class="task-title">${task.title}</div>
                    <div class="task-meta">${task.duration} min</div>
                  </div>
                </div>
                <span class="badge badge-secondary">Scheduled</span>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

export function bindStudyPlanEvents(container, { onToggleTask, onAddTask }) {
  container.querySelectorAll(".task-checkbox").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const taskId = e.currentTarget.getAttribute("data-task-id");
      if (taskId) onToggleTask(taskId);
    });
  });

  const addBtn = container.querySelector("#plan-add-task-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const title = prompt("Enter new task title:");
      if (title) {
        onAddTask({ title, duration: 25, time: "Custom" });
      }
    });
  }
}
