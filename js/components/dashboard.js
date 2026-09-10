/**
 * Main Dashboard Component
 */

export function renderDashboard(state, { daysLeft, overallMastery }) {
  const completedCount = state.todayTasks.filter(t => t.completed).length;
  const totalTasks = state.todayTasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const rec = state.recommendation || {
    topicName: "Deadlocks",
    message: "Your Deadlocks score has fallen twice this week. Spend 20 minutes reviewing the four necessary conditions, then take a 5-question quiz.",
    actionText: "Review Deadlocks →"
  };

  return `
    <div style="margin-bottom: 28px;">
      <h2 style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Good morning.</h2>
      <p style="font-size: 15px; color: var(--text-muted); margin-top: 2px;">Let's make some progress today on ${state.subject?.name || 'Operating Systems'}.</p>
    </div>

    <!-- Top Stat Cards -->
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-label">Exam Countdown</div>
        <div class="stat-value">${daysLeft} <span style="font-size: 14px; font-weight: 500; color: var(--text-muted);">days left</span></div>
        <div class="stat-meta">Target: ${state.subject?.examDate || '2026-09-12'}</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Today's Progress</div>
        <div class="stat-value">${completedCount} / ${totalTasks} <span style="font-size: 14px; font-weight: 500; color: var(--text-muted);">tasks</span></div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill success" style="width: ${progressPercent}%;"></div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Study Streak</div>
        <div class="stat-value">${state.streakDays || 7} <span style="font-size: 14px; font-weight: 500; color: var(--text-muted);">days</span></div>
        <div class="stat-meta">Active consistency</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Overall Mastery</div>
        <div class="stat-value">${overallMastery}%</div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${overallMastery}%;"></div>
        </div>
      </div>
    </div>

    <!-- AI Adaptive Recommendation Banner -->
    <div class="recommendation-banner ${rec.currentMastery < 40 ? 'danger' : ''}">
      <div>
        <div class="rec-title">AI Recommendation • ${rec.topicName || 'Deadlocks'}</div>
        <div class="rec-text">${rec.message}</div>
      </div>
      <button class="btn btn-primary btn-sm" id="dashboard-rec-action" data-topic-id="${rec.topicId}">
        ${rec.actionText}
      </button>
    </div>

    <!-- Today's Plan Section -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Today's Plan</div>
          <div class="card-subtitle">Complete these tasks to stay on target</div>
        </div>
        <span class="badge badge-primary">${state.subject?.dailyMinutes || 60} mins total</span>
      </div>

      <div class="task-list">
        ${state.todayTasks.map(task => `
          <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
            <div class="task-left">
              <button class="task-checkbox ${task.completed ? 'checked' : ''}" data-task-id="${task.id}">
                ${task.completed ? '✓' : ''}
              </button>
              <div>
                <div class="task-title">${task.title}</div>
                <div class="task-meta">${task.duration} min • ${task.time || 'Scheduled'}</div>
              </div>
            </div>
            <button class="btn btn-outline btn-sm task-start-btn" data-task-id="${task.id}">
              ${task.completed ? 'Completed' : 'Start'}
            </button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Where You Stand Section -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Where You Stand</div>
          <div class="card-subtitle">Topic mastery breakdown based on practice & quizzes</div>
        </div>
      </div>

      <div class="topic-grid">
        ${state.topics.map(topic => {
          let badgeClass = 'badge-success';
          let fillClass = 'success';
          if (topic.mastery < 50) { badgeClass = 'badge-danger'; fillClass = 'danger'; }
          else if (topic.mastery < 75) { badgeClass = 'badge-warning'; fillClass = 'warning'; }

          return `
            <div class="topic-card">
              <div class="topic-header">
                <span class="topic-num">${topic.number}</span>
                <span class="badge ${badgeClass}">${topic.mastery}% mastery</span>
              </div>
              <div class="topic-name">${topic.name}</div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill ${fillClass}" style="width: ${topic.mastery}%;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function bindDashboardEvents(container, { onToggleTask, onNavigateToTopic, onNavigateToPractice }) {
  // Task checkboxes
  container.querySelectorAll(".task-checkbox, .task-start-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const taskId = e.currentTarget.getAttribute("data-task-id");
      if (taskId) onToggleTask(taskId);
    });
  });

  // AI Recommendation button
  const recBtn = container.querySelector("#dashboard-rec-action");
  if (recBtn) {
    recBtn.addEventListener("click", () => {
      onNavigateToTopic("t5");
    });
  }
}
