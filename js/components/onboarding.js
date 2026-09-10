/**
 * Onboarding Flow Component (4-Step Guided Setup)
 */

import { SAMPLE_SYLLABUS_TEXT } from "../sampleData.js";
import { aiGenerateStudyPlan } from "../ai.js";

export function renderOnboarding(step = 1, formData = {}) {
  const defaultData = {
    subject: formData.subject || "Operating Systems",
    examDate: formData.examDate || "2026-09-12",
    dailyMinutes: formData.dailyMinutes || "60",
    syllabus: formData.syllabus || SAMPLE_SYLLABUS_TEXT,
  };

  return `
    <div class="onboarding-card">
      <div class="step-indicator">
        <span class="${step === 1 ? "active" : ""}">01 Subject</span>
        ───
        <span class="${step === 2 ? "active" : ""}">02 Exam Date</span>
        ───
        <span class="${step === 3 ? "active" : ""}">03 Time</span>
        ───
        <span class="${step === 4 ? "active" : ""}">04 Syllabus</span>
      </div>

      <div id="onboarding-step-content">
        ${renderStepContent(step, defaultData)}
      </div>
    </div>
  `;
}

function renderStepContent(step, data) {
  if (step === 1) {
    return `
      <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">What are you studying?</h2>
      <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 24px;">Enter the name of your subject or course.</p>
      
      <div class="form-group">
        <label>Course Title</label>
        <input type="text" id="ob-subject" value="${data.subject}" placeholder="e.g. Operating Systems, Data Structures, General Chemistry" />
      </div>

      <div style="display: flex; justify-content: flex-end; margin-top: 24px;">
        <button class="btn btn-primary" id="ob-next-1">Next: Exam Date →</button>
      </div>
    `;
  }

  if (step === 2) {
    return `
      <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">When is your exam?</h2>
      <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 24px;">This helps StudyOS calculate your daily study pace.</p>
      
      <div class="form-group">
        <label>Exam Date</label>
        <input type="date" id="ob-exam-date" value="${data.examDate}" />
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 24px;">
        <button class="btn btn-secondary" id="ob-prev-2">← Back</button>
        <button class="btn btn-primary" id="ob-next-2">Next: Daily Time →</button>
      </div>
    `;
  }

  if (step === 3) {
    return `
      <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">How much time can you study each day?</h2>
      <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 24px;">Select a realistic target you can stick to consistently.</p>
      
      <div class="form-group">
        <label>Daily Study Commitment</label>
        <select id="ob-daily-time">
          <option value="30" ${data.dailyMinutes == 30 ? "selected" : ""}>30 minutes / day</option>
          <option value="60" ${data.dailyMinutes == 60 ? "selected" : ""}>1 hour / day</option>
          <option value="120" ${data.dailyMinutes == 120 ? "selected" : ""}>2 hours / day</option>
          <option value="180" ${data.dailyMinutes == 180 ? "selected" : ""}>3+ hours / day</option>
        </select>
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 24px;">
        <button class="btn btn-secondary" id="ob-prev-3">← Back</button>
        <button class="btn btn-primary" id="ob-next-3">Next: Syllabus →</button>
      </div>
    `;
  }

  if (step === 4) {
    return `
      <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">Paste your syllabus</h2>
      <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 16px;">Paste your unit topics, chapter headings, or course outline below.</p>
      
      <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
        <button class="btn btn-outline btn-sm" id="ob-load-sample">Load Sample Syllabus</button>
      </div>

      <div class="form-group">
        <textarea id="ob-syllabus" rows="10" placeholder="Unit 1: Introduction&#10;- OS functions&#10;- System calls&#10;&#10;Unit 2: Process Management...">${data.syllabus}</textarea>
      </div>

      <div id="ob-loading-state" style="display: none;" class="loading-box">
        <div class="spinner"></div>
        <div id="ob-loading-msg" style="font-weight: 600;">Reading your syllabus...</div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 24px;" id="ob-step4-btns">
        <button class="btn btn-secondary" id="ob-prev-4">← Back</button>
        <button class="btn btn-primary" id="ob-finish-btn">Build my study system →</button>
      </div>
    `;
  }
}

export function bindOnboardingEvents(container, currentStep, formData, onStepChange, onComplete) {
  if (currentStep === 1) {
    const nextBtn = container.querySelector("#ob-next-1");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const subject = container.querySelector("#ob-subject").value || "Operating Systems";
        formData.subject = subject;
        onStepChange(2, formData);
      });
    }
  }

  if (currentStep === 2) {
    const prevBtn = container.querySelector("#ob-prev-2");
    if (prevBtn) prevBtn.addEventListener("click", () => onStepChange(1, formData));

    const nextBtn = container.querySelector("#ob-next-2");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const examDate = container.querySelector("#ob-exam-date").value;
        formData.examDate = examDate;
        onStepChange(3, formData);
      });
    }
  }

  if (currentStep === 3) {
    const prevBtn = container.querySelector("#ob-prev-3");
    if (prevBtn) prevBtn.addEventListener("click", () => onStepChange(2, formData));

    const nextBtn = container.querySelector("#ob-next-3");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const dailyMinutes = container.querySelector("#ob-daily-time").value;
        formData.dailyMinutes = dailyMinutes;
        onStepChange(4, formData);
      });
    }
  }

  if (currentStep === 4) {
    const prevBtn = container.querySelector("#ob-prev-4");
    if (prevBtn) prevBtn.addEventListener("click", () => onStepChange(3, formData));

    const loadSampleBtn = container.querySelector("#ob-load-sample");
    if (loadSampleBtn) {
      loadSampleBtn.addEventListener("click", () => {
        const area = container.querySelector("#ob-syllabus");
        if (area) area.value = SAMPLE_SYLLABUS_TEXT;
      });
    }

    const finishBtn = container.querySelector("#ob-finish-btn");
    if (finishBtn) {
      finishBtn.addEventListener("click", async () => {
        const syllabus = container.querySelector("#ob-syllabus").value;
        formData.syllabus = syllabus;

        // Show context-specific loading state
        const loadingBox = container.querySelector("#ob-loading-state");
        const loadingMsg = container.querySelector("#ob-loading-msg");
        const btnsBox = container.querySelector("#ob-step4-btns");

        if (loadingBox) loadingBox.style.display = "flex";
        if (btnsBox) btnsBox.style.display = "none";

        const messages = [
          "Reading your syllabus...",
          "Mapping topics & unit dependencies...",
          "Building your study plan...",
          "Checking your weak areas..."
        ];

        let msgIdx = 0;
        const interval = setInterval(() => {
          msgIdx = (msgIdx + 1) % messages.length;
          if (loadingMsg) loadingMsg.textContent = messages[msgIdx];
        }, 800);

        try {
          const aiResult = await aiGenerateStudyPlan(
            formData.subject,
            formData.syllabus,
            formData.examDate,
            formData.dailyMinutes
          );
          clearInterval(interval);
          onComplete(formData, aiResult);
        } catch (e) {
          clearInterval(interval);
          onComplete(formData, null);
        }
      });
    }
  }
}
