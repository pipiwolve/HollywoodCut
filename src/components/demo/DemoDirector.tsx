import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createCandidateConversationSeed, createJobConversationSeed } from '../../chat/conversationSeeds';
import { demoTargetRegistry } from '../../demo/targetRegistry';
import { useAppStore } from '../../store/useAppStore';
import { useChatStore } from '../../store/useChatStore';
import { useDataStore } from '../../store/useDataStore';
import { useDemoStore } from '../../store/useDemoStore';
import DemoSpotlight from './DemoSpotlight';

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

async function focusTargetWhenReady(targetKey: string, attempts = 12, intervalMs = 120) {
    for (let attempt = 0; attempt < attempts; attempt += 1) {
        const target = demoTargetRegistry.getTargetElement(targetKey);
        if (target) {
            demoTargetRegistry.scrollToTarget(targetKey);
            await wait(80);
            demoTargetRegistry.focusTarget(targetKey);
            return true;
        }
        await wait(intervalMs);
    }
    return false;
}

export default function DemoDirector() {
    const navigate = useNavigate();
    const location = useLocation();
    const activePresetId = useDemoStore((state) => state.activePresetId);
    const currentStep = useDemoStore((state) => state.currentStep);
    const steps = useDemoStore((state) => state.steps);
    const actionRunToken = useDemoStore((state) => state.actionRunToken);
    const focusToken = useDemoStore((state) => state.focusToken);
    const hintsEnabled = useDemoStore((state) => state.hintsEnabled);

    const activeStep = useMemo(() => steps[currentStep] ?? null, [currentStep, steps]);
    const lastHandledActionRef = useRef<string | null>(null);
    const lastHandledFocusRef = useRef<string | null>(null);

    useEffect(() => {
        if (!activePresetId || !activeStep) {
            lastHandledActionRef.current = null;
            return;
        }

        const signature = `${activePresetId}:${activeStep.id}:${actionRunToken}`;
        if (lastHandledActionRef.current === signature) {
            return;
        }
        lastHandledActionRef.current = signature;

        let cancelled = false;

        const runActions = async () => {
            for (const action of activeStep.autoActions) {
                if (cancelled) {
                    return;
                }
                if (action.delayMs) {
                    await wait(action.delayMs);
                }

                switch (action.type) {
                    case 'set-mode':
                        useAppStore.getState().setAppMode(action.mode);
                        break;
                    case 'navigate':
                        if (location.pathname !== action.route) {
                            navigate(action.route);
                            await wait(180);
                        }
                        break;
                    case 'prefill-resume':
                        useDataStore.getState().prefillDemoResume();
                        break;
                    case 'publish-demo-job':
                        useDataStore.getState().publishDemoJob();
                        break;
                    case 'open-chat': {
                        const appState = useDataStore.getState();
                        const chatStore = useChatStore.getState();
                        if (action.sourceType === 'job') {
                            const job = action.sourceId
                                ? appState.jobs.find((item) => item.id === action.sourceId) ?? appState.jobs[0]
                                : appState.jobs[0] ?? appState.publishDemoJob();
                            if (job) {
                                chatStore.openConversation(createJobConversationSeed(job, {
                                    demoScene: action.demoScene,
                                    demoPriority: action.demoScene === 'ai-chat-showcase' ? 12 : 8,
                                }));
                            }
                        } else {
                            const candidate = action.sourceId
                                ? appState.candidates.find((item) => item.id === action.sourceId) ?? appState.candidates[0]
                                : appState.candidates[0] ?? appState.prefillDemoResume();
                            if (candidate) {
                                chatStore.openConversation(createCandidateConversationSeed(candidate, { demoPriority: 6 }));
                            }
                        }
                        await wait(180);
                        break;
                    }
                    case 'focus-target':
                        await focusTargetWhenReady(action.targetKey);
                        break;
                }
            }
        };

        void runActions();

        return () => {
            cancelled = true;
        };
    }, [actionRunToken, activePresetId, activeStep, location.pathname, navigate]);

    useEffect(() => {
        if (!activePresetId || !activeStep) {
            lastHandledFocusRef.current = null;
            return;
        }

        const signature = `${activePresetId}:${activeStep.id}:${focusToken}`;
        if (lastHandledFocusRef.current === signature) {
            return;
        }
        lastHandledFocusRef.current = signature;

        const timeout = window.setTimeout(() => {
            void focusTargetWhenReady(activeStep.targetKey);
        }, 120);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [activePresetId, activeStep, focusToken]);

    return (
        <DemoSpotlight
            targetKey={activeStep?.targetKey ?? null}
            label={activeStep?.title}
            visible={Boolean(activePresetId && hintsEnabled && activeStep)}
        />
    );
}
