import { Briefcase, ChevronRight, MapPin, MessageSquareMore, Sparkles, Target } from 'lucide-react';
import ChatEntry from '../../components/chat/ChatEntry';
import { createJobConversationSeed } from '../../chat/conversationSeeds';
import { useDemoTarget } from '../../demo/useDemoTarget';
import { useDataStore } from '../../store/useDataStore';
import type { Job } from '../../types/domain';

function buildShowcaseReasons(job: Job) {
    const reasons = [`契合度 ${job.matchRate}%`];
    if (job.location.includes('距离')) {
        reasons.push('就近通勤');
    }
    const scheduleTag = job.tags.find((tag) => /(半天|弹性|夜班)/.test(tag));
    if (scheduleTag) {
        reasons.push(scheduleTag);
    }
    const welfareTag = job.tags.find((tag) => /(体检|包吃|宿舍)/.test(tag));
    if (welfareTag) {
        reasons.push(welfareTag);
    }
    return reasons.slice(0, 3);
}

export default function JobHall() {
    const jobs = useDataStore((state) => state.jobs);
    const heroTargetRef = useDemoTarget<HTMLDivElement>('job-hall-hero');
    const primaryActionTargetRef = useDemoTarget<HTMLButtonElement>('job-card-primary-action');

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8">
            <div ref={heroTargetRef} className="mb-10 rounded-[32px] border border-amber-100 bg-white px-6 py-8 text-center shadow-sm">
                <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700">
                    <Sparkles className="h-4 w-4" /> 适老化岗位大厅
                </div>
                <h1 className="mb-4 text-3xl font-bold tracking-wide text-gray-900">为您精选的附近好工作</h1>
                <p className="text-xl text-gray-600">离家近、不费力，老伙伴们都在看</p>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                    这一页既是长者视角的入口，也是导演模式的第一步：用高对比、大字号和就近匹配来先建立“产品可信、演示稳定”的印象。
                </p>
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-amber-100 bg-white px-5 py-5 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-500">Nearby Match</p>
                    <p className="mt-3 text-3xl font-bold text-gray-900">{jobs.length}</p>
                    <p className="mt-2 text-sm leading-6 text-gray-500">本地岗位会从企业端即时同步过来，适合现场演示双端闭环。</p>
                </div>
                <div className="rounded-3xl border border-amber-100 bg-white px-5 py-5 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-500">Quick Story</p>
                    <p className="mt-3 text-lg font-bold text-gray-900">先看岗位，再点沟通</p>
                    <p className="mt-2 text-sm leading-6 text-gray-500">岗位卡片已接入统一消息中心，关闭后再次打开会继续之前的聊天记录。</p>
                </div>
                <div className="rounded-3xl border border-amber-100 bg-white px-5 py-5 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-500">Stable Demo</p>
                    <p className="mt-3 text-lg font-bold text-gray-900">零后端，本地可复位</p>
                    <p className="mt-2 text-sm leading-6 text-gray-500">答辩前可从“演示台”一键重置岗位、简历和会话，不担心网络波动。</p>
                </div>
            </div>

            <div className="space-y-6">
                {jobs.map((job, index) => (
                    <div
                        key={job.id}
                        className="group rounded-3xl border-2 border-transparent bg-white p-6 shadow-sm transition-all hover:border-amber-200 hover:shadow-lg sm:p-8"
                    >
                        <div className="flex flex-col items-start gap-6 sm:flex-row sm:justify-between">
                            <div className="w-full flex-1 text-left">
                                <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                                    <h2 className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-amber-600 sm:text-3xl">
                                        {job.title}
                                    </h2>
                                    <span className="text-2xl font-extrabold text-amber-500 sm:text-3xl">{job.salary}</span>
                                </div>

                                <div className="mb-4 flex flex-wrap gap-2">
                                    {buildShowcaseReasons(job).map((reason) => (
                                        <span key={reason} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                                            {reason}
                                        </span>
                                    ))}
                                </div>

                                <div className="mb-6 flex flex-wrap items-center gap-4 sm:gap-6">
                                    <div className="flex items-center gap-2 text-lg font-medium text-gray-700 sm:text-xl">
                                        <Briefcase className="h-6 w-6 text-gray-400" />
                                        {job.company}
                                    </div>
                                    <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1 text-lg font-medium text-amber-700 sm:text-xl">
                                        <Target className="h-6 w-6 text-amber-500" />
                                        契合度 {job.matchRate}%
                                    </div>
                                    <div className="flex items-center gap-2 text-lg font-medium text-gray-600 sm:text-xl">
                                        <MapPin className="h-6 w-6 text-gray-400" />
                                        {job.location}
                                    </div>
                                </div>

                                <div className="mb-6 flex flex-wrap gap-3">
                                    {job.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full border border-gray-200 bg-gray-100 px-4 py-1.5 text-lg font-medium text-gray-800"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <p className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-xl leading-relaxed text-gray-600">
                                    {job.desc}
                                </p>
                            </div>

                            <div className="mt-4 flex w-full flex-col items-stretch justify-center gap-3 border-t border-gray-100 pt-4 sm:mt-0 sm:w-auto sm:border-0 sm:pt-0">
                                <ChatEntry seed={createJobConversationSeed(job)}>
                                    {({ openConversation }) => (
                                        <button
                                            ref={index === 0 ? primaryActionTargetRef : undefined}
                                            onClick={openConversation}
                                            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-10 py-5 text-2xl font-bold text-white shadow-xl transition-all hover:-translate-y-1 hover:from-amber-600 hover:to-orange-600 hover:shadow-2xl active:scale-95 sm:w-auto sm:py-6"
                                        >
                                            立即沟通
                                            <ChevronRight className="h-8 w-8" />
                                        </button>
                                    )}
                                </ChatEntry>
                                <p className="flex items-center justify-center gap-2 text-sm text-gray-500 sm:justify-start">
                                    <MessageSquareMore className="h-4 w-4" />
                                    再次打开会回到同一会话，不会重新开始
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {jobs.length === 0 && (
                    <div className="py-20 text-center text-xl text-gray-500">
                        暂无岗位数据，您可以切换到企业版发布新岗位，或从演示台一键注入样例岗位。
                    </div>
                )}
            </div>
        </div>
    );
}
