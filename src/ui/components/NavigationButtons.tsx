import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCourseStore, getPreviousView, getNextView } from '../../store/courseStore';
import { cn } from '../../lib/utils';

export function NavigationButtons() {
    const { currentView, goToPrevious, goToNext } = useCourseStore();

    const prevView = getPreviousView(currentView);
    const nextView = getNextView(currentView);

    return (
        <div className="footer-nav">
            <button
                type="button"
                onClick={goToPrevious}
                className={cn("nav-btn", !prevView && "nav-btn-hidden")}
                disabled={!prevView}
            >
                <ArrowLeft className="w-4 h-4" />
                Previous
            </button>
            <button
                type="button"
                onClick={goToNext}
                className={cn("nav-btn", !nextView && "nav-btn-hidden")}
                disabled={!nextView}
            >
                Next
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}
