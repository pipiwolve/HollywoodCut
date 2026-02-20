import React, { useState, useEffect } from 'react';
import { MapPin, Target, ChevronRight, Briefcase } from 'lucide-react';
import { getJobs } from '../../utils/storage';
import ChatWindow from '../../components/ChatWindow';

interface Job {
    id: string;
    title: string;
    company: string;
    salary: string;
    location: string;
    matchRate: number;
    tags: string[];
    desc: string;
}

export default function JobHall() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentChatTarget, setCurrentChatTarget] = useState('');

    useEffect(() => {
        // 页面加载时获取 LocalStorage 里的所有岗位
        setJobs(getJobs());
    }, []);

    const handleOpenChat = (companyName: string) => {
        setCurrentChatTarget(companyName);
        setIsChatOpen(true);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-wide">
                    为您精选的附近好工作
                </h1>
                <p className="text-xl text-gray-600">离家近、不费力，老伙伴们都在看</p>
            </div>

            <div className="space-y-6">
                {jobs.map((job) => (
                    <div
                        key={job.id}
                        className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all border-2 border-transparent hover:border-amber-200 group"
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                            <div className="flex-1 w-full text-left">
                                {/* 岗位头部：标题与薪资 */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                                        {job.title}
                                    </h2>
                                    <span className="text-2xl sm:text-3xl font-extrabold text-amber-500">
                                        {job.salary}
                                    </span>
                                </div>

                                {/* 公司信息与匹配度 */}
                                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6">
                                    <div className="flex items-center gap-2 text-xl font-medium text-gray-700">
                                        <Briefcase className="w-6 h-6 text-gray-400" />
                                        {job.company}
                                    </div>
                                    <div className="flex items-center gap-2 text-xl font-medium text-amber-700 bg-amber-50 px-3 py-1 rounded-lg">
                                        <Target className="w-6 h-6 text-amber-500" />
                                        契合度 {job.matchRate}%
                                    </div>
                                    <div className="flex items-center gap-2 text-xl font-medium text-gray-600">
                                        <MapPin className="w-6 h-6 text-gray-400" />
                                        {job.location}
                                    </div>
                                </div>

                                {/* 适老简明标签，高对比度 */}
                                <div className="flex flex-wrap gap-3 mb-6">
                                    {job.tags?.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-4 py-1.5 bg-gray-100 text-gray-800 rounded-full text-lg font-medium border border-gray-200"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-xl text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {job.desc}
                                </p>
                            </div>

                            {/* 右侧极其明显的大按钮 */}
                            <div className="w-full sm:w-auto flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100 mt-4 sm:mt-0 items-center justify-center flex">
                                <button
                                    onClick={() => handleOpenChat(job.company)}
                                    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-2xl px-10 py-5 sm:py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95"
                                >
                                    立即沟通
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {jobs.length === 0 && (
                    <div className="text-center py-20 text-gray-500 text-xl">
                        暂无岗位数据，您可以切换到企业版发布新岗位
                    </div>
                )}
            </div>

            <ChatWindow
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                targetName={currentChatTarget}
                appMode="c-end"
            />
        </div>
    );
}
