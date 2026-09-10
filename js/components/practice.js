/**
 * Practice & Quiz Interface Component
 */

import { aiGenerateQuiz, aiEvaluateAnswer } from "../ai.js";

export function renderPractice(state, quizData = null, quizIndex = 0, userAnswers = {}) {
  const topics = state.topics || [];

  if (!quizData) {
    // Practice configuration controls screen
    return `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 700;">Practice & Quiz Generator</h2>
        <p style="font-size: 13px; color: var(--text-muted);">Generate targeted question sets to strengthen recall and identify weak spots</p>
      </div>

      <div class="card" style="max-width: 600px; margin: 0 auto;">
        <div class="form-group">
          <label>Select Topic</label>
          <select id="prac-topic">
            ${topics.map(t => `<option value="${t.name}" ${t.name === "Deadlocks" ? "selected" : ""}>${t.number} ${t.name} (${t.mastery}% mastery)</option>`).join('')}
          </select>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="form-group">
            <label>Difficulty</label>
            <select id="prac-diff">
              <option value="Easy">Easy</option>
              <option value="Medium" selected>Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div class="form-group">
            <label>Number of Questions</label>
            <select id="prac-count">
              <option value="5" selected>5 Questions</option>
              <option value="10">10 Questions</option>
            </select>
          </div>
        </div>

        <div id="prac-loading" style="display: none;" class="loading-box">
          <div class="spinner"></div>
          <div style="font-weight: 600;">Preparing your practice quiz...</div>
        </div>

        <button class="btn btn-primary btn-lg" id="prac-generate-btn" style="width: 100%; margin-top: 12px;">
          Generate practice →
        </button>
      </div>
    `;
  }

  // Active Quiz View
  const total = quizData.length;
  const q = quizData[quizIndex];
  const selectedOption = userAnswers[quizIndex];
  const progressPercent = Math.round(((quizIndex + 1) / total) * 100);

  return `
    <div class="quiz-container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <span class="badge badge-primary">Question ${quizIndex + 1} of ${total}</span>
        </div>
        <button class="btn btn-outline btn-sm" id="quiz-exit-btn">Exit Quiz</button>
      </div>

      <div class="progress-bar-bg" style="margin-bottom: 24px;">
        <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
      </div>

      <div class="card">
        <h3 style="font-size: 17px; font-weight: 700; margin-bottom: 20px; line-height: 1.4;">
          ${q.question}
        </h3>

        <div class="quiz-options-list">
          ${q.options.map((opt, i) => `
            <div class="quiz-option ${selectedOption === i ? 'selected' : ''}" data-opt-idx="${i}">
              <div class="option-radio"></div>
              <div style="font-size: 14px; flex: 1;">${opt}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 20px;">
        <button class="btn btn-secondary" id="quiz-prev-btn" ${quizIndex === 0 ? 'disabled style="opacity:0.5;"' : ''}>← Previous</button>
        <button class="btn btn-primary" id="quiz-next-btn">
          ${quizIndex === total - 1 ? 'Finish & Evaluate →' : 'Next Question →'}
        </button>
      </div>
    </div>
  `;
}

export function bindPracticeEvents(container, state, { onStartQuiz, onAnswerQuestion, onFinishQuiz }) {
  const generateBtn = container.querySelector("#prac-generate-btn");
  if (generateBtn) {
    generateBtn.addEventListener("click", async () => {
      const topic = container.querySelector("#prac-topic").value;
      const diff = container.querySelector("#prac-diff").value;
      const count = parseInt(container.querySelector("#prac-count").value, 10);

      const loadingEl = container.querySelector("#prac-loading");
      if (loadingEl) loadingEl.style.display = "flex";
      generateBtn.style.display = "none";

      try {
        const questions = await aiGenerateQuiz(topic, count, diff);
        onStartQuiz(topic, questions);
      } catch (e) {
        alert("Failed to generate quiz questions.");
        if (loadingEl) loadingEl.style.display = "none";
        generateBtn.style.display = "block";
      }
    });
  }

  // Quiz Options
  container.querySelectorAll(".quiz-option").forEach(optEl => {
    optEl.addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-opt-idx"), 10);
      container.querySelectorAll(".quiz-option").forEach(el => el.classList.remove("selected"));
      e.currentTarget.classList.add("selected");
      onAnswerQuestion(idx);
    });
  });

  const prevBtn = container.querySelector("#quiz-prev-btn");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => onAnswerQuestion(null, "prev"));
  }

  const nextBtn = container.querySelector("#quiz-next-btn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => onAnswerQuestion(null, "next"));
  }

  const exitBtn = container.querySelector("#quiz-exit-btn");
  if (exitBtn) {
    exitBtn.addEventListener("click", () => onFinishQuiz(null));
  }
}
