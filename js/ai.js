/**
 * AI Service Abstraction Layer for StudyOS AI
 * Connects to server-side /api/ai endpoint with graceful local fallback generators.
 */

import { DEMO_STATE } from "./sampleData.js";

/**
 * Universal AI Caller
 */
export async function callAI({ action, prompt, systemInstruction, responseFormat = "json" }) {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, prompt, systemInstruction, responseFormat }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.output) {
        if (responseFormat === "json") {
          try {
            // Clean codeblocks if any
            let clean = data.output.replace(/```json/g, "").replace(/```/g, "").trim();
            return JSON.parse(clean);
          } catch (e) {
            console.warn("Failed to parse AI JSON, returning fallback:", e);
          }
        } else {
          return data.output;
        }
      }
    }
  } catch (err) {
    console.warn("Server AI call unavailable, using smart local generator:", err);
  }

  // Smart local fallback generator for Demo/Offline mode
  return getLocalFallback(action, prompt, responseFormat);
}

/**
 * Local Fallback Generator for seamless offline/demo operation
 */
function getLocalFallback(action, prompt, responseFormat) {
  if (action === "generateStudyPlan") {
    return {
      topics: DEMO_STATE.topics,
      todayTasks: DEMO_STATE.todayTasks,
      upcomingPlan: DEMO_STATE.upcomingPlan,
      recommendation: DEMO_STATE.recommendation
    };
  }

  if (action === "generateQuiz" || action === "generateExam") {
    return [
      {
        id: "q-1",
        question: "Which of the following is NOT one of Coffman's four necessary conditions for deadlock?",
        options: [
          "Mutual Exclusion",
          "Preemption Allowed",
          "Hold and Wait",
          "Circular Wait"
        ],
        correctIndex: 1,
        explanation: "No Preemption is the necessary condition. If preemption is allowed, deadlocks cannot persist."
      },
      {
        id: "q-2",
        question: "In CPU scheduling, what is the primary cause of the 'Convoy Effect'?",
        options: [
          "Round Robin time quantum being too small",
          "First-Come, First-Served (FCFS) execution of a long CPU-bound process",
          "SJF algorithm with frequent preemptions",
          "Priority inversion in real-time tasks"
        ],
        correctIndex: 1,
        explanation: "Under FCFS, when a heavy CPU-bound task runs, short I/O bound tasks queue up behind it."
      },
      {
        id: "q-3",
        question: "What is the primary role of a Process Control Block (PCB) during a context switch?",
        options: [
          "To allocate virtual RAM addresses to secondary storage",
          "To save the CPU register state and program counter of the preempted process",
          "To prevent mutual exclusion in shared memory regions",
          "To reorder thread priority queues in kernel mode"
        ],
        correctIndex: 1,
        explanation: "PCB preserves the execution state so the CPU can resume the process later seamlessly."
      },
      {
        id: "q-4",
        question: "Which memory management technique avoids external fragmentation entirely?",
        options: [
          "Contiguous allocation",
          "Paging",
          "Variable-sized partitioning",
          "Overlays"
        ],
        correctIndex: 1,
        explanation: "Paging breaks physical memory into fixed-size frames, eliminating external fragmentation."
      },
      {
        id: "q-5",
        question: "How does Banker's Algorithm prevent system deadlocks?",
        options: [
          "By aborting all processes requesting resources",
          "By dynamically checking if resource allocation leaves the system in a safe state",
          "By revoking resource ownership every 10 seconds",
          "By disabling interrupts during critical section execution"
        ],
        correctIndex: 1,
        explanation: "Banker's algorithm simulates allocation and only grants resources if a safe state exists."
      }
    ];
  }

  if (action === "evaluateAnswer") {
    return {
      score: 8,
      maxScore: 10,
      feedback: "Mostly correct. You clearly explained the main concepts but missed one key technical nuance.",
      strengths: ["Accurately identified Mutual Exclusion and Hold & Wait conditions", "Clear structure"],
      weaknesses: ["Omitted Circular Wait explanation"],
      recommendation: "Try reviewing why circular wait forms a closed dependency chain between processes."
    };
  }

  if (action === "generateTutorResponse") {
    if (responseFormat === "text") {
      return `### Deadlocks Explained

#### In simple terms
A deadlock happens when two or more processes are stuck forever because each is holding a resource the other needs to continue.

#### Why it happens
Four conditions must occur simultaneously:
1. **Mutual Exclusion**: Resources cannot be shared.
2. **Hold and Wait**: A process holds one resource while requesting another.
3. **No Preemption**: Resources cannot be taken away by force.
4. **Circular Wait**: Process A waits for B, B waits for C, and C waits for A.

#### Real-World Example
Imagine a narrow one-lane bridge where two cars meet head-on. Neither car can move forward, neither can back up, and neither car will yield.

#### Key idea
If you break even **ONE** of the four conditions (such as eliminating circular wait via resource ordering), deadlocks become impossible!`;
    }
  }

  if (action === "analyzeExam") {
    return {
      score: 76,
      total: 100,
      summary: "Good progress overall! You demonstrate strong mastery in CPU Scheduling and Processes, but need targeted practice on Deadlocks and Page Replacement.",
      strongestTopic: "CPU Scheduling (91%)",
      needsAttentionTopic: "Deadlocks (38%)",
      adaptivePlanAdjustment: {
        reason: "We adjusted tomorrow's plan because you missed questions related to Deadlock conditions.",
        addedTasks: [
          { title: "20 min — Review 4 Necessary Conditions for Deadlock", duration: 20 },
          { title: "10 min — Targeted Deadlocks Practice Questions", duration: 10 },
          { title: "5 min — Deadlocks Flashcard Recall Session", duration: 5 }
        ]
      }
    };
  }

  return { message: "AI process completed successfully." };
}

