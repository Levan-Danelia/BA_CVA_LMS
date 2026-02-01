import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { scormAPI } from './services/scormAPI'
import { localStorageService } from './services/localStorageService'
import { useCourseStore, NAVIGATION_SEQUENCE } from './store/courseStore'
import type { ViewType, SerializableState } from './store/courseStore'

/**
 * Initialize the application with SCORM or localStorage state restoration
 */
function initializeApp() {
  console.log('[BA-CVA] Application initializing...');

  let scormInitialized = false;

  try {
    // Try to initialize SCORM API
    scormInitialized = scormAPI.initialize();

    if (scormInitialized) {
      console.log('[BA-CVA] Running in LMS mode');

      // Get learner info
      try {
        const learnerInfo = scormAPI.getLearnerInfo();
        if (learnerInfo.id || learnerInfo.name) {
          useCourseStore.getState().setLearnerInfo(learnerInfo.id, learnerInfo.name);
          console.log(`[BA-CVA] Learner: ${learnerInfo.name} (${learnerInfo.id})`);
        }
      } catch (e) {
        console.warn('[BA-CVA] Could not get learner info:', e);
      }

      // Try to restore from suspend_data first
      try {
        const suspendData = scormAPI.getSuspendData<SerializableState>();
        if (suspendData) {
          console.log('[BA-CVA] Restoring state from SCORM suspend_data');
          useCourseStore.getState().restoreState(suspendData);
        } else {
          // Fallback to bookmark location
          const savedLocation = scormAPI.getLocation();
          if (savedLocation && isValidView(savedLocation)) {
            console.log(`[BA-CVA] Restoring bookmark location: ${savedLocation}`);
            useCourseStore.getState().setView(savedLocation as ViewType);
          }
        }
      } catch (e) {
        console.warn('[BA-CVA] Could not restore SCORM state:', e);
      }
    } else {
      console.log('[BA-CVA] Running in standalone mode (no LMS detected)');

      // Try to restore from localStorage
      try {
        if (localStorageService.isAvailable() && localStorageService.exists()) {
          const savedState = localStorageService.load<SerializableState>();
          if (savedState) {
            console.log('[BA-CVA] Restoring state from localStorage');
            useCourseStore.getState().restoreState(savedState);
          }
        }
      } catch (e) {
        console.warn('[BA-CVA] Could not restore localStorage state:', e);
      }
    }
  } catch (e) {
    console.error('[BA-CVA] Error during initialization:', e);
  }

  // Set up page unload handler
  setupUnloadHandler(scormInitialized);

  console.log('[BA-CVA] Initialization complete');
}

/**
 * Validate that a string is a valid view type
 */
function isValidView(view: string): view is ViewType {
  return NAVIGATION_SEQUENCE.includes(view as ViewType);
}

/**
 * Set up handlers for page unload to save state
 */
function setupUnloadHandler(scormInitialized: boolean) {
  const handleUnload = () => {
    const state = useCourseStore.getState().getSerializableState();

    if (scormInitialized && scormAPI.isAvailable()) {
      // Save to SCORM
      scormAPI.setSuspendData(state);
      scormAPI.setLocation(state.currentView);
      scormAPI.terminate('suspend');
    } else {
      // Save to localStorage
      localStorageService.save(state);
    }
  };

  // Use beforeunload for saving state
  window.addEventListener('beforeunload', handleUnload);

  // Also handle visibility change for mobile browsers
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      const state = useCourseStore.getState().getSerializableState();
      localStorageService.save(state);

      if (scormInitialized && scormAPI.isAvailable()) {
        scormAPI.setSuspendData(state);
        scormAPI.setLocation(state.currentView);
        scormAPI.commit();
      }
    }
  });
}

// Initialize the app
initializeApp();

// Render React app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
