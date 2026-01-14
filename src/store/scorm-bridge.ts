import { useCourseStore } from './courseStore';

export function initScormBridge() {
    // Placeholder for SCORM initialization
    console.log("SCORM Bridge Initialized");

    // Subscribe to store changes to save suspend_data
    useCourseStore.subscribe((_state) => {
        // console.log("State changed, saving to SCORM...", state);
    });
}
