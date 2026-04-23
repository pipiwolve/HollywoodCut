import { CheckCircle2, LocateFixed, PlayCircle, RefreshCcw, Sparkles, Wand2, X } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { useDataStore } from '../../store/useDataStore';
import { useDemoStore } from '../../store/useDemoStore';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils/cn';

export default function DemoPanel() {
    const isPanelOpen = useDemoStore((state) => state.isPanelOpen);
    const closePanel = useDemoStore((state) => state.closePanel);
    const presets = useDemoStore((state) => state.presets);
    const applyPreset = useDemoStore((state) => state.applyPreset);
    const resetDemo = useDemoStore((state) => state.resetDemo);
    const prefillResume = useDemoStore((state) => state.prefillResume);
    const publishSampleJob = useDemoStore((state) => state.publishSampleJob);
    const triggerFirstChat = useDemoStore((state) => state.triggerFirstChat);
    const activePresetId = useDemoStore((state) => state.activePresetId);
    const currentStep = useDemoStore((state) => state.currentStep);
    const steps = useDemoStore((state) => state.steps);
    const setStep = useDemoStore((state) => state.setStep);
    const rerunCurrentStep = useDemoStore((state) => state.rerunCurrentStep);
    const focusCurrentTarget = useDemoStore((state) => state.focusCurrentTarget);
    const hintsEnabled = useDemoStore((state) => state.hintsEnabled);
    const toggleHints = useDemoStore((state) => state.toggleHints);
    const appMode = useAppStore((state) => state.appMode);
    const jobs = useDataStore((state) => state.jobs);
    const candidates = useDataStore((state) => state.candidates);
    const myResume = useDataStore((state) => state.myResume);
    const conversations = useChatStore((state) => state.conversations);
    const activeStep = steps[currentStep] ?? null;

    if (!isPanelOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[110] flex justify-end bg-slate-900/25 backdrop-blur-sm">
            <button className="absolute inset-0" aria-label="关闭演示台" onClick={closePanel} />
            <aside className="relative z-10 flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-gray-200 bg-white shadow-2xl">
                <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 px-6 py-5 backdrop-blur-md">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Demo Control Room</p>
                            <h2 className="mt-2 text-2xl font-bold text-gray-900">演示台</h2>
                            <p className="mt-2 text-sm leading-6 text-gray-500">现在的导演台会驱动页面跳转、数据预置、聊天打开和聚光高亮，尽量减少现场临时失误。</p>
                        </div>
                        <button
                            onClick={closePanel}
                            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                            aria-label="关闭演示台"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="space-y-8 px-6 py-6">
                    <section>
                        <div className="mb-4 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-amber-500" />
                            <h3 className="text-lg font-bold text-gray-900">预置剧本</h3>
                        </div>
                        <div className="space-y-3">
                            {presets.map((preset) => {
                                const isActive = preset.id === activePresetId;
                                return (
                                    <button
                                        key={preset.id}
                                        onClick={() => applyPreset(preset.id)}
                                        className={cn(
                                            'w-full rounded-3xl border px-5 py-4 text-left transition-all',
                                            isActive
                                                ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50',
                                        )}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-base font-bold">{preset.label}</p>
                                                <p className={cn('mt-2 text-sm leading-6', isActive ? 'text-white/80' : 'text-gray-500')}>
                                                    {preset.description}
                                                </p>
                                            </div>
                                            {isActive && <CheckCircle2 className="mt-1 h-5 w-5 shrink-0" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section>
                        <div className="mb-4 flex items-center gap-2">
                            <Wand2 className="h-5 w-5 text-teal-600" />
                            <h3 className="text-lg font-bold text-gray-900">快捷动作</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <button
                                onClick={prefillResume}
                                className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-left transition-colors hover:bg-amber-100"
                            >
                                <p className="text-sm font-bold text-amber-900">预填简历</p>
                                <p className="mt-1 text-xs leading-5 text-amber-700">填入一份适合答辩展示的长者资料。</p>
                            </button>
                            <button
                                onClick={publishSampleJob}
                                className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-4 text-left transition-colors hover:bg-teal-100"
                            >
                                <p className="text-sm font-bold text-teal-900">预发岗位</p>
                                <p className="mt-1 text-xs leading-5 text-teal-700">注入一个高匹配示例岗位，方便切回长者端展示。</p>
                            </button>
                            <button
                                onClick={triggerFirstChat}
                                className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-4 text-left transition-colors hover:bg-indigo-100"
                            >
                                <p className="text-sm font-bold text-indigo-900">触发第一条聊天</p>
                                <p className="mt-1 text-xs leading-5 text-indigo-700">自动打开当前端别最适合展示的那条会话。</p>
                            </button>
                            <button
                                onClick={resetDemo}
                                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-left transition-colors hover:bg-rose-100"
                            >
                                <p className="text-sm font-bold text-rose-900">一键重置</p>
                                <p className="mt-1 text-xs leading-5 text-rose-700">恢复岗位、简历、聊天与导演状态的初始值。</p>
                            </button>
                        </div>
                    </section>

                    {activeStep && (
                        <section className="rounded-3xl border border-gray-200 bg-gray-50 px-5 py-5">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <PlayCircle className="h-5 w-5 text-gray-700" />
                                    <h3 className="text-lg font-bold text-gray-900">当前步骤</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={toggleHints}
                                        className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600"
                                    >
                                        {hintsEnabled ? '关闭提示条' : '恢复提示条'}
                                    </button>
                                    <button
                                        onClick={focusCurrentTarget}
                                        className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600"
                                    >
                                        <LocateFixed className="mr-1 inline-block h-3.5 w-3.5" />定位
                                    </button>
                                    <button
                                        onClick={rerunCurrentStep}
                                        className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600"
                                    >
                                        重跑
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-gray-700">{activeStep.title}</p>
                            <p className="mt-2 text-sm leading-6 text-gray-600">{activeStep.speakerNote}</p>
                            <p className="mt-2 text-xs font-medium text-gray-500">建议动作：{activeStep.expectedAction}</p>
                            <p className="mt-2 text-xs text-gray-500">
                                当前提示状态：{hintsEnabled ? '已开启高亮与导演提示' : '已关闭高亮与导演提示，可在此恢复'}
                            </p>
                        </section>
                    )}

                    <section className="rounded-3xl border border-gray-200 bg-gray-50 px-5 py-5">
                        <div className="mb-4 flex items-center gap-2">
                            <PlayCircle className="h-5 w-5 text-gray-700" />
                            <h3 className="text-lg font-bold text-gray-900">剧本步骤</h3>
                        </div>
                        <div className="space-y-2">
                            {steps.length === 0 ? (
                                <p className="text-sm leading-6 text-gray-500">先选择一个预置剧本，导演层才会开始驱动页面与聚光提示。</p>
                            ) : steps.map((step, index) => (
                                <button
                                    key={step.id}
                                    onClick={() => setStep(index)}
                                    className={cn(
                                        'flex w-full items-start gap-3 rounded-2xl px-4 py-3 text-left transition-colors',
                                        index === currentStep ? 'bg-slate-900 text-white' : 'bg-white hover:bg-gray-100',
                                    )}
                                >
                                    <div className={cn(
                                        'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                                        index === currentStep ? 'bg-white text-slate-900' : 'bg-gray-200 text-gray-700',
                                    )}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{step.title}</p>
                                        <p className={cn('mt-1 text-xs leading-5', index === currentStep ? 'text-white/80' : 'text-gray-500')}>
                                            {step.expectedAction}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold">实时状态</h3>
                            <RefreshCcw className="h-5 w-5 text-white/70" />
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-2xl bg-white/10 px-4 py-3">
                                <p className="text-white/70">当前端别</p>
                                <p className="mt-1 text-lg font-bold">{appMode === 'c-end' ? '长者版' : '企业版'}</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 px-4 py-3">
                                <p className="text-white/70">会话数量</p>
                                <p className="mt-1 text-lg font-bold">{conversations.length}</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 px-4 py-3">
                                <p className="text-white/70">岗位数量</p>
                                <p className="mt-1 text-lg font-bold">{jobs.length}</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 px-4 py-3">
                                <p className="text-white/70">人才数量</p>
                                <p className="mt-1 text-lg font-bold">{candidates.length}</p>
                            </div>
                        </div>
                        <div className="mt-4 rounded-2xl bg-white/10 px-4 py-4 text-sm leading-6 text-white/80">
                            {myResume
                                ? `当前已存在一份本地长者简历：${myResume.name}，可直接切到企业版查看；消息中心已有 ${conversations.length} 条可展示会话。`
                                : '当前还没有保存长者简历，建议先点“预填简历”或进入微档案手动保存。'}
                        </div>
                    </section>
                </div>
            </aside>
        </div>
    );
}
