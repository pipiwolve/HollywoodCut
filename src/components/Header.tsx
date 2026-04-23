import { Link, useLocation } from 'react-router-dom';
import { Bell, MonitorPlay } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useChatStore } from '../store/useChatStore';
import { useDemoStore } from '../store/useDemoStore';
import { cn } from '../utils/cn';

export default function Header() {
    const appMode = useAppStore((state) => state.appMode);
    const toggleAppMode = useAppStore((state) => state.toggleAppMode);
    const currentUser = useAppStore((state) => state.currentUser);
    const openShell = useChatStore((state) => state.openShell);
    const conversations = useChatStore((state) => state.conversations);
    const togglePanel = useDemoStore((state) => state.togglePanel);
    const activePresetId = useDemoStore((state) => state.activePresetId);
    const location = useLocation();
    const isCEnd = appMode === 'c-end';
    const unreadCount = conversations.reduce((total, conversation) => total + conversation.unreadCount, 0);

    return (
        <header className={cn(
            'sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md transition-colors duration-300',
            isCEnd ? 'border-amber-200/60' : 'border-teal-200/60',
        )}>
            <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4 md:px-6">
                <div className="flex items-center gap-6 lg:gap-12">
                    <Link to={isCEnd ? '/' : '/b-end/talents'} className="flex flex-col">
                        <span className={cn('text-3xl font-extrabold tracking-tight', isCEnd ? 'text-amber-600' : 'text-teal-600')}>
                            智龄汇
                        </span>
                        <span className="mt-1 text-sm font-medium text-gray-500">老派更会！</span>
                    </Link>

                    <nav className="hidden gap-5 text-base font-medium lg:flex">
                        <Link
                            to={isCEnd ? '/' : '/b-end/talents'}
                            className={cn(
                                'rounded-xl px-3 py-2 transition-colors hover:text-gray-900',
                                (location.pathname === '/' || location.pathname === '/b-end/talents')
                                    ? (isCEnd ? 'bg-amber-50 text-amber-600' : 'bg-teal-50 text-teal-600')
                                    : 'text-gray-600',
                            )}
                        >
                            {isCEnd ? '岗位大厅' : '牛人大厅'}
                        </Link>
                        <Link
                            to={isCEnd ? '/profile' : '/b-end/workbench'}
                            className={cn(
                                'rounded-xl px-3 py-2 transition-colors hover:text-gray-900',
                                (location.pathname === '/profile' || location.pathname === '/b-end/workbench')
                                    ? (isCEnd ? 'bg-amber-50 text-amber-600' : 'bg-teal-50 text-teal-600')
                                    : 'text-gray-600',
                            )}
                        >
                            {isCEnd ? '我的微档案' : '发布岗位'}
                        </Link>
                        {!isCEnd && (
                            <Link
                                to="/b-end/assurance"
                                className={cn(
                                    'rounded-xl px-3 py-2 transition-colors hover:text-gray-900',
                                    location.pathname === '/b-end/assurance' ? 'bg-teal-50 text-teal-600' : 'text-gray-600',
                                )}
                            >
                                企业信用与保障
                            </Link>
                        )}
                    </nav>
                </div>

                <div className="flex items-center gap-3 md:gap-5">
                    <button
                        onClick={toggleAppMode}
                        className={cn(
                            'relative hidden h-11 w-48 items-center rounded-full p-1 transition-all duration-300 md:inline-flex',
                            isCEnd ? 'bg-amber-100' : 'bg-teal-100',
                        )}
                    >
                        <div
                            className={cn(
                                'absolute h-9 w-[92px] rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out',
                                isCEnd ? 'translate-x-0' : 'translate-x-[92px]',
                            )}
                        />
                        <span className={cn('relative z-10 w-1/2 text-center text-sm font-bold transition-colors duration-300', isCEnd ? 'text-amber-600' : 'text-gray-500')}>
                            长者版
                        </span>
                        <span className={cn('relative z-10 w-1/2 text-center text-sm font-bold transition-colors duration-300', !isCEnd ? 'text-teal-600' : 'text-gray-500')}>
                            企业版
                        </span>
                    </button>

                    <button
                        onClick={togglePanel}
                        className={cn(
                            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-colors',
                            activePresetId
                                ? 'bg-gray-900 text-white hover:bg-gray-800'
                                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
                        )}
                    >
                        <MonitorPlay className="h-4 w-4" />
                        <span className="hidden sm:inline">演示台</span>
                    </button>

                    <div className="flex items-center gap-3 border-l border-gray-200 pl-3 md:gap-4 md:pl-4">
                        <button
                            onClick={() => openShell()}
                            className="relative rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                            aria-label="打开消息中心"
                        >
                            <Bell className="h-6 w-6" />
                            {unreadCount > 0 && (
                                <span className={cn(
                                    'absolute -right-0.5 -top-0.5 min-w-5 rounded-full px-1 text-center text-[10px] font-bold text-white',
                                    isCEnd ? 'bg-amber-500' : 'bg-teal-600',
                                )}>
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>
                        <div className="flex items-center gap-3 rounded-full p-1 pr-2 transition-colors hover:bg-gray-100 md:pr-3">
                            <img src={currentUser.avatar} alt="头像" className="h-10 w-10 rounded-full bg-gray-200" />
                            <span className="hidden text-sm font-medium text-gray-700 sm:block">
                                {isCEnd ? currentUser.name : 'HR 招聘者'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
