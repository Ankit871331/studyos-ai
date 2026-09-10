/**
 * Quick Review / Flashcards Component
 */

export function renderQuickReview(state, flashcardIndex = 0, isRevealed = false) {
  const cards = state.flashcards || [];
  if (cards.length === 0) {
    return `<div class="card"><p>No flashcards available right now.</p></div>`;
  }

  const card = cards[flashcardIndex % cards.length];

  return `
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 20px; font-weight: 700;">Quick Review Flashcards</h2>
      <p style="font-size: 13px; color: var(--text-muted);">Active recall session to solidify retention before your exam</p>
    </div>

    <div style="max-width: 580px; margin: 40px auto; text-align: center;">
      <div style="margin-bottom: 12px; font-size: 12px; font-weight: 700; color: var(--text-muted);">
        CARD ${flashcardIndex + 1} OF ${cards.length} • ${card.topicName}
      </div>

      <div class="card" style="min-height: 220px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 32px; transition: all 0.2s ease;">
        <h3 style="font-size: 18px; font-weight: 700; line-height: 1.5; margin-bottom: 16px;">
          ${card.question}
        </h3>

        ${isRevealed ? `
          <div style="font-size: 15px; color: var(--text); background: var(--surface-2); padding: 16px; border-radius: 10px; width: 100%; text-align: left; white-space: pre-line; border-left: 3px solid var(--primary); margin-top: 12px;">
            ${card.answer}
          </div>
        ` : `
          <button class="btn btn-secondary" id="fc-reveal-btn" style="margin-top: 16px;">
            Reveal Answer 👁
          </button>
        `}
      </div>

      ${isRevealed ? `
        <div style="display: flex; gap: 16px; justify-content: center; margin-top: 20px;">
          <button class="btn btn-outline" id="fc-fail-btn" style="border-color: var(--danger); color: var(--danger);">
            Need to review ✕
          </button>
          <button class="btn btn-primary" id="fc-pass-btn" style="background: var(--success);">
            Got it ✓
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

export function bindQuickReviewEvents(container, flashcardIndex, isRevealed, onReveal, onResponse) {
  const revealBtn = container.querySelector("#fc-reveal-btn");
  if (revealBtn) {
    revealBtn.addEventListener("click", onReveal);
  }

  const failBtn = container.querySelector("#fc-fail-btn");
  if (failBtn) {
    failBtn.addEventListener("click", () => onResponse(false));
  }

  const passBtn = container.querySelector("#fc-pass-btn");
  if (passBtn) {
    passBtn.addEventListener("click", () => onResponse(true));
  }
}
