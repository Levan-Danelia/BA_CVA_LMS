import { create } from 'zustand';

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

export function getPreviousView(view: ViewType): ViewType | null {
    const currentIndex = NAVIGATION_SEQUENCE.indexOf(view);
    return currentIndex > 0 ? NAVIGATION_SEQUENCE[currentIndex - 1] : null;
}

export function getNextView(view: ViewType): ViewType | null {
    const currentIndex = NAVIGATION_SEQUENCE.indexOf(view);
    return currentIndex < NAVIGATION_SEQUENCE.length - 1 ? NAVIGATION_SEQUENCE[currentIndex + 1] : null;
}

interface CourseState {
    currentView: ViewType;
    setView: (view: ViewType) => void;
    goToPrevious: () => void;
    goToNext: () => void;
}

export const useCourseStore = create<CourseState>((set, get) => ({
    currentView: 'introduction',
    setView: (view) => {
        set({ currentView: view });
        // Scroll the view-content container to top after React finishes rendering
        setTimeout(() => {
            const viewContent = document.querySelector('.view-content');
            if (viewContent) {
                viewContent.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 0);
    },
    goToPrevious: () => {
        const { currentView, setView } = get();
        const prev = getPreviousView(currentView);
        if (prev) setView(prev);
    },
    goToNext: () => {
        const { currentView, setView } = get();
        const next = getNextView(currentView);
        if (next) setView(next);
    },
}));
