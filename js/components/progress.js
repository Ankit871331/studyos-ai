/**
 * Progress & Analytics Component
 */

export function renderProgress(state, overallMastery) {
  const topics = state.topics || [];
  const history = state.quizHistory || [];

  const weakTopics = topics.filter(t => t.mastery < 60);
  const strongTopics = topics.filter(t => t.mastery >= 75);

  return `
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 20px; font-weight: 700;">Progress & Performance Analytics</h2>
      <p style="font-size: 13px; color: var(--text-muted);">Data-driven insights on your readiness and focus areas</p>
    </div>

    <!-- Overall Mastery Banner -->
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-label">Overall Readiness</div>
        <div class="stat-value">${overallMastery}%</div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${overallMastery}%;"></div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Weak Topics Needing Review</div>
        <div class="stat-value" style="color: var(--danger);">${weakTopics.length}</div>
        <div class="stat-meta">${weakTopics.map(t => t.name).join(', ') || 'None!'}</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Strong Mastery Topics</div>
        <div class="stat-value" style="color: var(--success);">${strongTopics.length}</div>
        <div class="stat-meta">${strongTopics.map(t => t.name).join(', ') || 'Keep studying!'}</div>
      </div>
    </div>

    <!-- Topic Mastery Breakdown -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Topic Mastery Levels</div>
      </div>

      <div class="topic-grid">
        ${topics.map(t => `
          <div class="topic-card">
            <div class="topic-header">
              <span class="topic-num">${t.number}</span>
              <span class="badge ${t.mastery < 50 ? 'badge-danger' : t.mastery < 75 ? 'badge-warning' : 'badge-success'}">${t.mastery}%</span>
            </div>
            <div class="topic-name">${t.name}</div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill ${t.mastery < 50 ? 'danger' : t.mastery < 75 ? 'warning' : 'success'}" style="width: ${t.mastery}%;"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Quiz & Exam History -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Recent Quiz & Exam History</div>
      </div>

      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border); color: var(--text-muted); font-size: 12px; text-transform: uppercase;">
              <th style="padding: 10px;">Date</th>
              <th style="padding: 10px;">Type</th>
              <th style="padding: 10px;">Topic</th>
              <th style="padding: 10px;">Score</th>
            </tr>
          </thead>
          <tbody>
            ${history.length === 0 ? '<tr><td colspan="4" style="padding: 16px; color: var(--text-muted); text-align: center;">No quiz history yet. Take your first quiz!</td></tr>' : history.map(h => `
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 12px 10px; color: var(--text-muted);">${h.date}</td>
                <td style="padding: 12px 10px;"><span class="badge badge-primary">${h.type}</span></td>
                <td style="padding: 12px 10px; font-weight: 600;">${h.topic}</td>
                <td style="padding: 12px 10px; font-weight: 700; color: ${h.score >= 70 ? 'var(--success)' : 'var(--danger)'};">${h.score}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
