/**
 * AI Tutor Workspace Component
 */

import { aiGenerateTutorResponse } from "../ai.js";

export function renderTutor(state, topicName = "Deadlocks", messages = []) {
  const topicObj = (state.topics || []).find(t => t.name.toLowerCase() === topicName.toLowerCase()) || state.topics[0] || { name: "Deadlocks", mastery: 38 };

  return `
    <div class="tutor-workspace">
      <div class="tutor-header">
        <div>
          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted);">AI TUTOR WORKSPACE</div>
          <div style="font-size: 17px; font-weight: 700; color: var(--text);">${topicObj.name}</div>
        </div>
        <span class="badge ${topicObj.mastery < 50 ? 'badge-danger' : 'badge-primary'}">Mastery ${topicObj.mastery}%</span>
      </div>

      <div class="tutor-messages" id="tutor-messages-box">
        ${messages.length === 0 ? renderInitialExplanation(topicObj.name) : messages.map(m => `
          <div class="tutor-msg ${m.role}">
            ${formatMarkdown(m.content)}
          </div>
        `).join('')}
      </div>

      <!-- Quick Action Buttons -->
      <div class="tutor-actions">
        <button class="btn btn-outline btn-sm tutor-quick-btn" data-action="Explain simply">Explain simply</button>
        <button class="btn btn-outline btn-sm tutor-quick-btn" data-action="Give an analogy">Give an analogy</button>
        <button class="btn btn-outline btn-sm tutor-quick-btn" data-action="Show an example">Show an example</button>
        <button class="btn btn-outline btn-sm tutor-quick-btn" data-action="Test me">Test me</button>
        <button class="btn btn-outline btn-sm tutor-quick-btn" data-action="Summarize">Summarize</button>
      </div>

      <!-- Input Area -->
      <div class="tutor-input-area">
        <input type="text" id="tutor-input" placeholder="Ask about ${topicObj.name}..." />
        <button class="btn btn-primary" id="tutor-send-btn">Send →</button>
      </div>
    </div>
  `;
}

function renderInitialExplanation(topicName) {
  return `
    <div class="tutor-msg ai">
      <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 12px; color: var(--primary);">${topicName}</h3>
      
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <div style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">In simple terms</div>
          <p style="font-size: 14px; margin-top: 2px;">A deadlock happens when two or more processes are stuck forever because each holds a resource the other needs to continue execution.</p>
        </div>

        <div>
          <div style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Why it happens</div>
          <p style="font-size: 14px; margin-top: 2px;">Four conditions must happen simultaneously: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.</p>
        </div>

        <div>
          <div style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Example</div>
          <p style="font-size: 14px; margin-top: 2px;">Process A holds Resource 1 and requests Resource 2. Process B holds Resource 2 and requests Resource 1. Neither can move forward.</p>
        </div>

        <div>
          <div style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Key idea</div>
          <p style="font-size: 14px; margin-top: 2px;">If you break even <strong>ONE</strong> of the four conditions, deadlocks become mathematically impossible!</p>
        </div>
      </div>
    </div>
  `;
}

function formatMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/### (.*)/g, '<h3 style="font-size: 16px; font-weight: 700; color: var(--primary); margin-top: 12px; margin-bottom: 6px;">$1</h3>')
    .replace(/#### (.*)/g, '<div style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-top: 8px;">$1</div>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

export function bindTutorEvents(container, topicName, messages, onSendMessage) {
  const sendBtn = container.querySelector("#tutor-send-btn");
  const inputEl = container.querySelector("#tutor-input");

  const handleSend = async (customQuery = null, actionType = "explain") => {
    const query = customQuery || (inputEl ? inputEl.value.trim() : "");
    if (!query) return;

    if (inputEl) inputEl.value = "";

    // Append user message
    messages.push({ role: "user", content: query });
    container.innerHTML = renderTutor({ topics: [{ name: topicName, mastery: 38 }] }, topicName, messages);

    // Scroll to bottom
    const box = container.querySelector("#tutor-messages-box");
    if (box) box.scrollTop = box.scrollHeight;

    // Fetch AI response
    try {
      const responseText = await aiGenerateTutorResponse(topicName, query, actionType);
      messages.push({ role: "ai", content: responseText });
    } catch (e) {
      messages.push({ role: "ai", content: "Sorry, I couldn't process that request right now." });
    }

    onSendMessage(topicName, messages);
  };

  if (sendBtn) {
    sendBtn.addEventListener("click", () => handleSend());
  }

  if (inputEl) {
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSend();
    });
  }

  container.querySelectorAll(".tutor-quick-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const action = e.currentTarget.getAttribute("data-action");
      handleSend(`${action} for ${topicName}`, action);
    });
  });
}
