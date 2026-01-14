import { useCourseStore } from './courseStore';

export const selectCurrentView = (state: ReturnType<typeof useCourseStore.getState>) => state.currentView;
