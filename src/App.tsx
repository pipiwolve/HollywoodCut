import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import { useAppStore } from './store/useAppStore';

// C 端页面
import JobHall from './pages/c-end/JobHall';
import MicroResume from './pages/c-end/MicroResume';

// B 端页面
import TalentHall from './pages/b-end/TalentHall';
import Workbench from './pages/b-end/Workbench';
import Assurance from './pages/b-end/Assurance';

// 路由监听守卫抽取组件，响应模式变化跳到对应的首页
function RouteGuard({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { appMode } = useAppStore();

    useEffect(() => {
        // 检查当前路径所属端
        const isBEndPath = location.pathname.startsWith('/b-end');
        const isCEndPath = !isBEndPath;

        // 只有当模式切换，且当前路径不属于该模式时，才强制跳转到各自的首页
        // 这样点击子页面链接时（路径与模式一致），就不会被顶回首页了
        if (appMode === 'c-end' && isBEndPath) {
            navigate('/');
        } else if (appMode === 'b-end' && isCEndPath) {
            navigate('/b-end/talents');
        }
    }, [appMode, navigate, location.pathname]);

    return <>{children}</>;
}

function App() {
    const { appMode } = useAppStore();

    return (
        <Router>
            <div className={`min-h-screen ${appMode === 'c-end' ? 'bg-amber-50/30' : 'bg-teal-50/30'} transition-colors duration-500`}>
                <Header />
                <main className="pt-6 relative z-10 w-full overflow-x-hidden">
                    <RouteGuard>
                        <Routes>
                            {/* C 端路由 */}
                            <Route path="/" element={<JobHall />} />
                            <Route path="/profile" element={<MicroResume />} />

                            {/* B 端路由 */}
                            <Route path="/b-end/talents" element={<TalentHall />} />
                            <Route path="/b-end/workbench" element={<Workbench />} />
                            <Route path="/b-end/assurance" element={<Assurance />} />

                            {/* 兜底路由 */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </RouteGuard>
                </main>
            </div>
        </Router>
    );
}

export default App;
