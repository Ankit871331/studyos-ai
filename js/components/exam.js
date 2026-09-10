/**
 * AI Exam Simulator & Exam Results Component
 */

import { aiAnalyzeExamResults, callAI } from "../ai.js";

export function renderExamSetup(state) {
  return `
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 20px; font-weight: 700;">AI Exam Simulator</h2>
      <p style="font-size: 13px; color: var(--text-muted);">Simulate real exam conditions to test your knowledge retention under time constraints</p>
    </div>

    <div class="card" style="max-width: 600px; margin: 0 auto;">
      <div style="font-weight: 700; font-size: 16px; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 10px;">
        Exam Parameters
      </div>

      <div class="form-group">
        <label>Covered Topics</label>
        <div style="font-size: 14px; font-weight: 600; color: var(--primary); background: var(--primary-subtle); padding: 10px 14px; border-radius: 8px;">
          All Syllabus Topics (${(state.topics || []).length} Units)
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
        <div class="form-group">
          <label>Questions</label>
          <select id="exam-q-count">
            <option value="10" selected>10 Questions</option>
            <option value="15">15 Questions</option>
          </select>
        </div>

        <div class="form-group">
          <label>Difficulty</label>
          <select id="exam-diff">
            <option value="Medium" selected>Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div class="form-group">
          <label>Time Limit</label>
          <select id="exam-time">
            <option value="30" selected>30 minutes</option>
            <option value="45">45 minutes</option>
          </select>
        </div>
      </div>

      <div id="exam-loading" style="display: none;" class="loading-box">
        <div class="spinner"></div>
        <div style="font-weight: 600;">Generating realistic exam questions...</div>
      </div>

      <button class="btn btn-primary btn-lg" id="exam-start-btn" style="width: 100%; margin-top: 16px;">
        Start Exam Simulation →
      </button>
    </div>
  `;
}

export function renderActiveExam(questions, currentIndex, timerSeconds, userAnswers) {
  const q = questions[currentIndex];
  const total = questions.length;
  const mins = Math.floor(timerSeconds / 60);
  const secs = String(timerSeconds % 60).padStart(2, "0");
  const selectedIdx = userAnswers[currentIndex];

  return `
    <div class="quiz-container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <span class="badge badge-primary">Question ${currentIndex + 1} / ${total}</span>
        </div>
        <div style="font-family: monospace; font-size: 16px; font-weight: 700; color: var(--warning); background: var(--warning-subtle); padding: 4px 12px; border-radius: 8px;">
          ⏱ ${mins}:${secs} remaining
        </div>
      </div>

      <div class="card">
        <h3 style="font-size: 17px; font-weight: 700; margin-bottom: 20px; line-height: 1.4;">
          ${q.question}
        </h3>

        <div class="quiz-options-list">
          ${q.options.map((opt, i) => `
            <div class="quiz-option ${selectedIdx === i ? 'selected' : ''}" data-opt-idx="${i}">
              <div class="option-radio"></div>
              <div style="font-size: 14px; flex: 1;">${opt}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 20px;">
        <button class="btn btn-secondary" id="exam-prev-btn" ${currentIndex === 0 ? 'disabled style="opacity:0.5;"' : ''}>← Previous</button>
        <button class="btn btn-primary" id="exam-next-btn">
          ${currentIndex === total - 1 ? 'Submit Exam →' : 'Next Question →'}
        </button>
      </div>
    </div>
  `;
}

export function renderExamResults(results) {
  return `
    <div class="card" style="max-width: 720px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid var(--border); margin-bottom: 20px;">
        <div style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Exam Complete</div>
        <div style="font-size: 42px; font-weight: 800; color: var(--primary); margin: 8px 0;">${results.score} / ${results.total}</div>
        <div style="font-size: 16px; font-weight: 600; color: var(--text);">${results.summary || 'Good progress overall!'}</div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
        <div style="background: var(--surface-2); padding: 16px; border-radius: 10px; border-left: 3px solid var(--success);">
          <div style="font-size: 11px; font-weight: 700; color: var(--success); text-transform: uppercase;">Strongest Topic</div>
          <div style="font-size: 16px; font-weight: 700; margin-top: 4px;">${results.strongestTopic || 'CPU Scheduling (91%)'}</div>
        </div>

        <div style="background: var(--surface-2); padding: 16px; border-radius: 10px; border-left: 3px solid var(--danger);">
          <div style="font-size: 11px; font-weight: 700; color: var(--danger); text-transform: uppercase;">Needs Attention</div>
          <div style="font-size: 16px; font-weight: 700; margin-top: 4px;">${results.needsAttentionTopic || 'Deadlocks (38%)'}</div>
        </div>
      </div>

      <div style="background: var(--surface-2); padding: 20px; border-radius: 12px; margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; color: var(--warning); text-transform: uppercase; margin-bottom: 6px;">⚡ Adaptive Study System Triggered</div>
        <p style="font-size: 14px; color: var(--text); line-height: 1.5;">
          ${results.adaptivePlanAdjustment?.reason || 'We automatically adjusted tomorrow\'s study plan based on your exam performance to target your weak areas.'}
        </p>
      </div>

      <button class="btn btn-primary" id="exam-done-btn" style="width: 100%;">
        Return to Dashboard →
      </button>
    </div>
  `;
}

export function bindExamEvents(container, { onStartExam, onAnswerExam, onSubmitExam, onDoneExam }) {
  const startBtn = container.querySelector("#exam-start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", async () => {
      const loading = container.querySelector("#exam-loading");
      if (loading) loading.style.display = "flex";
      startBtn.style.display = "none";

      const count = parseInt(container.querySelector("#exam-q-count").value, 10);
      const diff = container.querySelector("#exam-diff").value;

      try {
        const questions = await callAI({
          action: "generateExam",
          prompt: `Generate ${count} comprehensive exam questions for Operating Systems at ${diff} difficulty. Return JSON array.`,
          systemInstruction: "Generate academic exam questions in valid JSON.",
          responseFormat: "json"
        });
        onStartExam(questions);
      } catch (e) {
        alert("Failed to load exam questions.");
        if (loading) loading.style.display = "none";
        startBtn.style.display = "block";
      }
    });
  }

  container.querySelectorAll(".quiz-option").forEach(opt => {
    opt.addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-opt-idx"), 10);
      onAnswerExam(idx);
    });
  });

  const prevBtn = container.querySelector("#exam-prev-btn");
  if (prevBtn) prevBtn.addEventListener("click", () => onAnswerExam(null, "prev"));

  const nextBtn = container.querySelector("#exam-next-btn");
  if (nextBtn) nextBtn.addEventListener("click", () => onAnswerExam(null, "next"));

  const doneBtn = container.querySelector("#exam-done-btn");
  if (doneBtn) doneBtn.addEventListener("click", onDoneExam);
}
