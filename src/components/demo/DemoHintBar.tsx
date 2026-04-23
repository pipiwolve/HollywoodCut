import { ChevronLeft, ChevronRight, Lightbulb, LocateFixed, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useDemoStore } from '../../store/useDemoStore';
import { useAppStore } from '../../store/useAppStore';

function routeLabel(pathname: string) {
    if (pathname === '/profile') return '我的微档案';
    if (pathname === '/b-end/workbench') return '发布岗位';
    if (pathname === '/b-end/talents') return '牛人大厅';
    if (pathname === '/b-end/assurance') return '企业信用与保障';
    return '岗位大厅';
}

export default function DemoHintBar() {
    const location = useLocation();
    const appMode = useAppStore((state) => state.appMode);
    const hintsEnabled = useDemoStore((state) => state.hintsEnabled);
    const activePresetId = useDemoStore((state) => state.activePresetId);
    const currentStep = useDemoStore((state) => state.currentStep);
    const steps = useDemoStore((state) => state.steps);
    const previousStep = useDemoStore((state) => state.previousStep);
    const nextStep = useDemoStore((state) => state.nextStep);
    const toggleHints = useDemoStore((state) => state.toggleHints);
    const rerunCurrentStep = useDemoStore((state) => state.rerunCurrentStep);
    const focusCurrentTarget = useDemoStore((state) => state.focusCurrentTarget);
    const activeStep = steps[currentStep] ?? null;
    const progress = activeStep && steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

    if (!hintsEnabled || !activePresetId || !activeStep) {
        return null;
    }

    return (
        <div className="sticky top-20 z-40 border-b border-gray-200/70 bg-white/95 backdrop-blur-md">
            <div className="container mx-auto max-w-6xl px-4 py-3 md:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className={[
                            'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm',
                            appMode === 'c-end' ? 'bg-amber-500' : 'bg-teal-600',
                        ].join(' ')}>
                            {activePresetId === 'ai-chat-showcase' ? <Sparkles className="h-5 w-5" /> : <Lightbulb className="h-5 w-5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                                <span>{activePresetId === 'ai-chat-showcase' ? 'AI Chat Showcase' : 'Defense Director'}</span>
                                <span className="rounded-full border border-gray-200 px-2 py-0.5 text-[10px] text-gray-500">
                                    {appMode === 'c-end' ? '长者版' : '企业版'} / {routeLabel(location.pathname)}
                                </span>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-3">
                                <h3 className="text-lg font-bold text-gray-900">{activeStep.title}</h3>
                                <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white">
                                    第 {currentStep + 1} 步 / {steps.length}
                                </span>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-gray-600">{activeStep.speakerNote}</p>
                            <p className="mt-1 text-xs font-medium text-gray-500">当前建议动作：{activeStep.expectedAction}</p>
                            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={focusCurrentTarget}
                            className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                        >
                            <LocateFixed className="h-4 w-4" />
                            定位高亮
                        </button>
                        <button
                            onClick={rerunCurrentStep}
                            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                        >
                            重跑当前步
                        </button>
                        <button
                            onClick={toggleHints}
                            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                        >
                            关闭提示
                        </button>
                        <button
                            onClick={previousStep}
                            className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            上一步
                        </button>
                        <button
                            onClick={nextStep}
                            className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-gray-800"
                        >
                            下一步
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
