import { create } from 'zustand';
import { scormAPI } from '../services/scormAPI';
import { localStorageService } from '../services/localStorageService';

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
    | 'practice'
    | 'assessment';

export const NAVIGATION_SEQUENCE: ViewType[] = [
    'introduction',
    'process_maps',
    'scva',
    'snh',
    'hma',
    'ih',
    'k_reduced',
    'k_hedged',
    'k_full',
    'practice',
    'assessment'
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
    'practice': 'Practice',
    'assessment': 'Assessment'
};

export const TOTAL_MODULES = NAVIGATION_SEQUENCE.length;

// Modules that count toward completion (excluding assessment)
export const CONTENT_MODULES = NAVIGATION_SEQUENCE.filter(v => v !== 'assessment');
export const TOTAL_CONTENT_MODULES = CONTENT_MODULES.length;

export function getPreviousView(view: ViewType): ViewType | null {
    const currentIndex = NAVIGATION_SEQUENCE.indexOf(view);
    return currentIndex > 0 ? NAVIGATION_SEQUENCE[currentIndex - 1] : null;
}

export function getNextView(view: ViewType): ViewType | null {
    const currentIndex = NAVIGATION_SEQUENCE.indexOf(view);
    return currentIndex < NAVIGATION_SEQUENCE.length - 1 ? NAVIGATION_SEQUENCE[currentIndex + 1] : null;
}

// Progress tracking interfaces
export interface ModuleProgress {
    visited: boolean;
    completed: boolean;
    timeSpent: number; // seconds
    firstVisited?: number; // timestamp
    lastVisited?: number; // timestamp
}

export interface AssessmentResult {
    score: number;
    maxScore: number;
    passed: boolean;
    completedAt: number;
    answers: Record<string, any>;
}

export interface SerializableState {
    version: string;
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
    getVisitedModulesCount: () => number;
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

    // Learner info
    learnerName: string;
    learnerId: string;
    setLearnerInfo: (id: string, name: string) => void;
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

        // Mark assessment module as completed
        get().markModuleCompleted('assessment');

        // Update SCORM with score
        if (scormAPI.isAvailable()) {
            scormAPI.setScore(result.score, 0, result.maxScore);
            scormAPI.setSuccessStatus(result.passed ? 'passed' : 'failed');

            if (result.passed && get().isCourseCompleted()) {
                scormAPI.setCompletionStatus('completed');
            }
        }

        get().syncToSCORM();
    },

    // Computed values
    getProgressPercentage: () => {
        const { moduleProgress } = get();
        // Only count content modules (not assessment)
        const completedCount = CONTENT_MODULES.filter(view => moduleProgress[view]?.completed).length;
        return (completedCount / TOTAL_CONTENT_MODULES) * 100;
    },

    getCompletedModulesCount: () => {
        const { moduleProgress } = get();
        return CONTENT_MODULES.filter(view => moduleProgress[view]?.completed).length;
    },

    getVisitedModulesCount: () => {
        const { moduleProgress } = get();
        return CONTENT_MODULES.filter(view => moduleProgress[view]?.visited).length;
    },

    isModuleAccessible: (_view) => {
        // All modules are accessible (non-linear navigation allowed)
        // Change this logic if you want to enforce linear progression
        return true;
    },

    isCourseCompleted: () => {
        const { moduleProgress, assessmentResult } = get();

        // All content modules must be completed
        const allContentCompleted = CONTENT_MODULES.every(view => moduleProgress[view]?.completed);

        // Assessment must be passed (if you want assessment optional, remove this check)
        const assessmentPassed = assessmentResult?.passed === true;

        return allContentCompleted && assessmentPassed;
    },

    // Timestamps
    courseStarted: Date.now(),
    lastActivity: Date.now(),

    // Learner info
    learnerName: '',
    learnerId: '',

    setLearnerInfo: (id, name) => {
        set({ learnerId: id, learnerName: name });
    },

    // Serialization
    getSerializableState: () => {
        const state = get();
        return {
            version: '1.0',
            currentView: state.currentView,
            moduleProgress: state.moduleProgress,
            assessmentResult: state.assessmentResult,
            courseStarted: state.courseStarted,
            lastActivity: state.lastActivity,
        };
    },

    restoreState: (savedState) => {
        if (!savedState) return;

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
        const state = get();
        const serializableState = state.getSerializableState();

        // Always save to localStorage as backup
        localStorageService.save(serializableState);

        if (!scormAPI.isAvailable()) return;

        // Update progress measure (0.0 to 1.0)
        const progress = state.getProgressPercentage() / 100;
        scormAPI.setProgressMeasure(progress);

        // Update location (bookmark)
        scormAPI.setLocation(state.currentView);

        // Update completion status
        if (state.isCourseCompleted()) {
            scormAPI.setCompletionStatus('completed');
        } else if (state.getVisitedModulesCount() > 0) {
            scormAPI.setCompletionStatus('incomplete');
        }

        // Save suspend data
        scormAPI.setSuspendData(serializableState);

        // Commit to LMS
        scormAPI.commit();
    },
}));

// Auto-initialize first module as visited on store creation
useCourseStore.getState().markModuleVisited('introduction');
