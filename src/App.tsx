import { Sidebar } from './ui/layouts/Sidebar';
import { useCourseStore } from './store/courseStore';
import { IntroductionView } from './ui/views/IntroductionView';
import { ProcessMapsView } from './ui/views/ProcessMapsView';
import { ScvaView } from './ui/views/ScvaView';
import { SnhView } from './ui/views/SnhView';
import { HmaView } from './ui/views/HmaView';
import { IhView } from './ui/views/IhView';
import { KReducedView } from './ui/views/KReducedView';
import { KHedgedView } from './ui/views/KHedgedView';
import { KFullView } from './ui/views/KFullView';
import { PracticeView } from './ui/views/PracticeView';
import './index.css';

function App() {
  const { currentView } = useCourseStore();

  const renderContent = () => {
    switch (currentView) {
      case 'introduction':
        return <IntroductionView />;
      case 'process_maps':
        return <ProcessMapsView />;
      case 'k_full':
        return <KFullView />;
      case 'k_reduced':
        return <KReducedView />;
      case 'k_hedged':
        return <KHedgedView />;
      case 'scva':
        return <ScvaView />;
      case 'snh':
        return <SnhView />;
      case 'hma':
        return <HmaView />;
      case 'ih':
        return <IhView />;
      case 'practice':
        return <PracticeView />;
      default:
        return <div className="p-8">Select a topic from the sidebar</div>;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <div className="view-content h-full overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
