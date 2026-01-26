# BA-CVA Learning Module: SCORM 2004 4th Edition Implementation Plan

## Executive Summary

This document provides a detailed implementation plan to bring the BA-CVA Learning Module to **90%+ SCORM compliance**. The plan is organized into 6 phases with specific deliverables, code changes, and testing criteria.

**Target Standard**: SCORM 2004 4th Edition (current industry standard)
**Current Readiness**: ~15-20%
**Target Readiness**: 90%+

---

## Table of Contents

1. [Phase 1: SCORM API Integration Layer](#phase-1-scorm-api-integration-layer)
2. [Phase 2: Progress Tracking System](#phase-2-progress-tracking-system)
3. [Phase 3: Assessment Module](#phase-3-assessment-module)
4. [Phase 4: Data Persistence & Resume](#phase-4-data-persistence--resume)
5. [Phase 5: SCORM Packaging](#phase-5-scorm-packaging)
6. [Phase 6: Testing & Validation](#phase-6-testing--validation)
7. [File Structure Overview](#file-structure-overview)
8. [SCORM Data Model Reference](#scorm-data-model-reference)

---

## Phase 1: SCORM API Integration Layer

### Objective
Create a robust SCORM 2004 API wrapper that handles all communication with the LMS.

### 1.1 Install Dependencies

```bash
npm install scorm-again
```

**Why scorm-again?** It's a modern, TypeScript-friendly SCORM API wrapper that supports both SCORM 1.2 and 2004.

### 1.2 Create SCORM API Service

**New File**: `src/services/scormAPI.ts`

```typescript
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

  /**
   * Find the SCORM API in the window hierarchy
   */
  private findAPI(win: Window): any {
    while (win.API_1484_11 == null && win.parent != null && win.parent !== win) {
      this.findAttempts++;
      if (this.findAttempts > this.maxAttempts) {
        console.error('SCORM API not found after maximum attempts');
        return null;
      }
      win = win.parent;
    }
    return win.API_1484_11 || null;
  }

  /**
   * Initialize connection to LMS
   */
  initialize(): boolean {
    if (this.initialized) {
      console.warn('SCORM API already initialized');
      return true;
    }

    // Try to find API in current window, then opener
    this.API = this.findAPI(window);
    if (!this.API && window.opener) {
      this.API = this.findAPI(window.opener);
    }

    if (!this.API) {
      console.warn('SCORM API not found - running in standalone mode');
      return false;
    }

    const result = this.API.Initialize('');
    if (result === 'true' || result === true) {
      this.initialized = true;
      this.startTime = Date.now();

      // Set initial status if not attempted
      const currentStatus = this.getValue('cmi.completion_status');
      if (currentStatus === 'not attempted' || currentStatus === 'unknown') {
        this.setValue('cmi.completion_status', 'incomplete');
      }

      console.log('SCORM API initialized successfully');
      return true;
    }

    console.error('SCORM initialization failed:', this.getLastError());
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
      console.warn(`SCORM GetValue error for ${element}:`, this.getErrorString(error));
    }

    return value || '';
  }

  /**
   * Set a value in the LMS
   */
  setValue(element: string, value: string | number): boolean {
    if (!this.isAvailable()) return false;

    const result = this.API.SetValue(element, String(value));
    const error = this.API.GetLastError();

    if (error !== '0' && error !== 0) {
      console.error(`SCORM SetValue error for ${element}:`, this.getErrorString(error));
      return false;
    }

    return result === 'true' || result === true;
  }

  /**
   * Commit data to LMS
   */
  commit(): boolean {
    if (!this.isAvailable()) return false;

    const result = this.API.Commit('');
    return result === 'true' || result === true;
  }

  /**
   * Terminate the SCORM session
   */
  terminate(exitType: ExitType = 'suspend'): boolean {
    if (!this.isAvailable()) return false;

    // Set session time before terminating
    this.setSessionTime();

    // Set exit type
    this.setValue('cmi.exit', exitType);

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
  setCompletionStatus(status: 'completed' | 'incomplete' | 'not attempted' | 'unknown'): boolean {
    return this.setValue('cmi.completion_status', status);
  }

  /**
   * Set success status (for assessments)
   */
  setSuccessStatus(status: 'passed' | 'failed' | 'unknown'): boolean {
    return this.setValue('cmi.success_status', status);
  }

  /**
   * Set score
   */
  setScore(raw: number, min: number = 0, max: number = 100): boolean {
    const scaled = (raw - min) / (max - min);

    this.setValue('cmi.score.min', min);
    this.setValue('cmi.score.max', max);
    this.setValue('cmi.score.raw', raw);
    this.setValue('cmi.score.scaled', scaled);

    return this.commit();
  }

  /**
   * Set progress measure (0.0 to 1.0)
   */
  setProgressMeasure(progress: number): boolean {
    const clamped = Math.max(0, Math.min(1, progress));
    return this.setValue('cmi.progress_measure', clamped);
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
      this.setValue(`${prefix}.description`, description);
    }

    return this.commit();
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
```

### 1.3 Update Main Entry Point

**Modify**: `src/main.tsx`

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { scormAPI } from './services/scormAPI'
import { useCourseStore } from './store/courseStore'

// Initialize SCORM API
const scormInitialized = scormAPI.initialize();

if (scormInitialized) {
  console.log('Running in LMS mode');

  // Restore previous location if resuming
  const savedLocation = scormAPI.getLocation();
  if (savedLocation) {
    useCourseStore.getState().setView(savedLocation as any);
  }

  // Restore suspend data
  const suspendData = scormAPI.getSuspendData();
  if (suspendData) {
    useCourseStore.getState().restoreState(suspendData);
  }
} else {
  console.log('Running in standalone mode (no LMS detected)');
}

// Handle page unload - save state and terminate
window.addEventListener('beforeunload', () => {
  if (scormAPI.isAvailable()) {
    const state = useCourseStore.getState().getSerializableState();
    scormAPI.setSuspendData(state);
    scormAPI.setLocation(state.currentView);
    scormAPI.terminate('suspend');
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### 1.4 Deliverables Checklist

- [ ] `src/services/scormAPI.ts` - SCORM API wrapper service
- [ ] `src/main.tsx` - Updated with SCORM initialization
- [ ] TypeScript types for SCORM data model
- [ ] Window unload handler for graceful termination

---

## Phase 2: Progress Tracking System

### Objective
Track learner progress through all 10 modules and report to LMS.

### 2.1 Extend Course Store

**Modify**: `src/store/courseStore.ts`

```typescript
import { create } from 'zustand';
import { scormAPI } from '../services/scormAPI';

export type ViewType =
    | 'introduction'
    | 'process_maps'
    | 'k_full'
    | 'k_reduced'
    | 'k_hedged'
    | 'scva'
    | 'snh'
    | 'hma'
    | 'ih'
    | 'practice';

export const NAVIGATION_SEQUENCE: ViewType[] = [
    'introduction',
    'process_maps',
    'k_full',
    'k_reduced',
    'k_hedged',
    'scva',
    'snh',
    'hma',
    'ih',
    'practice'
];

export const VIEW_LABELS: Record<ViewType, string> = {
    'introduction': 'Introduction',
    'process_maps': 'Process Maps',
    'k_full': 'K Full',
    'k_reduced': 'K Reduced',
    'k_hedged': 'K Hedged',
    'scva': 'SCVA',
    'snh': 'SNH',
    'hma': 'HMA',
    'ih': 'IH',
    'practice': 'Practice'
};

export const TOTAL_MODULES = NAVIGATION_SEQUENCE.length;

// Module completion requires minimum time spent (in seconds)
export const MIN_TIME_PER_MODULE = 30; // 30 seconds minimum per module

export function getPreviousView(view: ViewType): ViewType | null {
    const currentIndex = NAVIGATION_SEQUENCE.indexOf(view);
    return currentIndex > 0 ? NAVIGATION_SEQUENCE[currentIndex - 1] : null;
}

export function getNextView(view: ViewType): ViewType | null {
    const currentIndex = NAVIGATION_SEQUENCE.indexOf(view);
    return currentIndex < NAVIGATION_SEQUENCE.length - 1 ? NAVIGATION_SEQUENCE[currentIndex + 1] : null;
}

// Progress tracking interfaces
interface ModuleProgress {
    visited: boolean;
    completed: boolean;
    timeSpent: number; // seconds
    firstVisited?: number; // timestamp
    lastVisited?: number; // timestamp
}

interface AssessmentResult {
    score: number;
    maxScore: number;
    passed: boolean;
    completedAt: number;
    answers: Record<string, any>;
}

interface SerializableState {
    currentView: ViewType;
    moduleProgress: Record<ViewType, ModuleProgress>;
    assessmentResult: AssessmentResult | null;
    courseStarted: number;
    lastActivity: number;
}

interface CourseState {
    // Navigation
    currentView: ViewType;
    setView: (view: ViewType) => void;
    goToPrevious: () => void;
    goToNext: () => void;

    // Progress tracking
    moduleProgress: Record<ViewType, ModuleProgress>;
    markModuleVisited: (view: ViewType) => void;
    markModuleCompleted: (view: ViewType) => void;
    updateModuleTime: (view: ViewType, seconds: number) => void;

    // Assessment
    assessmentResult: AssessmentResult | null;
    setAssessmentResult: (result: AssessmentResult) => void;

    // Computed values
    getProgressPercentage: () => number;
    getCompletedModulesCount: () => number;
    isModuleAccessible: (view: ViewType) => boolean;
    isCourseCompleted: () => boolean;

    // Timestamps
    courseStarted: number;
    lastActivity: number;

    // Serialization for SCORM suspend_data
    getSerializableState: () => SerializableState;
    restoreState: (state: Partial<SerializableState>) => void;

    // SCORM sync
    syncToSCORM: () => void;
}

// Initialize empty progress for all modules
const initializeModuleProgress = (): Record<ViewType, ModuleProgress> => {
    const progress: Partial<Record<ViewType, ModuleProgress>> = {};
    NAVIGATION_SEQUENCE.forEach(view => {
        progress[view] = {
            visited: false,
            completed: false,
            timeSpent: 0,
        };
    });
    return progress as Record<ViewType, ModuleProgress>;
};

export const useCourseStore = create<CourseState>((set, get) => ({
    // Navigation state
    currentView: 'introduction',

    setView: (view) => {
        const prev = get().currentView;
        const now = Date.now();

        set({
            currentView: view,
            lastActivity: now,
        });

        // Mark new view as visited
        get().markModuleVisited(view);

        // Scroll to top
        setTimeout(() => {
            const viewContent = document.querySelector('.view-content');
            if (viewContent) {
                viewContent.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 0);

        // Sync to SCORM
        get().syncToSCORM();
    },

    goToPrevious: () => {
        const { currentView, setView } = get();
        const prev = getPreviousView(currentView);
        if (prev) setView(prev);
    },

    goToNext: () => {
        const { currentView, setView, markModuleCompleted } = get();

        // Mark current as completed when moving to next
        markModuleCompleted(currentView);

        const next = getNextView(currentView);
        if (next) setView(next);
    },

    // Progress tracking
    moduleProgress: initializeModuleProgress(),

    markModuleVisited: (view) => {
        const now = Date.now();
        set(state => ({
            moduleProgress: {
                ...state.moduleProgress,
                [view]: {
                    ...state.moduleProgress[view],
                    visited: true,
                    firstVisited: state.moduleProgress[view].firstVisited || now,
                    lastVisited: now,
                },
            },
        }));
    },

    markModuleCompleted: (view) => {
        set(state => ({
            moduleProgress: {
                ...state.moduleProgress,
                [view]: {
                    ...state.moduleProgress[view],
                    completed: true,
                },
            },
        }));
        get().syncToSCORM();
    },

    updateModuleTime: (view, seconds) => {
        set(state => ({
            moduleProgress: {
                ...state.moduleProgress,
                [view]: {
                    ...state.moduleProgress[view],
                    timeSpent: state.moduleProgress[view].timeSpent + seconds,
                },
            },
        }));
    },

    // Assessment
    assessmentResult: null,

    setAssessmentResult: (result) => {
        set({ assessmentResult: result });

        // Update SCORM with score
        if (scormAPI.isAvailable()) {
            scormAPI.setScore(result.score, 0, result.maxScore);
            scormAPI.setSuccessStatus(result.passed ? 'passed' : 'failed');

            if (result.passed) {
                scormAPI.setCompletionStatus('completed');
            }
        }

        get().syncToSCORM();
    },

    // Computed values
    getProgressPercentage: () => {
        const { moduleProgress } = get();
        const completedCount = Object.values(moduleProgress).filter(m => m.completed).length;
        return (completedCount / TOTAL_MODULES) * 100;
    },

    getCompletedModulesCount: () => {
        const { moduleProgress } = get();
        return Object.values(moduleProgress).filter(m => m.completed).length;
    },

    isModuleAccessible: (view) => {
        // All modules are accessible (non-linear navigation allowed)
        // Change this logic if you want to enforce linear progression
        return true;
    },

    isCourseCompleted: () => {
        const { moduleProgress, assessmentResult } = get();
        const allModulesCompleted = Object.values(moduleProgress).every(m => m.completed);

        // Course is complete when all modules visited AND assessment passed (if required)
        // For completion-only mode (no assessment), just check modules
        return allModulesCompleted;
    },

    // Timestamps
    courseStarted: Date.now(),
    lastActivity: Date.now(),

    // Serialization
    getSerializableState: () => {
        const state = get();
        return {
            currentView: state.currentView,
            moduleProgress: state.moduleProgress,
            assessmentResult: state.assessmentResult,
            courseStarted: state.courseStarted,
            lastActivity: state.lastActivity,
        };
    },

    restoreState: (savedState) => {
        set(state => ({
            ...state,
            currentView: savedState.currentView || state.currentView,
            moduleProgress: savedState.moduleProgress || state.moduleProgress,
            assessmentResult: savedState.assessmentResult || state.assessmentResult,
            courseStarted: savedState.courseStarted || state.courseStarted,
            lastActivity: Date.now(),
        }));
    },

    // SCORM synchronization
    syncToSCORM: () => {
        if (!scormAPI.isAvailable()) return;

        const state = get();

        // Update progress measure
        const progress = state.getProgressPercentage() / 100;
        scormAPI.setProgressMeasure(progress);

        // Update location (bookmark)
        scormAPI.setLocation(state.currentView);

        // Update completion status
        if (state.isCourseCompleted()) {
            scormAPI.setCompletionStatus('completed');
        } else {
            scormAPI.setCompletionStatus('incomplete');
        }

        // Save suspend data
        scormAPI.setSuspendData(state.getSerializableState());

        // Commit to LMS
        scormAPI.commit();
    },
}));

// Auto-initialize first module as visited
useCourseStore.getState().markModuleVisited('introduction');
```

### 2.2 Add Progress Indicator Component

**New File**: `src/ui/components/ProgressIndicator.tsx`

```typescript
import React from 'react';
import { useCourseStore, TOTAL_MODULES } from '../../store/courseStore';
import { CheckCircle } from 'lucide-react';

export const ProgressIndicator: React.FC = () => {
    const { getProgressPercentage, getCompletedModulesCount } = useCourseStore();

    const percentage = getProgressPercentage();
    const completed = getCompletedModulesCount();

    return (
        <div className="progress-indicator">
            <div className="progress-header">
                <CheckCircle className="progress-icon" size={16} />
                <span className="progress-text">
                    {completed} of {TOTAL_MODULES} modules completed
                </span>
            </div>
            <div className="progress-bar-container">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="progress-percentage">{Math.round(percentage)}%</span>
        </div>
    );
};
```

### 2.3 Add Time Tracking Hook

**New File**: `src/hooks/useTimeTracking.ts`

```typescript
import { useEffect, useRef } from 'react';
import { useCourseStore, ViewType } from '../store/courseStore';

/**
 * Hook to track time spent on a module
 * Updates every 5 seconds while the module is active
 */
export function useTimeTracking(view: ViewType) {
    const { updateModuleTime, currentView } = useCourseStore();
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        // Only track time for the current view
        if (currentView !== view) return;

        // Start tracking
        intervalRef.current = window.setInterval(() => {
            updateModuleTime(view, 5); // Add 5 seconds
        }, 5000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [currentView, view, updateModuleTime]);
}
```

### 2.4 Deliverables Checklist

- [ ] Extended `courseStore.ts` with progress tracking
- [ ] `src/ui/components/ProgressIndicator.tsx`
- [ ] `src/hooks/useTimeTracking.ts`
- [ ] CSS styles for progress indicator
- [ ] Integration with Sidebar to show progress

---

## Phase 3: Assessment Module

### Objective
Create a quiz/assessment system to measure learner comprehension and report scores to LMS.

### 3.1 Question Types and Data Model

**New File**: `src/types/assessment.ts`

```typescript
export type QuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'numeric-input'
  | 'fill-in-blank';

export interface QuestionOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface BaseQuestion {
    id: string;
    type: QuestionType;
    question: string;
    explanation: string;
    points: number;
    module: string; // Which module this question relates to
}

export interface MultipleChoiceQuestion extends BaseQuestion {
    type: 'multiple-choice';
    options: QuestionOption[];
}

export interface TrueFalseQuestion extends BaseQuestion {
    type: 'true-false';
    correctAnswer: boolean;
}

export interface NumericInputQuestion extends BaseQuestion {
    type: 'numeric-input';
    correctAnswer: number;
    tolerance: number; // Acceptable error margin (e.g., 0.01 for 1%)
    unit?: string;
}

export interface FillInBlankQuestion extends BaseQuestion {
    type: 'fill-in-blank';
    correctAnswers: string[]; // Multiple acceptable answers
    caseSensitive: boolean;
}

export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | NumericInputQuestion
  | FillInBlankQuestion;

export interface QuestionAnswer {
    questionId: string;
    answer: string | number | boolean;
    isCorrect: boolean;
    timeSpent: number; // milliseconds
}

export interface AssessmentState {
    questions: Question[];
    currentQuestionIndex: number;
    answers: QuestionAnswer[];
    startTime: number;
    endTime?: number;
    score: number;
    maxScore: number;
    passed: boolean;
    passingScore: number; // percentage (e.g., 70)
}
```

### 3.2 Question Bank

**New File**: `src/data/questionBank.ts`

```typescript
import { Question } from '../types/assessment';

export const QUESTION_BANK: Question[] = [
    // SCVA Questions
    {
        id: 'scva-001',
        type: 'multiple-choice',
        module: 'scva',
        question: 'What is the standard alpha (α) value for non-pension counterparties in the BA-CVA framework?',
        options: [
            { id: 'a', text: '1.0', isCorrect: false },
            { id: 'b', text: '1.2', isCorrect: false },
            { id: 'c', text: '1.4', isCorrect: true },
            { id: 'd', text: '1.5', isCorrect: false },
        ],
        explanation: 'The standard alpha value is 1.4 for all counterparties except pension funds, which use α = 1.0.',
        points: 10,
    },
    {
        id: 'scva-002',
        type: 'true-false',
        module: 'scva',
        question: 'For counterparties using the IMM approach, the discount factor (DF) is always set to 1.0.',
        correctAnswer: true,
        explanation: 'IMM firms already incorporate time-weighting in their exposure models, so the supervisory DF is set to 1.0 to avoid double-counting.',
        points: 10,
    },
    {
        id: 'scva-003',
        type: 'numeric-input',
        module: 'scva',
        question: 'Calculate the discount factor for a maturity of 5 years using the formula DF = [1 - exp(-0.05 × M)] / (0.05 × M). Round to 4 decimal places.',
        correctAnswer: 0.8847,
        tolerance: 0.0005,
        explanation: 'DF = [1 - exp(-0.05 × 5)] / (0.05 × 5) = [1 - exp(-0.25)] / 0.25 = [1 - 0.7788] / 0.25 = 0.8847',
        points: 15,
    },

    // SNH Questions
    {
        id: 'snh-001',
        type: 'multiple-choice',
        module: 'snh',
        question: 'What is the supervisory correlation (r_hc) for a direct-match single name hedge?',
        options: [
            { id: 'a', text: '50%', isCorrect: false },
            { id: 'b', text: '80%', isCorrect: false },
            { id: 'c', text: '100%', isCorrect: true },
            { id: 'd', text: '70%', isCorrect: false },
        ],
        explanation: 'Direct-match hedges (same reference entity) receive 100% correlation. Legally related entities receive 80%, and sector/region proxies receive 50%.',
        points: 10,
    },
    {
        id: 'snh-002',
        type: 'multiple-choice',
        module: 'snh',
        question: 'A hedge referencing a parent company of the counterparty would be classified as:',
        options: [
            { id: 'a', text: 'Direct match', isCorrect: false },
            { id: 'b', text: 'Legally related', isCorrect: true },
            { id: 'c', text: 'Sector/region proxy', isCorrect: false },
            { id: 'd', text: 'Index hedge', isCorrect: false },
        ],
        explanation: 'Parent companies, subsidiaries, and affiliates are considered "legally related" and receive an 80% correlation factor.',
        points: 10,
    },

    // HMA Questions
    {
        id: 'hma-001',
        type: 'true-false',
        module: 'hma',
        question: 'A direct-match hedge (r_hc = 100%) produces zero HMA add-on.',
        correctAnswer: true,
        explanation: 'HMA factor = (1 - r_hc²). For direct match: 1 - 1² = 0, so no HMA add-on.',
        points: 10,
    },
    {
        id: 'hma-002',
        type: 'numeric-input',
        module: 'hma',
        question: 'Calculate the HMA factor for a legally related hedge (r_hc = 80%).',
        correctAnswer: 0.36,
        tolerance: 0.001,
        explanation: 'HMA factor = 1 - r_hc² = 1 - 0.8² = 1 - 0.64 = 0.36',
        points: 10,
    },

    // IH Questions
    {
        id: 'ih-001',
        type: 'multiple-choice',
        module: 'ih',
        question: 'What scalar is applied to the weighted average risk weight when calculating index hedge risk weights?',
        options: [
            { id: 'a', text: '0.50', isCorrect: false },
            { id: 'b', text: '0.65', isCorrect: false },
            { id: 'c', text: '0.70', isCorrect: true },
            { id: 'd', text: '0.80', isCorrect: false },
        ],
        explanation: 'The 0.70 scalar reflects the diversification benefit inherent in an index versus a single name.',
        points: 10,
    },

    // K Reduced Questions
    {
        id: 'kreduced-001',
        type: 'multiple-choice',
        module: 'k_reduced',
        question: 'What is the supervisory correlation parameter (ρ) used in the K Reduced aggregation?',
        options: [
            { id: 'a', text: '0.25', isCorrect: false },
            { id: 'b', text: '0.50', isCorrect: true },
            { id: 'c', text: '0.65', isCorrect: false },
            { id: 'd', text: '0.75', isCorrect: false },
        ],
        explanation: 'The correlation parameter ρ = 0.50 determines the split between systematic and idiosyncratic components.',
        points: 10,
    },
    {
        id: 'kreduced-002',
        type: 'fill-in-blank',
        module: 'k_reduced',
        question: 'In the K Reduced formula, the systematic component uses "sum then _____" logic.',
        correctAnswers: ['square', 'squared'],
        caseSensitive: false,
        explanation: 'The systematic component sums all SCVA values first, then squares: (ρ × ΣSCVAc)²',
        points: 10,
    },

    // K Full Questions
    {
        id: 'kfull-001',
        type: 'numeric-input',
        module: 'k_full',
        question: 'What is the value of β (beta) in the K Full blending formula?',
        correctAnswer: 0.25,
        tolerance: 0.001,
        explanation: 'β = 0.25, ensuring 25% weight on K Reduced (unhedged) and 75% weight on K Hedged.',
        points: 10,
    },
    {
        id: 'kfull-002',
        type: 'numeric-input',
        module: 'k_full',
        question: 'What is the discount scalar (DS_BA-CVA) applied to K Full to get K Final?',
        correctAnswer: 0.65,
        tolerance: 0.001,
        explanation: 'DS_BA-CVA = 0.65 is a calibration adjustment to reduce conservatism in the standardised framework.',
        points: 10,
    },

    // Practical Calculation
    {
        id: 'calc-001',
        type: 'numeric-input',
        module: 'practice',
        question: 'Calculate SCVA for a counterparty with: α=1.4, RW=5%, M=3 years, EAD=1000, DF=0.9277. Round to 2 decimal places.',
        correctAnswer: 99.39,
        tolerance: 0.5,
        explanation: 'SCVA = (1/1.4) × 0.05 × 3 × 1000 × 0.9277 = 0.7143 × 0.05 × 3 × 1000 × 0.9277 = 99.39',
        points: 20,
    },
];

export const PASSING_SCORE = 70; // 70% to pass
export const TOTAL_QUESTIONS = 10; // Number of questions per assessment attempt

/**
 * Get a randomized set of questions for an assessment
 */
export function getAssessmentQuestions(count: number = TOTAL_QUESTIONS): Question[] {
    const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
```

### 3.3 Assessment Store

**New File**: `src/store/assessmentStore.ts`

```typescript
import { create } from 'zustand';
import { Question, QuestionAnswer, AssessmentState } from '../types/assessment';
import { getAssessmentQuestions, PASSING_SCORE, TOTAL_QUESTIONS } from '../data/questionBank';
import { scormAPI } from '../services/scormAPI';
import { useCourseStore } from './courseStore';

interface AssessmentStore {
    // State
    isActive: boolean;
    questions: Question[];
    currentQuestionIndex: number;
    answers: QuestionAnswer[];
    startTime: number;
    questionStartTime: number;

    // Results
    score: number;
    maxScore: number;
    passed: boolean;
    showResults: boolean;

    // Actions
    startAssessment: () => void;
    submitAnswer: (answer: string | number | boolean) => void;
    nextQuestion: () => void;
    previousQuestion: () => void;
    finishAssessment: () => void;
    resetAssessment: () => void;

    // Getters
    getCurrentQuestion: () => Question | null;
    getAnswerForQuestion: (questionId: string) => QuestionAnswer | undefined;
    isLastQuestion: () => boolean;
    canSubmit: () => boolean;
}

export const useAssessmentStore = create<AssessmentStore>((set, get) => ({
    // Initial state
    isActive: false,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    startTime: 0,
    questionStartTime: 0,
    score: 0,
    maxScore: 0,
    passed: false,
    showResults: false,

    // Actions
    startAssessment: () => {
        const questions = getAssessmentQuestions(TOTAL_QUESTIONS);
        const maxScore = questions.reduce((sum, q) => sum + q.points, 0);

        set({
            isActive: true,
            questions,
            currentQuestionIndex: 0,
            answers: [],
            startTime: Date.now(),
            questionStartTime: Date.now(),
            score: 0,
            maxScore,
            passed: false,
            showResults: false,
        });
    },

    submitAnswer: (answer) => {
        const { questions, currentQuestionIndex, answers, questionStartTime } = get();
        const question = questions[currentQuestionIndex];
        if (!question) return;

        const timeSpent = Date.now() - questionStartTime;
        const isCorrect = checkAnswer(question, answer);

        const questionAnswer: QuestionAnswer = {
            questionId: question.id,
            answer,
            isCorrect,
            timeSpent,
        };

        // Update or add answer
        const existingIndex = answers.findIndex(a => a.questionId === question.id);
        const newAnswers = [...answers];
        if (existingIndex >= 0) {
            newAnswers[existingIndex] = questionAnswer;
        } else {
            newAnswers.push(questionAnswer);
        }

        set({ answers: newAnswers });

        // Record interaction in SCORM
        if (scormAPI.isAvailable()) {
            scormAPI.recordInteraction(
                newAnswers.length - 1,
                question.id,
                mapQuestionTypeToSCORM(question.type),
                String(answer),
                getCorrectAnswerString(question),
                isCorrect ? 'correct' : 'incorrect',
                timeSpent,
                question.question
            );
        }
    },

    nextQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        if (currentQuestionIndex < questions.length - 1) {
            set({
                currentQuestionIndex: currentQuestionIndex + 1,
                questionStartTime: Date.now(),
            });
        }
    },

    previousQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
            set({
                currentQuestionIndex: currentQuestionIndex - 1,
                questionStartTime: Date.now(),
            });
        }
    },

    finishAssessment: () => {
        const { questions, answers, maxScore } = get();

        // Calculate score
        let score = 0;
        questions.forEach(question => {
            const answer = answers.find(a => a.questionId === question.id);
            if (answer?.isCorrect) {
                score += question.points;
            }
        });

        const passed = (score / maxScore) * 100 >= PASSING_SCORE;

        set({
            score,
            passed,
            showResults: true,
            isActive: false,
        });

        // Update course store with assessment result
        useCourseStore.getState().setAssessmentResult({
            score,
            maxScore,
            passed,
            completedAt: Date.now(),
            answers: Object.fromEntries(answers.map(a => [a.questionId, a.answer])),
        });
    },

    resetAssessment: () => {
        set({
            isActive: false,
            questions: [],
            currentQuestionIndex: 0,
            answers: [],
            startTime: 0,
            questionStartTime: 0,
            score: 0,
            maxScore: 0,
            passed: false,
            showResults: false,
        });
    },

    // Getters
    getCurrentQuestion: () => {
        const { questions, currentQuestionIndex } = get();
        return questions[currentQuestionIndex] || null;
    },

    getAnswerForQuestion: (questionId) => {
        return get().answers.find(a => a.questionId === questionId);
    },

    isLastQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        return currentQuestionIndex === questions.length - 1;
    },

    canSubmit: () => {
        const { questions, answers } = get();
        return answers.length === questions.length;
    },
}));

// Helper functions
function checkAnswer(question: Question, answer: string | number | boolean): boolean {
    switch (question.type) {
        case 'multiple-choice':
            return question.options.find(o => o.id === answer)?.isCorrect || false;
        case 'true-false':
            return answer === question.correctAnswer;
        case 'numeric-input':
            const numAnswer = Number(answer);
            return Math.abs(numAnswer - question.correctAnswer) <= question.tolerance;
        case 'fill-in-blank':
            const strAnswer = String(answer);
            return question.correctAnswers.some(correct =>
                question.caseSensitive
                    ? correct === strAnswer
                    : correct.toLowerCase() === strAnswer.toLowerCase()
            );
        default:
            return false;
    }
}

function mapQuestionTypeToSCORM(type: string): 'true-false' | 'choice' | 'fill-in' | 'numeric' | 'sequencing' | 'matching' {
    switch (type) {
        case 'multiple-choice': return 'choice';
        case 'true-false': return 'true-false';
        case 'numeric-input': return 'numeric';
        case 'fill-in-blank': return 'fill-in';
        default: return 'fill-in';
    }
}

function getCorrectAnswerString(question: Question): string {
    switch (question.type) {
        case 'multiple-choice':
            return question.options.find(o => o.isCorrect)?.id || '';
        case 'true-false':
            return String(question.correctAnswer);
        case 'numeric-input':
            return String(question.correctAnswer);
        case 'fill-in-blank':
            return question.correctAnswers[0];
        default:
            return '';
    }
}
```

### 3.4 Assessment Components

**New File**: `src/ui/views/AssessmentView.tsx`

```typescript
import React from 'react';
import { ClipboardCheck, ArrowLeft, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { useAssessmentStore } from '../../store/assessmentStore';
import { NavigationButtons } from '../components/NavigationButtons';

// Question component renders based on question type
const QuestionRenderer: React.FC = () => {
    const { getCurrentQuestion, getAnswerForQuestion, submitAnswer } = useAssessmentStore();
    const question = getCurrentQuestion();

    if (!question) return null;

    const existingAnswer = getAnswerForQuestion(question.id);

    switch (question.type) {
        case 'multiple-choice':
            return (
                <div className="question-options">
                    {question.options.map(option => (
                        <button
                            key={option.id}
                            className={`option-button ${existingAnswer?.answer === option.id ? 'selected' : ''}`}
                            onClick={() => submitAnswer(option.id)}
                        >
                            <span className="option-letter">{option.id.toUpperCase()}</span>
                            <span className="option-text">{option.text}</span>
                        </button>
                    ))}
                </div>
            );

        case 'true-false':
            return (
                <div className="question-options true-false">
                    <button
                        className={`option-button ${existingAnswer?.answer === true ? 'selected' : ''}`}
                        onClick={() => submitAnswer(true)}
                    >
                        True
                    </button>
                    <button
                        className={`option-button ${existingAnswer?.answer === false ? 'selected' : ''}`}
                        onClick={() => submitAnswer(false)}
                    >
                        False
                    </button>
                </div>
            );

        case 'numeric-input':
            return (
                <div className="question-input">
                    <input
                        type="number"
                        step="any"
                        placeholder="Enter your answer"
                        defaultValue={existingAnswer?.answer as number || ''}
                        onBlur={(e) => submitAnswer(parseFloat(e.target.value))}
                        className="numeric-input"
                    />
                    {question.unit && <span className="input-unit">{question.unit}</span>}
                </div>
            );

        case 'fill-in-blank':
            return (
                <div className="question-input">
                    <input
                        type="text"
                        placeholder="Enter your answer"
                        defaultValue={existingAnswer?.answer as string || ''}
                        onBlur={(e) => submitAnswer(e.target.value)}
                        className="text-input"
                    />
                </div>
            );

        default:
            return null;
    }
};

// Results component
const AssessmentResults: React.FC = () => {
    const { score, maxScore, passed, questions, answers, resetAssessment } = useAssessmentStore();
    const percentage = Math.round((score / maxScore) * 100);

    return (
        <div className="assessment-results">
            <div className={`result-header ${passed ? 'passed' : 'failed'}`}>
                {passed ? (
                    <>
                        <CheckCircle size={48} />
                        <h2>Congratulations!</h2>
                        <p>You passed the assessment</p>
                    </>
                ) : (
                    <>
                        <XCircle size={48} />
                        <h2>Not Quite</h2>
                        <p>You need 70% to pass</p>
                    </>
                )}
            </div>

            <div className="result-score">
                <div className="score-circle">
                    <span className="score-value">{percentage}%</span>
                    <span className="score-label">{score} / {maxScore} points</span>
                </div>
            </div>

            <div className="result-breakdown">
                <h3>Question Review</h3>
                {questions.map((question, idx) => {
                    const answer = answers.find(a => a.questionId === question.id);
                    return (
                        <div key={question.id} className={`review-item ${answer?.isCorrect ? 'correct' : 'incorrect'}`}>
                            <span className="review-number">Q{idx + 1}</span>
                            <span className="review-status">
                                {answer?.isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            </span>
                            <span className="review-points">
                                {answer?.isCorrect ? question.points : 0} / {question.points} pts
                            </span>
                        </div>
                    );
                })}
            </div>

            {!passed && (
                <button className="retry-button" onClick={resetAssessment}>
                    Try Again
                </button>
            )}
        </div>
    );
};

// Main Assessment View
export const AssessmentView: React.FC = () => {
    const {
        isActive,
        showResults,
        questions,
        currentQuestionIndex,
        answers,
        startAssessment,
        nextQuestion,
        previousQuestion,
        finishAssessment,
        canSubmit,
        isLastQuestion,
        getCurrentQuestion,
    } = useAssessmentStore();

    const question = getCurrentQuestion();
    const currentAnswer = question ? answers.find(a => a.questionId === question.id) : null;

    // Show results screen
    if (showResults) {
        return (
            <div className="view-container">
                <header className="view-header">
                    <div className="view-header-content">
                        <ClipboardCheck className="view-header-icon" />
                        <h1 className="view-header-title">Assessment Results</h1>
                    </div>
                </header>
                <div className="view-content">
                    <div className="content-wrapper">
                        <AssessmentResults />
                        <NavigationButtons />
                    </div>
                </div>
            </div>
        );
    }

    // Show start screen
    if (!isActive) {
        return (
            <div className="view-container">
                <header className="view-header">
                    <div className="view-header-content">
                        <ClipboardCheck className="view-header-icon" />
                        <h1 className="view-header-title">Knowledge Assessment</h1>
                    </div>
                </header>
                <div className="view-content">
                    <div className="content-wrapper">
                        <section className="view-section">
                            <div className="assessment-intro">
                                <h2>Test Your Understanding</h2>
                                <p>
                                    This assessment will test your knowledge of the BA-CVA framework
                                    covered in this course. You will be asked {questions.length || 10} questions
                                    covering all topics.
                                </p>
                                <ul className="assessment-info">
                                    <li>Questions cover all modules: SCVA, SNH, HMA, IH, K Reduced, K Hedged, K Full</li>
                                    <li>Passing score: 70%</li>
                                    <li>You can navigate between questions</li>
                                    <li>Your progress is saved automatically</li>
                                </ul>
                                <button className="start-assessment-button" onClick={startAssessment}>
                                    Start Assessment
                                </button>
                            </div>
                        </section>
                        <NavigationButtons />
                    </div>
                </div>
            </div>
        );
    }

    // Show question screen
    return (
        <div className="view-container">
            <header className="view-header">
                <div className="view-header-content">
                    <ClipboardCheck className="view-header-icon" />
                    <h1 className="view-header-title">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </h1>
                </div>
            </header>
            <div className="view-content">
                <div className="content-wrapper">
                    <section className="view-section">
                        {/* Progress indicator */}
                        <div className="assessment-progress">
                            {questions.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`progress-dot
                                        ${idx === currentQuestionIndex ? 'current' : ''}
                                        ${answers.find(a => a.questionId === questions[idx].id) ? 'answered' : ''}
                                    `}
                                />
                            ))}
                        </div>

                        {/* Question */}
                        <div className="question-container">
                            <div className="question-module-tag">
                                Module: {question?.module.replace('_', ' ').toUpperCase()}
                            </div>
                            <h2 className="question-text">{question?.question}</h2>
                            <QuestionRenderer />
                        </div>

                        {/* Navigation */}
                        <div className="assessment-navigation">
                            <button
                                className="nav-button prev"
                                onClick={previousQuestion}
                                disabled={currentQuestionIndex === 0}
                            >
                                <ArrowLeft size={16} />
                                Previous
                            </button>

                            {isLastQuestion() ? (
                                <button
                                    className="nav-button submit"
                                    onClick={finishAssessment}
                                    disabled={!canSubmit()}
                                >
                                    Submit Assessment
                                </button>
                            ) : (
                                <button
                                    className="nav-button next"
                                    onClick={nextQuestion}
                                    disabled={!currentAnswer}
                                >
                                    Next
                                    <ArrowRight size={16} />
                                </button>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
```

### 3.5 Deliverables Checklist

- [ ] `src/types/assessment.ts` - Assessment type definitions
- [ ] `src/data/questionBank.ts` - Question bank with 15+ questions
- [ ] `src/store/assessmentStore.ts` - Assessment state management
- [ ] `src/ui/views/AssessmentView.tsx` - Assessment UI component
- [ ] CSS styles for assessment components
- [ ] Integration with course navigation (add 'assessment' view)

---

## Phase 4: Data Persistence & Resume

### Objective
Enable learners to resume from where they left off.

### 4.1 Suspend Data Structure

The suspend data will be stored as JSON in `cmi.suspend_data`:

```typescript
interface SuspendData {
    version: string; // Schema version for future compatibility
    currentView: ViewType;
    moduleProgress: Record<ViewType, ModuleProgress>;
    assessmentResult: AssessmentResult | null;
    assessmentState?: {
        currentQuestionIndex: number;
        answers: QuestionAnswer[];
        questions: string[]; // Question IDs to reconstruct
    };
    courseStarted: number;
    lastActivity: number;
}
```

### 4.2 Resume Logic in main.tsx

Already covered in Phase 1, Section 1.3. The key points:

1. On initialization, check for existing `cmi.suspend_data`
2. If found, restore state to Zustand stores
3. Navigate to saved `cmi.location`

### 4.3 Bookmark Location Strategy

The bookmark (cmi.location) will store the current view ID:
- `introduction`
- `process_maps`
- `scva`
- etc.

On resume:
1. Get `cmi.location` value
2. Validate it's a valid ViewType
3. Call `useCourseStore.getState().setView(location)`

### 4.4 Graceful Degradation

When running outside an LMS (standalone mode):
- Use localStorage as fallback
- Detect LMS unavailability in `scormAPI.initialize()`
- Store/retrieve from localStorage with same data structure

**New File**: `src/services/localStorageService.ts`

```typescript
const STORAGE_KEY = 'ba-cva-lms-state';

export const localStorageService = {
    save(data: object): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
        }
    },

    load<T>(): T | null {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('Failed to load from localStorage:', e);
            return null;
        }
    },

    clear(): void {
        localStorage.removeItem(STORAGE_KEY);
    }
};
```

### 4.5 Deliverables Checklist

- [ ] `src/services/localStorageService.ts` - Fallback persistence
- [ ] Resume logic in `main.tsx`
- [ ] Suspend data serialization in course store
- [ ] State restoration on app load
- [ ] Testing with both LMS and standalone modes

---

## Phase 5: SCORM Packaging

### Objective
Create a SCORM-compliant package that can be uploaded to any LMS.

### 5.1 SCORM Manifest File

**New File**: `public/imsmanifest.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="BA_CVA_LMS_Course"
          version="1.0"
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
          xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
          xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
          xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd
                              http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd
                              http://www.adlnet.org/xsd/adlseq_v1p3 adlseq_v1p3.xsd
                              http://www.adlnet.org/xsd/adlnav_v1p3 adlnav_v1p3.xsd
                              http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd">

    <metadata>
        <schema>ADL SCORM</schema>
        <schemaversion>2004 4th Edition</schemaversion>
    </metadata>

    <organizations default="BA_CVA_ORG">
        <organization identifier="BA_CVA_ORG">
            <title>BA-CVA Capital Framework Training</title>

            <item identifier="MODULE_ROOT" identifierref="RESOURCE_SCO">
                <title>BA-CVA Learning Module</title>

                <imsss:sequencing>
                    <imsss:deliveryControls completionSetByContent="true" objectiveSetByContent="true"/>
                </imsss:sequencing>

                <!-- Child items for each module (optional, for LMS navigation) -->
                <item identifier="MOD_INTRO">
                    <title>1. Introduction</title>
                </item>
                <item identifier="MOD_PROCESS">
                    <title>2. Process Maps</title>
                </item>
                <item identifier="MOD_SCVA">
                    <title>3. SCVA Calculation</title>
                </item>
                <item identifier="MOD_SNH">
                    <title>4. Single Name Hedges</title>
                </item>
                <item identifier="MOD_HMA">
                    <title>5. Hedge Mismatch Adjustment</title>
                </item>
                <item identifier="MOD_IH">
                    <title>6. Index Hedges</title>
                </item>
                <item identifier="MOD_KREDUCED">
                    <title>7. K Reduced</title>
                </item>
                <item identifier="MOD_KHEDGED">
                    <title>8. K Hedged</title>
                </item>
                <item identifier="MOD_KFULL">
                    <title>9. K Full</title>
                </item>
                <item identifier="MOD_PRACTICE">
                    <title>10. Practice Exercise</title>
                </item>
                <item identifier="MOD_ASSESSMENT">
                    <title>11. Assessment</title>
                </item>
            </item>
        </organization>
    </organizations>

    <resources>
        <resource identifier="RESOURCE_SCO"
                  type="webcontent"
                  adlcp:scormType="sco"
                  href="index.html">
            <file href="index.html"/>
            <file href="assets/index.css"/>
            <file href="assets/index.js"/>
            <!-- Add all other built assets -->
        </resource>
    </resources>
</manifest>
```

### 5.2 Build Script for SCORM Package

**New File**: `scripts/build-scorm.js`

```javascript
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

async function buildScormPackage() {
    const distDir = path.join(__dirname, '../dist');
    const outputPath = path.join(__dirname, '../ba-cva-scorm.zip');

    // Ensure dist exists
    if (!fs.existsSync(distDir)) {
        console.error('Build dist folder first: npm run build');
        process.exit(1);
    }

    // Create zip archive
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
        console.log(`SCORM package created: ${outputPath}`);
        console.log(`Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
    });

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(output);

    // Add manifest
    archive.file(path.join(__dirname, '../public/imsmanifest.xml'), { name: 'imsmanifest.xml' });

    // Add SCORM schema files (if needed)
    // archive.directory(path.join(__dirname, '../scorm-schemas/'), 'schemas');

    // Add built application
    archive.directory(distDir, false);

    await archive.finalize();
}

buildScormPackage();
```

### 5.3 Update package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "build:scorm": "npm run build && node scripts/build-scorm.js",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

### 5.4 Vite Configuration for SCORM

**Update**: `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Important: relative paths for SCORM
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Ensure consistent file names for manifest
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})
```

### 5.5 Deliverables Checklist

- [ ] `public/imsmanifest.xml` - SCORM manifest
- [ ] `scripts/build-scorm.js` - Package builder
- [ ] Updated `vite.config.ts` for relative paths
- [ ] Updated `package.json` with build:scorm script
- [ ] Install `archiver` package: `npm install --save-dev archiver`

---

## Phase 6: Testing & Validation

### Objective
Verify SCORM compliance and functionality across different LMS platforms.

### 6.1 Testing Tools

1. **SCORM Cloud** (Rustici Software) - Industry standard testing
   - URL: https://cloud.scorm.com
   - Upload package and run conformance tests
   - Free tier available for testing

2. **ADL SCORM Test Suite**
   - Official ADL conformance testing
   - Validates all SCORM data model elements

3. **Local LMS Testing**
   - Moodle (open source)
   - Canvas (free tier)

### 6.2 Test Cases

#### 6.2.1 Initialization Tests
- [ ] Course launches successfully in LMS
- [ ] Learner name/ID retrieved correctly
- [ ] Previous session data restored on resume
- [ ] Status set to "incomplete" on first launch

#### 6.2.2 Progress Tracking Tests
- [ ] Progress measure updates as modules complete
- [ ] Location (bookmark) saves current view
- [ ] Module completion tracked correctly
- [ ] All 10 modules can be completed

#### 6.2.3 Assessment Tests
- [ ] Assessment can be started
- [ ] Questions render correctly
- [ ] Answers recorded to cmi.interactions
- [ ] Score calculated and sent to LMS
- [ ] Pass/fail status reported correctly
- [ ] Can retake assessment after failure

#### 6.2.4 Persistence Tests
- [ ] Close browser mid-course, resume works
- [ ] Suspend data serializes correctly
- [ ] Suspend data deserializes correctly
- [ ] No data loss on page refresh
- [ ] Session time calculated accurately

#### 6.2.5 Completion Tests
- [ ] Course marked complete when all modules done
- [ ] Score and status persist after completion
- [ ] Can review completed course
- [ ] Exit behavior is correct ("suspend", "normal")

### 6.3 Debugging SCORM

Add debug mode to see SCORM API calls:

```typescript
// Add to scormAPI.ts
private debugMode: boolean = true;

setValue(element: string, value: string | number): boolean {
    if (this.debugMode) {
        console.log(`SCORM SetValue: ${element} = ${value}`);
    }
    // ... rest of method
}
```

### 6.4 SCORM Cloud Testing Checklist

1. Create SCORM Cloud account
2. Upload package
3. Run "Debug" launch
4. Complete course while monitoring:
   - Activity log
   - CMI data changes
   - Errors/warnings
5. Verify final status in reports

### 6.5 Deliverables Checklist

- [ ] SCORM Cloud account created
- [ ] Package uploaded and tested
- [ ] All test cases documented
- [ ] Bugs fixed from testing
- [ ] Final conformance report

---

## File Structure Overview

After implementation, your project will have these new/modified files:

```
ba-cva-lms/
├── public/
│   └── imsmanifest.xml                 # NEW: SCORM manifest
├── scripts/
│   └── build-scorm.js                  # NEW: Package builder
├── src/
│   ├── data/
│   │   └── questionBank.ts             # NEW: Assessment questions
│   ├── hooks/
│   │   └── useTimeTracking.ts          # NEW: Time tracking hook
│   ├── services/
│   │   ├── scormAPI.ts                 # NEW: SCORM API wrapper
│   │   └── localStorageService.ts      # NEW: Fallback storage
│   ├── store/
│   │   ├── courseStore.ts              # MODIFIED: Progress tracking
│   │   ├── assessmentStore.ts          # NEW: Assessment state
│   │   └── scorm-bridge.ts             # DEPRECATED: Remove or replace
│   ├── types/
│   │   ├── bacva.ts                    # Existing
│   │   └── assessment.ts               # NEW: Assessment types
│   ├── ui/
│   │   ├── components/
│   │   │   ├── NavigationButtons.tsx   # Existing
│   │   │   └── ProgressIndicator.tsx   # NEW: Progress bar
│   │   └── views/
│   │       ├── AssessmentView.tsx      # NEW: Quiz component
│   │       └── ... (existing views)
│   ├── App.tsx                         # MODIFIED: Add assessment route
│   └── main.tsx                        # MODIFIED: SCORM init
├── package.json                        # MODIFIED: New scripts
└── vite.config.ts                      # MODIFIED: SCORM build settings
```

---

## SCORM Data Model Reference

### Key cmi.* Elements Used

| Element | Type | Description |
|---------|------|-------------|
| `cmi.learner_id` | Read | Unique learner identifier |
| `cmi.learner_name` | Read | Learner's full name |
| `cmi.completion_status` | Read/Write | not attempted, incomplete, completed, unknown |
| `cmi.success_status` | Read/Write | passed, failed, unknown |
| `cmi.score.raw` | Write | Raw score (0-100) |
| `cmi.score.scaled` | Write | Scaled score (-1 to 1) |
| `cmi.score.min` | Write | Minimum possible score |
| `cmi.score.max` | Write | Maximum possible score |
| `cmi.progress_measure` | Write | Progress (0.0 to 1.0) |
| `cmi.location` | Read/Write | Bookmark location |
| `cmi.suspend_data` | Read/Write | Free-form data (64KB max) |
| `cmi.session_time` | Write | Time in current session |
| `cmi.exit` | Write | suspend, logout, normal, timeout |
| `cmi.interactions.n.*` | Write | Question/answer details |

---

## Summary: Path to 90% SCORM Readiness

| Phase | Deliverables | Status |
|-------|-------------|--------|
| **Phase 1** | SCORM API service, initialization | Required |
| **Phase 2** | Progress tracking, module completion | Required |
| **Phase 3** | Assessment with 15+ questions | Required |
| **Phase 4** | Suspend data, resume from bookmark | Required |
| **Phase 5** | imsmanifest.xml, SCORM package | Required |
| **Phase 6** | Testing on SCORM Cloud | Required |

**Estimated completion**: This plan addresses all critical SCORM requirements. Following all phases will bring your application to **90%+ SCORM 2004 4th Edition compliance**.

**Remaining 10%** may include:
- xAPI/Tin Can support (optional, newer standard)
- Multi-language support
- Accessibility (WCAG 2.1) compliance
- Advanced sequencing rules
- LMS-specific quirks

---

## Next Steps

1. Review this plan and confirm approach
2. Start with Phase 1 (SCORM API layer)
3. Proceed sequentially through phases
4. Test frequently with SCORM Cloud
5. Iterate based on testing feedback

Would you like me to begin implementing any specific phase?
