/**
 * Landing Page Component
 */

export function renderLanding({ onBuildPlan, onTryDemo }) {
  return `
    <div class="landing-hero">
      <div class="landing-tagline">StudyOS AI</div>
      <h1 class="landing-title">Your personal study system, powered by AI.</h1>
      <p class="landing-sub">Turn your syllabus into a realistic study plan, practice smarter, and understand exactly where you need to improve.</p>

      <div class="landing-cta">
        <button class="btn btn-primary btn-lg" id="landing-build-btn">
          Build my study plan →
        </button>
        <button class="btn btn-secondary btn-lg" id="landing-demo-btn">
          Try demo mode
        </button>
      </div>

      <div class="landing-preview">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 16px;">
          <div style="font-weight: 700; font-size: 14px;">Product Preview: Operating Systems</div>
          <span class="badge badge-success">34 Days Until Exam</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; text-align: left;">
          <div style="background: var(--surface-2); padding: 12px; border-radius: 8px;">
            <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">TODAY'S TASKS</div>
            <div style="font-size: 18px; font-weight: 700; margin-top: 2px;">3 / 5 Done</div>
          </div>
          <div style="background: var(--surface-2); padding: 12px; border-radius: 8px;">
            <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">STUDY STREAK</div>
            <div style="font-size: 18px; font-weight: 700; margin-top: 2px;">7 Days</div>
          </div>
          <div style="background: var(--surface-2); padding: 12px; border-radius: 8px;">
            <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">OVERALL MASTERY</div>
            <div style="font-size: 18px; font-weight: 700; margin-top: 2px;">74%</div>
          </div>
        </div>

        <div style="text-align: left; background: var(--surface-2); padding: 14px; border-radius: 10px; border-left: 4px solid var(--warning);">
          <div style="font-size: 11px; font-weight: 700; color: var(--warning); text-transform: uppercase;">AI Intervention</div>
          <div style="font-size: 13px; color: var(--text); margin-top: 2px;">"Your Deadlocks score has fallen twice this week. Spend 20 minutes reviewing the four necessary conditions, then take a 5-question quiz."</div>
        </div>
      </div>
    </div>
  `;
}

export function bindLandingEvents(container, { onBuildPlan, onTryDemo }) {
  const buildBtn = container.querySelector("#landing-build-btn");
  if (buildBtn) buildBtn.addEventListener("click", onBuildPlan);

  const demoBtn = container.querySelector("#landing-demo-btn");
  if (demoBtn) demoBtn.addEventListener("click", onTryDemo);
}
