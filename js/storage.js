/**
 * LocalStorage abstraction layer for StudyOS AI
 */

const STORAGE_KEY = "studyos_ai_state_v1";

export const Storage = {
  get(fallback = null) {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error("Storage get error:", e);
      return fallback;
    }
  },

  set(value) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (e) {
      console.error("Storage set error:", e);
    }
  },

  remove() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Storage remove error:", e);
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error("Storage clear error:", e);
    }
  }
};
