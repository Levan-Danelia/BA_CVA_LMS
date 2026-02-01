/**
 * SCORM 2004 4th Edition API Service
 * Handles all communication with the LMS
 */

export type LessonStatus =
  | 'not attempted'
  | 'incomplete'
  | 'completed'
  | 'passed'
  | 'failed';

export type CompletionStatus = 'completed' | 'incomplete' | 'not attempted' | 'unknown';
export type SuccessStatus = 'passed' | 'failed' | 'unknown';
export type ExitType = 'timeout' | 'suspend' | 'logout' | 'normal' | '';

export interface SCORMData {
  learnerId: string;
  learnerName: string;
  lessonStatus: LessonStatus;
  lessonLocation: string;
  suspendData: string;
  scoreRaw: number | null;
  scoreMin: number;
  scoreMax: number;
  scoreScaled: number | null;
  progressMeasure: number;
  sessionTime: string;
  totalTime: string;
}

class SCORMAPIService {
  private API: any = null;
  private initialized: boolean = false;
  private startTime: number = 0;
  private findAttempts: number = 0;
  private maxAttempts: number = 500;
  private debugMode: boolean = true; // Enable debug mode for SCORM Cloud testing

  /**
   * Find the SCORM API in the window hierarchy
   * SCORM 2004 uses API_1484_11
   */
  private findAPI(win: Window): any {
    this.findAttempts = 0;

    try {
      // Check current window first
      if (win.API_1484_11) {
        this.log('Found API_1484_11 in current window');
        return win.API_1484_11;
      }

      // Search up through parent windows
      while (win.parent && win.parent !== win && this.findAttempts < this.maxAttempts) {
        this.findAttempts++;
        try {
          win = win.parent;
          if (win.API_1484_11) {
            this.log(`Found API_1484_11 in parent window (attempt ${this.findAttempts})`);
            return win.API_1484_11;
          }
        } catch (e) {
          // Cross-origin access denied - this is expected in some LMS setups
          this.log(`Cross-origin access denied at attempt ${this.findAttempts}`);
          break;
        }
      }
    } catch (e) {
      this.log('Error finding SCORM API: ' + (e as Error).message);
    }

    return null;
  }

  /**
   * Initialize connection to LMS
   */
  initialize(): boolean {
    if (this.initialized) {
      this.log('SCORM API already initialized');
      return true;
    }

    // Try to find API in current window
    this.API = this.findAPI(window);

    // Try opener window if not found
    if (!this.API && window.opener) {
      this.API = this.findAPI(window.opener);
    }

    if (!this.API) {
      this.log('SCORM API not found - running in standalone mode');
      return false;
    }

    const result = this.API.Initialize('');
    if (result === 'true' || result === true) {
      this.initialized = true;
      this.startTime = Date.now();

      // Set initial status if not attempted
      const currentStatus = this.getValue('cmi.completion_status');
      if (currentStatus === 'not attempted' || currentStatus === 'unknown' || !currentStatus) {
        this.setValue('cmi.completion_status', 'incomplete');
        this.commit();
      }

      this.log('SCORM API initialized successfully');
      return true;
    }

    this.log('SCORM initialization failed: ' + this.getLastError());
    return false;
  }

  /**
   * Check if running in LMS context
   */
  isAvailable(): boolean {
    return this.initialized && this.API !== null;
  }

  /**
   * Get a value from the LMS
   */
  getValue(element: string): string {
    if (!this.isAvailable()) return '';

    const value = this.API.GetValue(element);
    const error = this.API.GetLastError();

    if (error !== '0' && error !== 0) {
      this.log(`SCORM GetValue error for ${element}: ${this.getErrorString(String(error))}`);
    } else {
      this.log(`SCORM GetValue: ${element} = ${value}`);
    }

    return value || '';
  }

  /**
   * Set a value in the LMS
   */
  setValue(element: string, value: string | number): boolean {
    if (!this.isAvailable()) return false;

    this.log(`SCORM SetValue: ${element} = ${value}`);

    const result = this.API.SetValue(element, String(value));
    const error = this.API.GetLastError();

    if (error !== '0' && error !== 0) {
      this.log(`SCORM SetValue error for ${element}: ${this.getErrorString(String(error))}`);
      return false;
    }

    return result === 'true' || result === true;
  }

  /**
   * Commit data to LMS
   */
  commit(): boolean {
    if (!this.isAvailable()) return false;

    this.log('SCORM Commit');
    const result = this.API.Commit('');
    return result === 'true' || result === true;
  }

  /**
   * Terminate the SCORM session
   */
  terminate(exitType: ExitType = 'suspend'): boolean {
    if (!this.isAvailable()) return false;

    this.log(`SCORM Terminate with exit type: ${exitType}`);

    // Set session time before terminating
    this.setSessionTime();

    // Set exit type
    if (exitType) {
      this.setValue('cmi.exit', exitType);
    }

    // Commit final data
    this.commit();

    // Terminate
    const result = this.API.Terminate('');
    this.initialized = false;

    return result === 'true' || result === true;
  }

  /**
   * Get last error code
   */
  getLastError(): string {
    if (!this.API) return '0';
    return this.API.GetLastError();
  }

  /**
   * Get error description
   */
  getErrorString(errorCode: string): string {
    if (!this.API) return '';
    return this.API.GetErrorString(errorCode);
  }

