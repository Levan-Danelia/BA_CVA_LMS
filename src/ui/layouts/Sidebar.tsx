import { Calculator, Layers, ShieldCheck, Zap, BarChart3, Binary, Settings2, Layout, GraduationCap, GitBranch, BookOpen, ClipboardCheck, CheckCircle } from 'lucide-react';
import { useCourseStore, type ViewType } from '../../store/courseStore';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { cn } from '../../lib/utils';

const navItems = [
    { id: 'introduction', label: 'Introduction', icon: BookOpen },
    { id: 'process_maps', label: 'Process Maps', icon: GitBranch },
    { id: 'scva', label: 'SCVA', icon: Calculator },
    { id: 'snh', label: 'SNH', icon: ShieldCheck },
    { id: 'hma', label: 'HMA', icon: Zap },
    { id: 'ih', label: 'IH', icon: BarChart3 },
    { id: 'k_reduced', label: 'K Reduced', icon: Layers },
    { id: 'k_hedged', label: 'K Hedged', icon: Binary },
    { id: 'k_full', label: 'K Full', icon: Settings2 },
    { id: 'practice', label: 'Practice', icon: GraduationCap },
    { id: 'assessment', label: 'Assessment', icon: ClipboardCheck },
];

export function Sidebar() {
    const { currentView, setView, moduleProgress } = useCourseStore();

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Layout className="w-4 h-4 text-primary shrink-0" />
                <span className="sidebar-title">BA CVA</span>
            </div>

            <nav className="sidebar-nav">
                <div className="space-y-0.5">
                    {navItems.map((item) => {
                        const isCompleted = moduleProgress[item.id as ViewType]?.completed;
                        const isActive = currentView === item.id;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setView(item.id as ViewType)}
                                className={cn(
                                    "nav-item w-full",
                                    isActive ? "nav-item-active" : ""
                                )}
                            >
                                <item.icon className="nav-item-icon" />
                                <span className="nav-item-label">
                                    {item.label}
                                </span>
                                {isCompleted && !isActive && (
                                    <CheckCircle className="w-3 h-3 text-green-500 ml-auto" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </nav>

            <ProgressIndicator />
        </aside>
    );
}
