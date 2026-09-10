/**
 * Learn Topics Page Component
 */

export function renderLearn(state, selectedTopicId = null) {
  const topics = state.topics || [];
  const activeTopic = topics.find(t => t.id === selectedTopicId) || topics[0];

  return `
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 20px; font-weight: 700;">Learn & Understand</h2>
      <p style="font-size: 13px; color: var(--text-muted);">Master key concepts before testing your recall</p>
    </div>

    <div style="display: grid; grid-template-columns: 280px 1fr; gap: 24px;">
      <!-- Topics List Navigation -->
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${topics.map(t => {
          let badgeClass = 'badge-success';
          if (t.mastery < 50) badgeClass = 'badge-danger';
          else if (t.mastery < 75) badgeClass = 'badge-warning';

          const isSelected = activeTopic && activeTopic.id === t.id;

          return `
            <button class="topic-select-btn ${isSelected ? 'active' : ''}" data-topic-id="${t.id}" style="
              display: flex; align-items: center; justify-content: space-between;
              padding: 12px 14px; border-radius: 10px; border: 1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'};
              background: ${isSelected ? 'var(--primary-subtle)' : 'var(--surface)'};
              color: var(--text); text-align: left; cursor: pointer; transition: all 0.15s ease;
            ">
              <div>
                <div style="font-size: 11px; font-weight: 700; color: var(--text-muted);">${t.number}</div>
                <div style="font-size: 14px; font-weight: 600;">${t.name}</div>
              </div>
              <span class="badge ${badgeClass}">${t.mastery}%</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Focused Learning Content View -->
      <div class="card">
        ${activeTopic ? `
          <div class="card-header">
            <div>
              <span class="topic-num">${activeTopic.number} • ${activeTopic.unit || 'Unit'}</span>
              <h3 class="card-title" style="font-size: 20px; margin-top: 4px;">${activeTopic.name}</h3>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-primary btn-sm" id="learn-ask-tutor-btn" data-topic-name="${activeTopic.name}">Ask AI Tutor</button>
              <button class="btn btn-secondary btn-sm" id="learn-practice-btn" data-topic-name="${activeTopic.name}">Practice Quiz</button>
            </div>
          </div>

          <div style="line-height: 1.6; color: var(--text); display: flex; flex-direction: column; gap: 16px;">
            <div style="background: var(--surface-2); padding: 16px; border-radius: 10px; border-left: 3px solid var(--primary);">
              <div style="font-size: 12px; font-weight: 700; color: var(--primary); text-transform: uppercase;">Core Summary</div>
              <p style="font-size: 14px; margin-top: 4px;">
                ${getTopicDescription(activeTopic.name)}
              </p>
            </div>

            <div>
              <h4 style="font-size: 15px; font-weight: 700; margin-bottom: 8px;">Key Concepts & Takeaways</h4>
              <ul style="padding-left: 20px; font-size: 14px; color: var(--text-muted); display: flex; flex-direction: column; gap: 8px;">
                ${getTopicTakeaways(activeTopic.name).map(t => `<li>${t}</li>`).join('')}
              </ul>
            </div>

            <div style="margin-top: 12px; padding-top: 16px; border-top: 1px solid var(--border);">
              <div style="font-size: 13px; font-weight: 700; margin-bottom: 8px;">Current Mastery Status: ${activeTopic.mastery}%</div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill ${activeTopic.mastery < 50 ? 'danger' : activeTopic.mastery < 75 ? 'warning' : 'success'}" style="width: ${activeTopic.mastery}%;"></div>
              </div>
            </div>
          </div>
        ` : '<p>Select a topic to start learning.</p>'}
      </div>
    </div>
  `;
}

function getTopicDescription(name) {
  const map = {
    "OS Fundamentals": "Operating Systems act as an intermediary between the user and computer hardware, managing CPU resources, memory, storage devices, and system calls.",
    "Processes": "A process is a program in execution, consisting of program code, process counter, stack, heap, and process control block (PCB) state.",
    "CPU Scheduling": "CPU scheduling determines which process in the ready queue gets allocated the CPU, balancing throughput, turnaround time, waiting time, and response time.",
    "Synchronization": "Process synchronization ensures cooperative processes execute orderly without memory race conditions or inconsistent shared data states.",
    "Deadlocks": "A deadlock is a situation where two or more processes are unable to proceed because each is waiting for the other to release resources.",
    "Memory Management": "Memory management allocates physical RAM frames to logical address pages, optimizing space via paging, segmentation, and virtual memory.",
    "File Systems": "File systems structure persistent disk storage, organizing directory trees, inode tables, and sector allocations for file access."
  };
  return map[name] || "Essential core topic in computer systems architecture.";
}

function getTopicTakeaways(name) {
  const map = {
    "Deadlocks": [
      "Understand Coffman's 4 necessary conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.",
      "Resource Allocation Graphs (RAG) help detect cycles in resource requests.",
      "Banker's Algorithm uses safety checks to prevent unsafe state transitions."
    ],
    "Processes": [
      "Process state transitions: New → Ready → Running → Waiting → Terminated.",
      "PCB stores execution registers, program counters, and accounting information.",
      "Context switching incurs overhead by saving and loading register states."
    ],
    "CPU Scheduling": [
      "FCFS suffers from the Convoy Effect.",
      "SJF is mathematically optimal for minimum average waiting time but can cause starvation.",
      "Round Robin (RR) relies on time quanta for fair time-sharing."
    ]
  };
  return map[name] || [
    "Review core definitions and key system architecture algorithms.",
    "Practice multiple choice questions to reinforce concept retention.",
    "Use AI Tutor for targeted explanations on tricky concepts."
  ];
}

export function bindLearnEvents(container, { onSelectTopic, onAskTutor, onPractice }) {
  container.querySelectorAll(".topic-select-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const topicId = e.currentTarget.getAttribute("data-topic-id");
      if (topicId) onSelectTopic(topicId);
    });
  });

  const tutorBtn = container.querySelector("#learn-ask-tutor-btn");
  if (tutorBtn) {
    tutorBtn.addEventListener("click", () => {
      const name = tutorBtn.getAttribute("data-topic-name");
      onAskTutor(name);
    });
  }

  const practiceBtn = container.querySelector("#learn-practice-btn");
  if (practiceBtn) {
    practiceBtn.addEventListener("click", () => {
      const name = practiceBtn.getAttribute("data-topic-name");
      onPractice(name);
    });
  }
}