  /**
   * Calculate and set session time in ISO 8601 duration format
   */
  private setSessionTime(): void {
    const sessionMs = Date.now() - this.startTime;
    const sessionTime = this.msToISO8601Duration(sessionMs);
    this.setValue('cmi.session_time', sessionTime);
  }

  /**
   * Convert milliseconds to ISO 8601 duration format (PT#H#M#S)
   */
  private msToISO8601Duration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `PT${hours}H${minutes}M${seconds}S`;
  }

  /**
   * Logging helper
   */
  private log(message: string): void {
    if (this.debugMode) {
      console.log(`[SCORM] ${message}`);
    }
  }

  /**
   * Enable or disable debug mode
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  // ============================================
  // HIGH-LEVEL CONVENIENCE METHODS
  // ============================================

  /**
   * Get learner information
   */
  getLearnerInfo(): { id: string; name: string } {
    return {
      id: this.getValue('cmi.learner_id'),
      name: this.getValue('cmi.learner_name'),
    };
  }

  /**
   * Set lesson completion status
   */
  setCompletionStatus(status: CompletionStatus): boolean {
    return this.setValue('cmi.completion_status', status);
  }

  /**
   * Get completion status
   */
  getCompletionStatus(): CompletionStatus {
    const status = this.getValue('cmi.completion_status');
    return (status as CompletionStatus) || 'unknown';
  }

  /**
   * Set success status (for assessments)
   */
  setSuccessStatus(status: SuccessStatus): boolean {
    return this.setValue('cmi.success_status', status);
  }

  /**
   * Get success status
   */
  getSuccessStatus(): SuccessStatus {
    const status = this.getValue('cmi.success_status');
    return (status as SuccessStatus) || 'unknown';
  }

  /**
   * Set score
   */
  setScore(raw: number, min: number = 0, max: number = 100): boolean {
    const scaled = max !== min ? (raw - min) / (max - min) : 0;

    this.setValue('cmi.score.min', min);
    this.setValue('cmi.score.max', max);
    this.setValue('cmi.score.raw', raw);
    this.setValue('cmi.score.scaled', scaled.toFixed(2));

    return this.commit();
  }

  /**
   * Get score
   */
  getScore(): { raw: number | null; min: number; max: number; scaled: number | null } {
    const raw = this.getValue('cmi.score.raw');
    const min = this.getValue('cmi.score.min');
    const max = this.getValue('cmi.score.max');
    const scaled = this.getValue('cmi.score.scaled');

    return {
      raw: raw ? parseFloat(raw) : null,
      min: min ? parseFloat(min) : 0,
      max: max ? parseFloat(max) : 100,
      scaled: scaled ? parseFloat(scaled) : null,
    };
  }

  /**
   * Set progress measure (0.0 to 1.0)
   */
  setProgressMeasure(progress: number): boolean {
    const clamped = Math.max(0, Math.min(1, progress));
    return this.setValue('cmi.progress_measure', clamped.toFixed(2));
  }

  /**
   * Get progress measure
   */
  getProgressMeasure(): number {
    const progress = this.getValue('cmi.progress_measure');
    return progress ? parseFloat(progress) : 0;
  }

  /**
   * Set bookmark location
   */
  setLocation(location: string): boolean {
    return this.setValue('cmi.location', location);
  }

  /**
   * Get bookmark location
   */
  getLocation(): string {
    return this.getValue('cmi.location');
  }

  /**
   * Set suspend data (JSON serialized state)
   */
  setSuspendData(data: object): boolean {
    const json = JSON.stringify(data);
    if (json.length > 64000) {
      console.error('Suspend data exceeds 64KB limit');
      return false;
    }
    return this.setValue('cmi.suspend_data', json);
  }

  /**
   * Get suspend data
   */
  getSuspendData<T = object>(): T | null {
    const data = this.getValue('cmi.suspend_data');
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      console.error('Failed to parse suspend data');
      return null;
    }
  }

  /**
   * Record an interaction (question/answer)
   */
  recordInteraction(
    index: number,
    id: string,
    type: 'true-false' | 'choice' | 'fill-in' | 'numeric' | 'sequencing' | 'matching',
    learnerResponse: string,
    correctResponse: string,
    result: 'correct' | 'incorrect' | 'neutral',
    latencyMs: number,
    description?: string
  ): boolean {
    const prefix = `cmi.interactions.${index}`;

    this.setValue(`${prefix}.id`, id);
    this.setValue(`${prefix}.type`, type);
    this.setValue(`${prefix}.learner_response`, learnerResponse);
    this.setValue(`${prefix}.correct_responses.0.pattern`, correctResponse);
    this.setValue(`${prefix}.result`, result);
    this.setValue(`${prefix}.latency`, this.msToISO8601Duration(latencyMs));
    this.setValue(`${prefix}.timestamp`, new Date().toISOString());

    if (description) {
      this.setValue(`${prefix}.description`, description.substring(0, 250)); // SCORM limit
    }

    return this.commit();
  }

  /**
   * Get the number of recorded interactions
   */
  getInteractionCount(): number {
    const count = this.getValue('cmi.interactions._count');
    return count ? parseInt(count, 10) : 0;
  }
}

// Singleton instance
export const scormAPI = new SCORMAPIService();

// Window types for SCORM API
declare global {
  interface Window {
    API_1484_11?: any;
  }
}
