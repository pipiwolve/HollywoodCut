import React, { useState, useEffect } from 'react';
import { Search, MapPin, HeartPulse, Wrench, MessageSquareText } from 'lucide-react';
import { getCandidates } from '../../utils/storage';
import ChatWindow from '../../components/ChatWindow';

interface Candidate {
    id: string;
    name: string;
    age: number | string;
    gender: string;
    avatar: string;
    expectedSalary: string;
    healthTags: string[];
    skillTags: string[];
    desc: string;
}

export default function TalentHall() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentChatTarget, setCurrentChatTarget] = useState('');

    useEffect(() => {
        setCandidates(getCandidates());
    }, []);

    const handleChat = (name: string) => {
        setCurrentChatTarget(name);
        setIsChatOpen(true);
    };

    return (
        <div className="container mx-auto px-6 py-8">
            {/* 商务风头部与搜索 */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-white p-6 rounded-2xl shadow-sm border border-teal-50">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">牛人大厅 / 银发人才库</h1>
                    <p className="text-gray-500">高效寻觅适合您企业的经验长者，降低用工成本</p>
                </div>
                <div className="flex w-full md:w-auto relative">
                    <input
                        type="text"
                        placeholder="搜索技能标签，如：绿化、保洁、会厨艺..."
                        className="w-full md:w-96 pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                    />
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <button className="ml-3 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors">
                        搜索
                    </button>
                </div>
            </div>

            {/* 履历网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map(candidate => (
                    <div key={candidate.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-teal-300 hover:shadow-lg transition-all flex flex-col h-full group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-4 items-center">
                                <img src={candidate.avatar} alt="头像" className="w-16 h-16 rounded-full bg-teal-50 object-cover" />
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                                        {candidate.name}
                                    </h3>
                                    <div className="flex gap-2 text-sm text-gray-500 mt-1">
                                        <span>{candidate.age} 岁</span>
                                        <span className="text-gray-300">|</span>
                                        <span>{candidate.gender}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-teal-600">{candidate.expectedSalary}</div>
                                <div className="text-xs text-gray-400 mt-1">期望薪资</div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            {/* 健康标签 */}
                            <div>
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                                    <HeartPulse className="w-4 h-4 text-red-400" /> 身体状况评价
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {candidate.healthTags?.length ? candidate.healthTags.map(tag => (
                                        <span key={tag} className="px-2.5 py-1 bg-red-50 text-red-700 rounded text-sm border border-red-100">
                                            {tag}
                                        </span>
                                    )) : <span className="text-sm text-gray-400">未填写</span>}
                                </div>
                            </div>

                            {/* 技能标签 */}
                            <div>
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                                    <Wrench className="w-4 h-4 text-blue-400" /> 技能特长
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {candidate.skillTags?.length ? candidate.skillTags.map(tag => (
                                        <span key={tag} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-sm border border-blue-100">
                                            {tag}
                                        </span>
                                    )) : <span className="text-sm text-gray-400">未填写</span>}
                                </div>
                            </div>

                            {/* 自我介绍截断 */}
                            <div className="pt-2">
                                <p className="text-sm text-gray-600 line-clamp-2 bg-gray-50 p-2 rounded border border-gray-100/50">
                                    {candidate.desc || "长者暂未留下自我介绍"}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => handleChat(candidate.name)}
                            className="mt-6 w-full py-3 bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors border border-teal-100 hover:border-transparent"
                        >
                            <MessageSquareText className="w-5 h-5" />
                            打招呼
                        </button>
                    </div>
                ))}
            </div>

            <ChatWindow
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                targetName={currentChatTarget}
                appMode="b-end"
            />
        </div>
    );
}
