/**
 * Realistic Sample Data for StudyOS AI Demo Mode
 * Subject: Operating Systems
 */

export const SAMPLE_SYLLABUS_TEXT = `Unit 1: Introduction
- OS functions
- System calls
- OS structures
- Processes

Unit 2: Process Management
- Process states
- PCB
- Context switching
- Threads

Unit 3: CPU Scheduling
- FCFS
- SJF
- Priority Scheduling
- Round Robin

Unit 4: Synchronization
- Critical section
- Mutex
- Semaphores
- Deadlocks

Unit 5: Memory Management
- Paging
- Segmentation
- Virtual memory
- Page replacement

Unit 6: File Systems
- File allocation
- Directory structure
- Disk scheduling`;

export const DEMO_STATE = {
  isConfigured: true,
  isDemo: true,
  theme: "dark",
  user: {
    name: "Alex",
    goal: "Master Operating Systems for finals",
  },
  subject: {
    name: "Operating Systems",
    examDate: "2026-09-12",
    dailyMinutes: 60,
    syllabus: SAMPLE_SYLLABUS_TEXT,
  },
  streakDays: 7,
  lastStudiedDate: "2026-08-08",
  
  // Topic mastery list (Deadlocks is intentionally lowest at 38%)
  topics: [
    { id: "t1", number: "01", name: "OS Fundamentals", mastery: 88, unit: "Unit 1" },
    { id: "t2", number: "02", name: "Processes", mastery: 91, unit: "Unit 1 & 2" },
    { id: "t3", number: "03", name: "CPU Scheduling", mastery: 79, unit: "Unit 3" },
    { id: "t4", number: "04", name: "Synchronization", mastery: 52, unit: "Unit 4" },
    { id: "t5", number: "05", name: "Deadlocks", mastery: 38, unit: "Unit 4" },
    { id: "t6", number: "06", name: "Memory Management", mastery: 64, unit: "Unit 5" },
    { id: "t7", number: "07", name: "File Systems", mastery: 73, unit: "Unit 6" }
  ],

  // Today's Study Tasks
  todayTasks: [
    { id: "task-1", title: "Review Process States & PCB", duration: 20, topicId: "t2", completed: true, time: "09:00" },
    { id: "task-2", title: "Learn CPU Scheduling Algorithms", duration: 30, topicId: "t3", completed: false, time: "11:30" },
    { id: "task-3", title: "Practice 10 Questions on Synchronization", duration: 15, topicId: "t4", completed: false, time: "18:00" }
  ],

  // Upcoming Days Plan
  upcomingPlan: [
    {
      dayName: "Tomorrow",
      date: "Tuesday, Aug 9",
      focus: "Synchronization & Deadlock Prevention",
      reason: "Adjusted because Deadlocks mastery dropped below 40%",
      tasks: [
        { id: "up-1", title: "Review 4 Necessary Conditions for Deadlock", duration: 20, topicId: "t5" },
        { id: "up-2", title: "Targeted Deadlocks Quiz (10 Questions)", duration: 15, topicId: "t5" },
        { id: "up-3", title: "5-Minute Active Recall Session", duration: 10, topicId: "t5" }
      ]
    },
    {
      dayName: "Wednesday",
      date: "Wednesday, Aug 10",
      focus: "Memory Management - Paging vs Segmentation",
      tasks: [
        { id: "up-4", title: "Paging & Virtual Memory Concepts", duration: 30, topicId: "t6" },
        { id: "up-5", title: "Page Replacement Algorithms Practice", duration: 20, topicId: "t6" }
      ]
    },
    {
      dayName: "Thursday",
      date: "Thursday, Aug 11",
      focus: "File Systems & Disk Scheduling",
      tasks: [
        { id: "up-6", title: "Directory Structures & File Allocation", duration: 25, topicId: "t7" },
        { id: "up-7", title: "SSTF & SCAN Disk Scheduling Problems", duration: 20, topicId: "t7" }
      ]
    }
  ],

  // Adaptive recommendation
  recommendation: {
    topicId: "t5",
    topicName: "Deadlocks",
    currentMastery: 38,
    message: "Your Deadlocks score has fallen twice this week. Spend 20 minutes reviewing the four necessary conditions, then take a 5-question quiz.",
    actionText: "Review Deadlocks →"
  },

  // Recent Quizzes/Exams History
  quizHistory: [
    { id: "q-101", date: "2026-08-07", topic: "CPU Scheduling", score: 80, total: 100, type: "Quiz" },
    { id: "q-102", date: "2026-08-06", topic: "Deadlocks", score: 38, total: 100, type: "Quiz" },
    { id: "q-103", date: "2026-08-05", topic: "Processes", score: 90, total: 100, type: "Quiz" },
    { id: "q-104", date: "2026-08-03", topic: "OS Midterm Simulation", score: 76, total: 100, type: "Exam" }
  ],

  // Flashcards for Quick Review
  flashcards: [
    {
      id: "fc-1",
      topicId: "t5",
      topicName: "Deadlocks",
      question: "What are the four necessary conditions for a deadlock to occur?",
      answer: "1. Mutual Exclusion (non-shareable resources)\n2. Hold and Wait (process holds resources while requesting others)\n3. No Preemption (resources cannot be forcibly taken)\n4. Circular Wait (a closed chain of processes waiting for each other)"
    },
    {
      id: "fc-2",
      topicId: "t2",
      topicName: "Processes",
      question: "What information is typically stored inside a Process Control Block (PCB)?",
      answer: "• Process State (New, Ready, Running, Waiting, Terminated)\n• Process ID (PID)\n• Program Counter (PC)\n• CPU Registers\n• CPU Scheduling Information\n• Memory-management Information\n• Accounting & I/O Status Info"
    },
    {
      id: "fc-3",
      topicId: "t3",
      topicName: "CPU Scheduling",
      question: "What is the primary drawback of First-Come, First-Served (FCFS) scheduling?",
      answer: "The Convoy Effect: Short processes get stuck waiting behind long, CPU-bound processes, resulting in high average waiting times."
    },
    {
      id: "fc-4",
      topicId: "t4",
      topicName: "Synchronization",
      question: "What is the difference between a Mutex and a Counting Semaphore?",
      answer: "• Mutex: A locking mechanism where only the thread that locked it can unlock it (binary flag 0/1).\n• Counting Semaphore: A signaling mechanism initialized with an integer N, allowing up to N concurrent threads to access a shared resource pool."
    },
    {
      id: "fc-5",
      topicId: "t6",
      topicName: "Memory Management",
      question: "What is Thrashing in Virtual Memory systems?",
      answer: "Thrashing occurs when a process spends more time swapping pages in and out of main memory than executing instructions, caused by insufficient allocated page frames."
    }
  ]
};
