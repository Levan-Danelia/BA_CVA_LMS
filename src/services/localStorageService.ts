/**
 * Local Storage Service
 * Fallback persistence when not running in LMS context
 */

const STORAGE_KEY = 'ba-cva-lms-state';
const STORAGE_VERSION = '1.0';

interface StorageWrapper<T> {
  version: string;
  timestamp: number;
  data: T;
}

export const localStorageService = {
  /**
   * Save data to localStorage
   */
  save<T>(data: T): boolean {
    try {
      const wrapper: StorageWrapper<T> = {
        version: STORAGE_VERSION,
        timestamp: Date.now(),
        data,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wrapper));
      return true;
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
      return false;
    }
  },

  /**
   * Load data from localStorage
   */
  load<T>(): T | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const wrapper: StorageWrapper<T> = JSON.parse(raw);

      // Version check for future compatibility
      if (wrapper.version !== STORAGE_VERSION) {
        console.warn('Storage version mismatch, clearing old data');
        this.clear();
        return null;
      }

      return wrapper.data;
    } catch (e) {
      console.warn('Failed to load from localStorage:', e);
      return null;
    }
  },

  /**
   * Check if data exists
   */
  exists(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  },

  /**
   * Get timestamp of last save
   */
  getLastSaveTime(): number | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const wrapper = JSON.parse(raw);
      return wrapper.timestamp || null;
    } catch {
      return null;
    }
  },

  /**
   * Clear stored data
   */
  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  },
};
