import { useMemo, useState } from 'react';
import { HeartPulse, MessageSquareText, Search, Sparkles, Wrench } from 'lucide-react';
import ChatEntry from '../../components/chat/ChatEntry';
import { createCandidateConversationSeed } from '../../chat/conversationSeeds';
import { useDemoTarget } from '../../demo/useDemoTarget';
import { useDataStore } from '../../store/useDataStore';

function normalizeText(value: string) {
    return value.toLowerCase().replace(/\s+/g, '');
}

export default function TalentHall() {
    const candidates = useDataStore((state) => state.candidates);
    const [keyword, setKeyword] = useState('');
    const selfCardTargetRef = useDemoTarget<HTMLDivElement>('talent-hall-self-card');
    const heroTargetRef = useDemoTarget<HTMLDivElement>('talent-hall-hero');

    const filteredCandidates = useMemo(() => {
        if (!keyword.trim()) {
            return candidates;
        }
        const normalizedKeyword = normalizeText(keyword);
        return candidates.filter((candidate) => {
            const searchText = normalizeText([
                candidate.name,
                candidate.gender,
                candidate.expectedSalary,
                candidate.desc,
                ...candidate.healthTags,
                ...candidate.skillTags,
            ].join(' '));
            return searchText.includes(normalizedKeyword);
        });
    }, [candidates, keyword]);

    return (
        <div className="container mx-auto px-6 py-8">
            <div ref={heroTargetRef} className="mb-10 flex flex-col items-center justify-between gap-6 rounded-2xl border border-teal-50 bg-white p-6 shadow-sm md:flex-row">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
                        <Sparkles className="h-3.5 w-3.5" /> 企业版实时人才库
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">牛人大厅 / 银发人才库</h1>
                    <p className="text-gray-500">支持本地即时筛选，长者端保存后的简历会同步出现在这里。</p>
                </div>
                <div className="relative flex w-full md:w-auto">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="搜索技能标签，如：绿化、保洁、会厨艺..."
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 md:w-96"
                    />
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                </div>
            </div>

            {keyword.trim() && (
                <div className="mb-6 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-700">
                    当前关键词“{keyword}”共匹配到 {filteredCandidates.length} 位候选人。
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCandidates.map((candidate) => (
                    <div
                        key={candidate.id}
                        ref={candidate.isSelf ? selfCardTargetRef : undefined}
                        className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-teal-300 hover:shadow-lg"
                    >
                        <div className="mb-6 flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <img src={candidate.avatar} alt="头像" className="h-16 w-16 rounded-full bg-teal-50 object-cover" />
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-teal-700">
                                        {candidate.name}
                                        {candidate.isSelf && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">我的简历</span>}
                                    </h3>
                                    <div className="mt-1 flex gap-2 text-sm text-gray-500">
                                        <span>{candidate.age} 岁</span>
                                        <span className="text-gray-300">|</span>
                                        <span>{candidate.gender}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-teal-600">{candidate.expectedSalary}</div>
                                <div className="mt-1 text-xs text-gray-400">期望薪资</div>
                            </div>
                        </div>

                        {candidate.isSelf && (
                            <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                这张卡是刚刚在长者端保存的档案，评委此时能直观看到双端数据已经同步完成。
                            </div>
                        )}

                        <div className="flex-1 space-y-4">
                            <div>
                                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    <HeartPulse className="h-4 w-4 text-red-400" /> 身体状况评价
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {candidate.healthTags.length > 0 ? candidate.healthTags.map((tag) => (
                                        <span key={tag} className="rounded border border-red-100 bg-red-50 px-2.5 py-1 text-sm text-red-700">
                                            {tag}
                                        </span>
                                    )) : <span className="text-sm text-gray-400">未填写</span>}
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    <Wrench className="h-4 w-4 text-blue-400" /> 技能特长
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {candidate.skillTags.length > 0 ? candidate.skillTags.map((tag) => (
                                        <span key={tag} className="rounded border border-blue-100 bg-blue-50 px-2.5 py-1 text-sm text-blue-700">
                                            {tag}
                                        </span>
                                    )) : <span className="text-sm text-gray-400">未填写</span>}
                                </div>
                            </div>

                            <div className="pt-2">
                                <p className="line-clamp-3 rounded border border-gray-100/50 bg-gray-50 p-3 text-sm leading-6 text-gray-600">
                                    {candidate.desc || '长者暂未留下自我介绍'}
                                </p>
                            </div>
                        </div>

                        <ChatEntry seed={createCandidateConversationSeed(candidate)}>
                            {({ openConversation }) => (
                                <button
                                    onClick={openConversation}
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-teal-100 bg-teal-50 py-3 font-medium text-teal-700 transition-colors hover:border-transparent hover:bg-teal-600 hover:text-white"
                                >
                                    <MessageSquareText className="h-5 w-5" />
                                    打招呼
                                </button>
                            )}
                        </ChatEntry>
                    </div>
                ))}
            </div>

            {filteredCandidates.length === 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center text-gray-500 shadow-sm">
                    没有找到匹配的人才，试试更换关键词，或者先在长者端保存一份新的微档案。
                </div>
            )}
        </div>
    );
}
