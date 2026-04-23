import { useEffect } from 'react';
import { HashRouter as Router, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import ChatShell from './components/chat/ChatShell';
import DemoDirector from './components/demo/DemoDirector';
import DemoHintBar from './components/demo/DemoHintBar';
import DemoPanel from './components/demo/DemoPanel';
import { useAppStore } from './store/useAppStore';
import { useChatStore } from './store/useChatStore';
import { useDataStore } from './store/useDataStore';
import { useDemoStore } from './store/useDemoStore';

import Assurance from './pages/b-end/Assurance';
import TalentHall from './pages/b-end/TalentHall';
import Workbench from './pages/b-end/Workbench';
import JobHall from './pages/c-end/JobHall';
import MicroResume from './pages/c-end/MicroResume';

function RouteGuard({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const appMode = useAppStore((state) => state.appMode);

    useEffect(() => {
        const isBEndPath = location.pathname.startsWith('/b-end');
        const isCEndPath = !isBEndPath;

        if (appMode === 'c-end' && isBEndPath) {
            navigate('/');
        } else if (appMode === 'b-end' && isCEndPath) {
            navigate('/b-end/talents');
        }
    }, [appMode, navigate, location.pathname]);

    return <>{children}</>;
}

function AppContent() {
    const appMode = useAppStore((state) => state.appMode);
    const hydrateData = useDataStore((state) => state.hydrate);
    const hydrateChat = useChatStore((state) => state.hydrate);
    const hydrateDemo = useDemoStore((state) => state.hydrate);

    useEffect(() => {
        hydrateData();
        hydrateChat();
        hydrateDemo();
    }, [hydrateChat, hydrateData, hydrateDemo]);

    return (
        <div className={[
            'min-h-screen transition-colors duration-500',
            appMode === 'c-end' ? 'bg-amber-50/40' : 'bg-teal-50/40',
        ].join(' ')}>
            <Header />
            <DemoHintBar />
            <main className="relative z-10 w-full overflow-x-hidden pb-10 pt-6">
                <RouteGuard>
                    <Routes>
                        <Route path="/" element={<JobHall />} />
                        <Route path="/profile" element={<MicroResume />} />
                        <Route path="/b-end/talents" element={<TalentHall />} />
                        <Route path="/b-end/workbench" element={<Workbench />} />
                        <Route path="/b-end/assurance" element={<Assurance />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </RouteGuard>
            </main>
            <DemoDirector />
            <DemoPanel />
            <ChatShell />
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
