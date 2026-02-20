import { Link, useLocation } from 'react-router-dom';
import { Settings, User, Bell } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../utils/cn';

export default function Header() {
    const { appMode, toggleAppMode, currentUser } = useAppStore();
    const isCEnd = appMode === 'c-end';
    const location = useLocation();

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full border-b transition-colors duration-300 backdrop-blur-md bg-white/80",
            isCEnd ? "border-amber-200/50" : "border-teal-200/50"
        )}>
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo 与主导航 */}
                <div className="flex items-center gap-12">
                    <Link to="/" className="flex flex-col">
                        <span className={cn(
                            "text-3xl font-extrabold tracking-tight",
                            isCEnd ? "text-amber-600" : "text-teal-600"
                        )}>
                            智龄汇
                        </span>
                        <span className="text-sm font-medium text-gray-500 mt-1">老派更会！</span>
                    </Link>

                    <nav className="hidden md:flex gap-8 text-lg font-medium">
                        <Link
                            to={isCEnd ? "/" : "/b-end/talents"}
                            className={cn(
                                "transition-colors hover:text-gray-900 px-3 py-2 rounded-lg",
                                (location.pathname === '/' || location.pathname === '/b-end/talents')
                                    ? (isCEnd ? "text-amber-600 bg-amber-50" : "text-teal-600 bg-teal-50")
                                    : "text-gray-600"
                            )}
                        >
                            {isCEnd ? '岗位大厅' : '牛人大厅'}
                        </Link>
                        <Link
                            to={isCEnd ? "/profile" : "/b-end/workbench"}
                            className={cn(
                                "transition-colors hover:text-gray-900 px-3 py-2 rounded-lg",
                                (location.pathname === '/profile' || location.pathname === '/b-end/workbench')
                                    ? (isCEnd ? "text-amber-600 bg-amber-50" : "text-teal-600 bg-teal-50")
                                    : "text-gray-600"
                            )}
                        >
                            {isCEnd ? '我的微简历' : '发布岗位'}
                        </Link>
                        {!isCEnd && (
                            <Link
                                to="/b-end/assurance"
                                className={cn(
                                    "transition-colors hover:text-gray-900 px-3 py-2 rounded-lg flex items-center gap-2",
                                    location.pathname === '/b-end/assurance' ? "text-teal-600 bg-teal-50" : "text-gray-600"
                                )}
                            >
                                企业信用与保障
                            </Link>
                        )}
                    </nav>
                </div>

                {/* 右侧工具栏：切换开关与个人中心 */}
                <div className="flex items-center gap-6">
                    {/* 大号的双端切换开关 */}
                    <button
                        onClick={toggleAppMode}
                        className={cn(
                            "relative inline-flex h-11 w-48 items-center rounded-full transition-all duration-300 p-1",
                            isCEnd ? "bg-amber-100" : "bg-teal-100"
                        )}
                    >
                        {/* 滑动的白底指示块 */}
                        <div
                            className={cn(
                                "absolute h-9 w-[92px] rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out",
                                isCEnd ? "translate-x-0" : "translate-x-[92px]"
                            )}
                        />

                        {/* 文字层 - 放在白底上方 */}
                        <span className={cn(
                            "relative z-10 w-1/2 text-center text-base font-bold transition-colors duration-300",
                            isCEnd ? "text-amber-600" : "text-gray-500"
                        )}>
                            长者版
                        </span>
                        <span className={cn(
                            "relative z-10 w-1/2 text-center text-base font-bold transition-colors duration-300",
                            !isCEnd ? "text-teal-600" : "text-gray-500"
                        )}>
                            企业版
                        </span>
                    </button>

                    {/* 消息与头像 */}
                    <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                        <button className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-gray-100 transition-colors">
                            <img
                                src={currentUser.avatar}
                                alt="头像"
                                className="w-10 h-10 rounded-full bg-gray-200"
                            />
                            <span className="text-base font-medium text-gray-700 hidden sm:block">
                                {isCEnd ? currentUser.name : 'HR 招聘者'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
