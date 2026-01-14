import { Calculator, Layers, ShieldCheck, Zap, BarChart3, Binary, Settings2, Layout, GraduationCap, GitBranch, BookOpen } from 'lucide-react';
import { useCourseStore, type ViewType } from '../../store/courseStore';
import { cn } from '../../lib/utils';

const navItems = [
    { id: 'introduction', label: 'Introduction', icon: BookOpen },
    { id: 'process_maps', label: 'Process Maps', icon: GitBranch },
    { id: 'k_full', label: 'K Full', icon: Settings2 },
    { id: 'k_reduced', label: 'K Reduced', icon: Layers },
    { id: 'k_hedged', label: 'K Hedged', icon: Binary },
    { id: 'scva', label: 'SCVA', icon: Calculator },
    { id: 'snh', label: 'SNH', icon: ShieldCheck },
    { id: 'hma', label: 'HMA', icon: Zap },
    { id: 'ih', label: 'IH', icon: BarChart3 },
    { id: 'practice', label: 'Practice', icon: GraduationCap },
];

export function Sidebar() {
    const { currentView, setView } = useCourseStore();

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Layout className="w-4 h-4 text-primary shrink-0" />
                <span className="sidebar-title">BA CVA</span>
            </div>

            <nav className="sidebar-nav">
                <div className="space-y-0.5">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setView(item.id as ViewType)}
                            className={cn(
                                "nav-item w-full",
                                currentView === item.id ? "nav-item-active" : ""
                            )}
                        >
                            <item.icon className="nav-item-icon" />
                            <span className="nav-item-label">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            </nav>
        </aside>
    );
}
