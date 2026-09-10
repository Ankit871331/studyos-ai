/**
 * Central State Manager for StudyOS AI
 * Manages reactive application state and LocalStorage sync.
 */

import { Storage } from "./storage.js";
import { DEMO_STATE } from "./sampleData.js";

class StateManager {
  constructor() {
    this.listeners = new Set();
    
    // Load persisted state or default to Demo
    const saved = Storage.get();
    if (saved && saved.isConfigured) {
      this.state = saved;
    } else {
      this.state = JSON.parse(JSON.stringify(DEMO_STATE));
      Storage.set(this.state);
    }

    // Apply dark/light class on boot
    this.applyTheme(this.state.theme || "dark");
  }

  get() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    Storage.set(this.state);
    this.listeners.forEach(fn => fn(this.state));
  }

  setState(updater) {
    if (typeof updater === "function") {
      this.state = updater(this.state);
    } else {
      this.state = { ...this.state, ...updater };
    }
    this.notify();
  }

  // Theme switcher
  toggleTheme() {
    const nextTheme = this.state.theme === "light" ? "dark" : "light";
    this.state.theme = nextTheme;
    this.applyTheme(nextTheme);
    this.notify();
  }

  applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.classList.add("theme-light");
      document.documentElement.classList.remove("theme-dark");
    } else {
      document.documentElement.classList.add("theme-dark");
      document.documentElement.classList.remove("theme-light");
    }
  }

  // Task actions
  toggleTask(taskId) {
    const task = this.state.todayTasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.notify();
    }
  }

  addTask(task) {
    this.state.todayTasks.push({
      id: "task-" + Date.now(),
      completed: false,
      ...task
    });
    this.notify();
  }

  // Topic mastery actions
  updateTopicMastery(topicId, deltaOrNewValue) {
    const topic = this.state.topics.find(t => t.id === topicId);
    if (topic) {
      if (typeof deltaOrNewValue === "number" && deltaOrNewValue <= 100 && deltaOrNewValue >= 0 && Math.abs(deltaOrNewValue - topic.mastery) > 15) {
        topic.mastery = Math.min(100, Math.max(0, Math.round(deltaOrNewValue)));
      } else {
        topic.mastery = Math.min(100, Math.max(0, topic.mastery + deltaOrNewValue));
      }

      // Re-eval weakest topic for recommendation
      this.recalculateRecommendation();
      this.notify();
    }
  }

  recalculateRecommendation() {
    if (!this.state.topics || this.state.topics.length === 0) return;

    // Find topic with lowest mastery
    const sorted = [...this.state.topics].sort((a, b) => a.mastery - b.mastery);
    const weakest = sorted[0];

    if (weakest) {
      this.state.recommendation = {
        topicId: weakest.id,
        topicName: weakest.name,
        currentMastery: weakest.mastery,
        message: `Your ${weakest.name} score is currently at ${weakest.mastery}%. Spend 20 minutes reviewing core concepts and take a 5-question quiz.`,
        actionText: `Review ${weakest.name} →`
      };
    }
  }

  // Apply exam results and trigger adaptive plan adjustment
  applyExamResults(score, total, missedTopicIds = []) {
    const percentage = Math.round((score / total) * 100);

    // Save history entry
    const entry = {
      id: "q-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      topic: `${this.state.subject.name} Exam Simulator`,
      score: percentage,
      total: 100,
      type: "Exam"
    };

    this.state.quizHistory.unshift(entry);

    // Decrease mastery for missed topics, increase for others
    this.state.topics.forEach(topic => {
      if (missedTopicIds.includes(topic.id)) {
        topic.mastery = Math.max(10, topic.mastery - 12);
      } else {
        topic.mastery = Math.min(100, topic.mastery + 4);
      }
    });

    // Add adaptive tasks to tomorrow's plan if performance was below 80%
    if (percentage < 80 && missedTopicIds.length > 0) {
      const missedTopicObj = this.state.topics.find(t => t.id === missedTopicIds[0]) || this.state.topics[0];
      
      this.state.upcomingPlan = [
        {
          dayName: "Tomorrow (Adaptive Adjustment)",
          date: "Tomorrow",
          focus: `Targeted Intervention: ${missedTopicObj.name}`,
          reason: `We adjusted tomorrow's plan because your exam score was ${percentage}% with mistakes in ${missedTopicObj.name}.`,
          tasks: [
            { id: "adp-1", title: `Review ${missedTopicObj.name} Core Concepts`, duration: 20, topicId: missedTopicObj.id },
            { id: "adp-2", title: `10 Targeted Questions on ${missedTopicObj.name}`, duration: 15, topicId: missedTopicObj.id },
            { id: "adp-3", title: "5-Minute Flashcard Recall", duration: 5, topicId: missedTopicObj.id }
          ]
        },
        ...this.state.upcomingPlan.slice(0, 2)
      ];
    }

    this.recalculateRecommendation();
    this.notify();
  }

  // Onboarding setup
  setupNewSubject({ subject, examDate, dailyMinutes, syllabus, topics }) {
    this.state.isConfigured = true;
    this.state.isDemo = false;
    this.state.subject = {
      name: subject,
      examDate: examDate,
      dailyMinutes: parseInt(dailyMinutes, 10) || 60,
      syllabus: syllabus
    };

    if (topics && topics.length) {
      this.state.topics = topics;
    } else {
      // Basic auto-parser for syllabus units if topics not provided
      const lines = syllabus.split("\n").filter(l => l.trim().length > 0);
      const extracted = [];
      let count = 1;
      lines.forEach(l => {
        if (l.toLowerCase().includes("unit") || l.toLowerCase().includes("chapter") || l.includes(":")) {
          extracted.push({
            id: "t-" + count,
            number: String(count).padStart(2, "0"),
            name: l.replace(/unit \d+:?/i, "").replace(/-/g, "").trim(),
            mastery: 50,
            unit: `Unit ${count}`
          });
          count++;
        }
      });

      //changed ankit , i chnaged 3 --> 1 (it check at least units);
      
      if (extracted.length >= 1) {
        this.state.topics = extracted;
      }
    }

    this.recalculateRecommendation();
    this.notify();
  }

  // Reset to Demo Mode
  resetToDemo() {
    this.state = JSON.parse(JSON.stringify(DEMO_STATE));
    this.notify();
  }

  // Calculate overall average mastery
  getOverallMastery() {
    if (!this.state.topics || this.state.topics.length === 0) return 0;
    const sum = this.state.topics.reduce((acc, t) => acc + t.mastery, 0);
    return Math.round(sum / this.state.topics.length);
  }

  // Days left countdown
  getDaysUntilExam() {
    if (!this.state.subject || !this.state.subject.examDate) return 30;
    const target = new Date(this.state.subject.examDate);
    const today = new Date();
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }
}

export const appState = new StateManager();
