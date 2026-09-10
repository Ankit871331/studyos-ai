/**
 * StudyOS AI — Main Application Entry Point
 * Vanilla JavaScript Architecture with Modular Components & Reactive State Manager
 */

import { appState } from "./js/state.js";
import { renderLanding, bindLandingEvents } from "./js/components/landing.js";
import { renderOnboarding, bindOnboardingEvents } from "./js/components/onboarding.js";
import { renderDashboard, bindDashboardEvents } from "./js/components/dashboard.js";
import { renderStudyPlan, bindStudyPlanEvents } from "./js/components/studyPlan.js";
import { renderLearn, bindLearnEvents } from "./js/components/learn.js";
import { renderTutor, bindTutorEvents } from "./js/components/tutor.js";
import { renderPractice, bindPracticeEvents } from "./js/components/practice.js";
import { renderExamSetup, renderActiveExam, renderExamResults, bindExamEvents } from "./js/components/exam.js";
import { renderProgress } from "./js/components/progress.js";
import { renderQuickReview, bindQuickReviewEvents } from "./js/components/quickReview.js";
import { renderCommandMenu, bindCommandMenuEvents } from "./js/components/commandMenu.js";
import { renderSettings, bindSettingsEvents } from "./js/components/settings.js";

class AppController {
  constructor() {
    this.currentView = "dashboard";
    this.selectedTopicId = null;
    this.onboardingStep = 1;
    this.onboardingData = {};

    // Quiz & Exam Session State
    this.activeQuizData = null;
    this.quizIndex = 0;
    this.userQuizAnswers = {};

    this.activeExamQuestions = null;
    this.examIndex = 0;
    this.examAnswers = {};
    this.examTimer = 1800;
    this.examTimerInterval = null;
    this.examResults = null;

    // Flashcard Session State
    this.flashcardIndex = 0;
    this.flashcardRevealed = false;

    // Tutor Session State
    this.tutorMessages = [];

    // Command Menu State
    this.cmdMenuOpen = false;
    this.cmdQuery = "";

    // Check initial configuration state
    const state = appState.get();
    if (!state.isConfigured) {
      this.currentView = "landing";
    }

    // Subscribe to state changes
    appState.subscribe(() => this.render());

    // Register Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.toggleCommandMenu();
      }
    });

    this.render();
  }

  toggleCommandMenu(open = !this.cmdMenuOpen) {
    this.cmdMenuOpen = open;
    this.renderCommandMenuOverlay();
  }

  renderCommandMenuOverlay() {
    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer) return;

    modalContainer.innerHTML = renderCommandMenu(this.cmdMenuOpen, this.cmdQuery);

    if (this.cmdMenuOpen) {
      bindCommandMenuEvents(
        modalContainer,
        (actionId) => this.handleCommandAction(actionId),
        () => this.toggleCommandMenu(false)
      );
    }
  }

  handleCommandAction(actionId) {
    if (actionId === "cmd-dashboard") this.currentView = "dashboard";
    if (actionId === "cmd-plan") this.currentView = "plan";
    if (actionId === "cmd-weak") { this.currentView = "learn"; this.selectedTopicId = "t5"; }
    if (actionId === "cmd-tutor") this.currentView = "tutor";
    if (actionId === "cmd-practice") this.currentView = "practice";
    if (actionId === "cmd-exam") this.currentView = "exam";
    if (actionId === "cmd-flashcards") this.currentView = "quickReview";
    if (actionId === "cmd-theme") appState.toggleTheme();
    if (actionId === "cmd-demo") appState.resetToDemo();

    this.render();
  }

  render() {
    const appEl = document.getElementById("app");
    if (!appEl) return;

    const state = appState.get();

    // Render full-screen landing or onboarding views
    if (this.currentView === "landing") {
      appEl.innerHTML = `<div class="content-viewport">${renderLanding({})}</div>`;
      bindLandingEvents(appEl, {
        onBuildPlan: () => {
          this.currentView = "onboarding";
          this.onboardingStep = 1;
          this.render();
        },
        onTryDemo: () => {
          appState.resetToDemo();
          this.currentView = "dashboard";
          this.render();
        }
      });
      return;
    }

    if (this.currentView === "onboarding") {
      appEl.innerHTML = `<div class="content-viewport">${renderOnboarding(this.onboardingStep, this.onboardingData)}</div>`;
      bindOnboardingEvents(
        appEl,
        this.onboardingStep,
        this.onboardingData,
        (nextStep, data) => {
          this.onboardingStep = nextStep;
          this.onboardingData = data;
          this.render();
        },
        (data, aiResult) => {
          appState.setupNewSubject({
            subject: data.subject,
            examDate: data.examDate,
            dailyMinutes: data.dailyMinutes,
            syllabus: data.syllabus,
            topics: aiResult?.topics
          });
          this.currentView = "dashboard";
          this.render();
        }
      );
      return;
    }

    // Render App Shell with Sidebar & Topbar
    appEl.innerHTML = `
      <div class="app-container">
        <!-- Sidebar -->
        <aside class="sidebar">
          <div class="sidebar-header">
            <div class="logo">
              <span>StudyOS</span>
              <span class="logo-badge">AI</span>
            </div>
          </div>

          <nav class="sidebar-nav">
            <div>
              <div class="nav-group-title">Main</div>
              <ul class="nav-list">
                <li class="nav-item">
                  <button class="${this.currentView === 'dashboard' ? 'active' : ''}" data-view="dashboard">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                    Overview
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div class="nav-group-title">Study</div>
              <ul class="nav-list">
                <li class="nav-item">
                  <button class="${this.currentView === 'plan' ? 'active' : ''}" data-view="plan">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    Study Plan
                  </button>
                </li>
                <li class="nav-item">
                  <button class="${this.currentView === 'learn' ? 'active' : ''}" data-view="learn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                    Learn
                  </button>
                </li>
                <li class="nav-item">
                  <button class="${this.currentView === 'practice' ? 'active' : ''}" data-view="practice">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    Practice
                  </button>
                </li>
                <li class="nav-item">
                  <button class="${this.currentView === 'quickReview' ? 'active' : ''}" data-view="quickReview">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 8h10M7 12h7"/></svg>
                    Quick Review
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div class="nav-group-title">Assess</div>
              <ul class="nav-list">
                <li class="nav-item">
                  <button class="${this.currentView === 'tutor' ? 'active' : ''}" data-view="tutor">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                    AI Tutor
                  </button>
                </li>
                <li class="nav-item">
                  <button class="${this.currentView === 'exam' ? 'active' : ''}" data-view="exam">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                    Exams
                  </button>
                </li>
                <li class="nav-item">
                  <button class="${this.currentView === 'progress' ? 'active' : ''}" data-view="progress">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                    Progress
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div class="nav-group-title">System</div>
              <ul class="nav-list">
                <li class="nav-item">
                  <button class="${this.currentView === 'settings' ? 'active' : ''}" data-view="settings">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                    Settings
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          <div class="sidebar-footer">
            <button class="btn btn-outline btn-sm" id="sidebar-theme-toggle" style="width: 100%;">
              ${state.theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
          <header class="top-bar">
            <div class="page-title-area">
              <h1>${this.getViewTitle(this.currentView)}</h1>
              <p>${state.subject?.name || 'Operating Systems'}</p>
            </div>

            <div class="top-controls">
              <button class="search-trigger" id="top-search-trigger">
                <span>Search / Jump...</span>
                <span class="kbd">⌘K</span>
              </button>
            </div>
          </header>

          <div class="content-viewport" id="viewport-box">
            ${this.renderViewportContent(state)}
          </div>
        </main>

        <!-- Mobile Bottom Nav -->
        <nav class="mobile-bottom-nav">
          <button class="${this.currentView === 'dashboard' ? 'active' : ''}" data-view="dashboard">Overview</button>
          <button class="${this.currentView === 'plan' ? 'active' : ''}" data-view="plan">Plan</button>
          <button class="${this.currentView === 'learn' ? 'active' : ''}" data-view="learn">Learn</button>
          <button class="${this.currentView === 'tutor' ? 'active' : ''}" data-view="tutor">Tutor</button>
          <button class="${this.currentView === 'exam' ? 'active' : ''}" data-view="exam">Exams</button>
        </nav>
      </div>
    `;

    this.bindGlobalEvents(appEl);
  }

  getViewTitle(view) {
    const titles = {
      dashboard: "Overview Dashboard",
      plan: "Adaptive Study Plan",
      learn: "Learn & Understand",
      practice: "Practice & Quiz Generator",
      tutor: "AI Tutor Workspace",
      exam: "AI Exam Simulator",
      progress: "Analytics & Progress",
      quickReview: "Quick Review Flashcards",
      settings: "System Settings"
    };
    return titles[view] || "StudyOS AI";
  }

  renderViewportContent(state) {
    const daysLeft = appState.getDaysUntilExam();
    const overallMastery = appState.getOverallMastery();

    if (this.currentView === "dashboard") {
      return renderDashboard(state, { daysLeft, overallMastery });
    }

    if (this.currentView === "plan") {
      return renderStudyPlan(state);
    }

    if (this.currentView === "learn") {
      return renderLearn(state, this.selectedTopicId);
    }

    if (this.currentView === "practice") {
      return renderPractice(state, this.activeQuizData, this.quizIndex, this.userQuizAnswers);
    }

    if (this.currentView === "tutor") {
      const topicObj = (state.topics || []).find(t => t.id === this.selectedTopicId) || state.topics[0];
      return renderTutor(state, topicObj?.name || "Deadlocks", this.tutorMessages);
    }

    if (this.currentView === "exam") {
      if (this.examResults) {
        return renderExamResults(this.examResults);
      }
      if (this.activeExamQuestions) {
        return renderActiveExam(this.activeExamQuestions, this.examIndex, this.examTimer, this.examAnswers);
      }
      return renderExamSetup(state);
    }

    if (this.currentView === "progress") {
      return renderProgress(state, overallMastery);
    }

    if (this.currentView === "quickReview") {
      return renderQuickReview(state, this.flashcardIndex, this.flashcardRevealed);
    }

    if (this.currentView === "settings") {
      return renderSettings(state);
    }

    return renderDashboard(state, { daysLeft, overallMastery });
  }

  bindGlobalEvents(container) {
    const state = appState.get();

    // Sidebar & Mobile Nav Clicks
    container.querySelectorAll("button[data-view]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const v = e.currentTarget.getAttribute("data-view");
        if (v) {
          this.currentView = v;
          this.render();
        }
      });
    });

    // Theme Toggle
    const themeBtn = container.querySelector("#sidebar-theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => appState.toggleTheme());
    }

    // Top Search Trigger
    const searchBtn = container.querySelector("#top-search-trigger");
    if (searchBtn) {
      searchBtn.addEventListener("click", () => this.toggleCommandMenu(true));
    }

    // Viewport-specific bindings
    const viewportBox = container.querySelector("#viewport-box");
    if (!viewportBox) return;

    if (this.currentView === "dashboard") {
      bindDashboardEvents(viewportBox, {
        onToggleTask: (taskId) => appState.toggleTask(taskId),
        onNavigateToTopic: (topicId) => {
          this.selectedTopicId = topicId;
          this.currentView = "learn";
          this.render();
        },
        onNavigateToPractice: () => {
          this.currentView = "practice";
          this.render();
        }
      });
    }

    if (this.currentView === "plan") {
      bindStudyPlanEvents(viewportBox, {
        onToggleTask: (taskId) => appState.toggleTask(taskId),
        onAddTask: (task) => appState.addTask(task)
      });
    }

    if (this.currentView === "learn") {
      bindLearnEvents(viewportBox, {
        onSelectTopic: (topicId) => {
          this.selectedTopicId = topicId;
          this.render();
        },
        onAskTutor: (topicName) => {
          this.currentView = "tutor";
          this.tutorMessages = [];
          this.render();
        },
        onPractice: (topicName) => {
          this.currentView = "practice";
          this.render();
        }
      });
    }

    if (this.currentView === "tutor") {
      const topicObj = (state.topics || []).find(t => t.id === this.selectedTopicId) || state.topics[0];
      bindTutorEvents(viewportBox, topicObj?.name || "Deadlocks", this.tutorMessages, (name, msgs) => {
        this.tutorMessages = msgs;
      });
    }

    if (this.currentView === "practice") {
      bindPracticeEvents(viewportBox, state, {
        onStartQuiz: (topicName, questions) => {
          this.activeQuizData = questions;
          this.quizIndex = 0;
          this.userQuizAnswers = {};
          this.render();
        },
        onAnswerQuestion: (optIdx, action) => {
          if (optIdx !== null) {
            this.userQuizAnswers[this.quizIndex] = optIdx;
          }
          if (action === "next") {
            if (this.quizIndex < this.activeQuizData.length - 1) {
              this.quizIndex++;
            } else {
              // Quiz Finished
              let score = 0;
              this.activeQuizData.forEach((q, i) => {
                if (this.userQuizAnswers[i] === q.correctIndex) score++;
              });
              const percentage = Math.round((score / this.activeQuizData.length) * 100);
              alert(`Quiz Completed! Score: ${score}/${this.activeQuizData.length} (${percentage}%)`);
              
              // Update topic mastery
              const topicObj = state.topics.find(t => t.name === this.activeQuizData[0]?.topicName) || state.topics[4];
              appState.updateTopicMastery(topicObj.id, percentage > 60 ? 10 : -8);

              this.activeQuizData = null;
              this.currentView = "dashboard";
            }
          }
          if (action === "prev" && this.quizIndex > 0) {
            this.quizIndex--;
          }
          this.render();
        },
        onFinishQuiz: () => {
          this.activeQuizData = null;
          this.render();
        }
      });
    }

    if (this.currentView === "exam") {
      bindExamEvents(viewportBox, {
        onStartExam: (questions) => {
          this.activeExamQuestions = questions;
          this.examIndex = 0;
          this.examAnswers = {};
          this.examResults = null;
          this.examTimer = 1800; // 30 minutes

          if (this.examTimerInterval) clearInterval(this.examTimerInterval);
          this.examTimerInterval = setInterval(() => {
            if (this.examTimer > 0) {
              this.examTimer--;
              const timerEl = viewportBox.querySelector(".quiz-container div[style*='monospace']");
              if (timerEl) {
                const mins = Math.floor(this.examTimer / 60);
                const secs = String(this.examTimer % 60).padStart(2, "0");
                timerEl.textContent = `⏱ ${mins}:${secs} remaining`;
              }
            } else {
              clearInterval(this.examTimerInterval);
              this.finishExamSession();
            }
          }, 1000);

          this.render();
        },
        onAnswerExam: (optIdx, action) => {
          if (optIdx !== null) {
            this.examAnswers[this.examIndex] = optIdx;
          }
          if (action === "next") {
            if (this.examIndex < this.activeExamQuestions.length - 1) {
              this.examIndex++;
            } else {
              this.finishExamSession();
              return;
            }
          }
          if (action === "prev" && this.examIndex > 0) {
            this.examIndex--;
          }
          this.render();
        },
        onDoneExam: () => {
          this.activeExamQuestions = null;
          this.examResults = null;
          this.currentView = "dashboard";
          this.render();
        }
      });
    }

    if (this.currentView === "quickReview") {
      bindQuickReviewEvents(
        viewportBox,
        this.flashcardIndex,
        this.flashcardRevealed,
        () => {
          this.flashcardRevealed = true;
          this.render();
        },
        (isCorrect) => {
          const cards = state.flashcards || [];
          const currentCard = cards[this.flashcardIndex % cards.length];
          if (currentCard) {
            appState.updateTopicMastery(currentCard.topicId, isCorrect ? 5 : -5);
          }
          this.flashcardIndex++;
          this.flashcardRevealed = false;
          this.render();
        }
      );
    }

    if (this.currentView === "settings") {
      bindSettingsEvents(viewportBox, {
        onToggleTheme: () => appState.toggleTheme(),
        onSaveSettings: (newSub) => {
          appState.setState(s => ({
            ...s,
            subject: { ...s.subject, ...newSub }
          }));
        },
        onResetDemo: () => {
          appState.resetToDemo();

        //changed-ankit i changed dashboad to landing
          this.currentView = "landing";   
          this.render();
        }
      });
    }
  }

  finishExamSession() {
    if (this.examTimerInterval) clearInterval(this.examTimerInterval);

    let score = 0;
    const missedTopics = [];
    const total = this.activeExamQuestions.length;

    this.activeExamQuestions.forEach((q, i) => {
      if (this.examAnswers[i] === q.correctIndex) {
        score++;
      } else {
        missedTopics.push("Deadlocks");
      }
    });

    const finalPercent = Math.round((score / total) * 100);

    // Apply exam results to state & trigger adaptive plan adjustment
    appState.applyExamResults(score, total, ["t5"]);

    this.examResults = {
      score: finalPercent,
      total: 100,
      summary: finalPercent >= 80 ? "Excellent exam performance!" : "Good progress! Targeted review recommended on Deadlocks.",
      strongestTopic: "CPU Scheduling (91%)",
      needsAttentionTopic: "Deadlocks (38%)",
      adaptivePlanAdjustment: {
        reason: "We adjusted tomorrow's plan because you missed questions on Deadlocks conditions.",
        addedTasks: [
          { title: "20 min — Review 4 Necessary Conditions for Deadlock", duration: 20 },
          { title: "10 min — Targeted Deadlocks Practice Questions", duration: 10 }
        ]
      }
    };

    this.activeExamQuestions = null;
    this.render();
  }
}

// Initialize Application on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  new AppController();
});