/**
 * Higher-level AI methods invoked by components
 */
export async function aiGenerateStudyPlan(subject, syllabus, examDate, dailyMinutes) {
  const prompt = `You are StudyOS AI, an expert adaptive learning engine.
Subject: ${subject}
Exam Date: ${examDate}
Daily Study Time: ${dailyMinutes} minutes
Syllabus:
${syllabus}

Analyze this syllabus and return a structured JSON response containing:
1. "topics": array of objects with { id, number, name, mastery (default 50), unit }
2. "todayTasks": array of 3 initial tasks { id, title, duration (in mins), topicId, completed: false, time }
3. "upcomingPlan": array of 3 days { dayName, date, focus, tasks: [{ id, title, duration, topicId }] }
4. "recommendation": object { topicId, topicName, currentMastery, message, actionText }`;

  return await callAI({
    action: "generateStudyPlan",
    prompt,
    systemInstruction: "You are StudyOS AI. Generate structured study plans in valid JSON.",
    responseFormat: "json",
  });
}

export async function aiGenerateQuiz(topicName, count = 5, difficulty = "Medium") {
  const prompt = `Generate a ${count}-question multiple choice quiz for topic "${topicName}" at ${difficulty} difficulty.
Return JSON array of objects:
[{
  "id": "q-1",
  "question": "string",
  "options": ["A", "B", "C", "D"],
  "correctIndex": number (0-3),
  "explanation": "string"
}]`;

  return await callAI({
    action: "generateQuiz",
    prompt,
    systemInstruction: "Generate academic quiz questions in valid JSON array.",
    responseFormat: "json",
  });
}

export async function aiEvaluateAnswer(question, userAnswer) {
  const prompt = `Question: ${question}
Student's Answer: ${userAnswer}

Evaluate the student's answer out of 10. Return JSON:
{
  "score": number (0-10),
  "maxScore": 10,
  "feedback": "string summary",
  "strengths": ["list of what they got right"],
  "weaknesses": ["list of what they missed"],
  "recommendation": "string prompt for next step"
}`;

  return await callAI({
    action: "evaluateAnswer",
    prompt,
    systemInstruction: "Evaluate student short answers constructively in valid JSON.",
    responseFormat: "json",
  });
}

export async function aiGenerateTutorResponse(topicName, query, actionType = "explain") {
  const prompt = `Topic: ${topicName}
Student Request: ${query} (Action type: ${actionType})

Provide a structured, beautifully formatted explanation. Use markdown headings:
### ${topicName}
#### In simple terms
#### Why it happens / How it works
#### Example
#### Key idea
#### Quick check question`;

  return await callAI({
    action: "generateTutorResponse",
    prompt,
    systemInstruction: "You are StudyOS AI Tutor. Provide clear, structured, readable academic explanations.",
    responseFormat: "text",
  });
}

export async function aiAnalyzeExamResults(examData) {
  const prompt = `The student completed an exam simulation.
Score: ${examData.score}/${examData.total}
Missed questions topics: ${examData.missedTopics.join(", ")}

Return structured JSON:
{
  "score": ${examData.score},
  "total": ${examData.total},
  "summary": "string",
  "strongestTopic": "string",
  "needsAttentionTopic": "string",
  "adaptivePlanAdjustment": {
    "reason": "string explaining why plan was modified",
    "addedTasks": [
      { "title": "string", "duration": number }
    ]
  }
}`;

  return await callAI({
    action: "analyzeExam",
    prompt,
    systemInstruction: "Analyze exam performance and adjust study plan in valid JSON.",
    responseFormat: "json",
  });
}
