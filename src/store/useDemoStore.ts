import { create } from 'zustand';
import { createCandidateConversationSeed, createJobConversationSeed } from '../chat/conversationSeeds';
import { demoPresets, getDemoState, getPresetSteps, resetDemoState, saveDemoState } from '../repositories/demoRepository';
import type { DemoPersistedState, DemoPresetDescriptor, DemoStepDefinition } from '../types/domain';
import { useAppStore } from './useAppStore';
import { useChatStore } from './useChatStore';
import { useDataStore } from './useDataStore';

interface DemoState extends DemoPersistedState {
    isPanelOpen: boolean;
    presets: DemoPresetDescriptor[];
    steps: DemoStepDefinition[];
    actionRunToken: number;
    focusToken: number;
    hydrate: () => void;
    openPanel: () => void;
    closePanel: () => void;
    togglePanel: () => void;
    setStep: (step: number) => void;
    nextStep: () => void;
    previousStep: () => void;
    toggleHints: () => void;
    applyPreset: (presetId: string) => void;
    resetDemo: () => void;
    prefillResume: () => void;
    publishSampleJob: () => void;
    triggerFirstChat: () => void;
    rerunCurrentStep: () => void;
    focusCurrentTarget: () => void;
}

function persistDemoState(partial: DemoPersistedState) {
    saveDemoState(partial);
    return partial;
}

function clampStep(step: number, steps: DemoStepDefinition[]) {
    return Math.max(0, Math.min(step, Math.max(steps.length - 1, 0)));
}

function getPresetSeedData(presetId: string) {
    const dataStore = useDataStore.getState();
    const chatStore = useChatStore.getState();

    dataStore.resetCoreData();
    chatStore.resetChat();

    const demoResume = dataStore.prefillDemoResume();
    const demoJob = dataStore.publishDemoJob();

    if (presetId === 'ai-chat-showcase') {
        chatStore.seedConversation(createJobConversationSeed(demoJob, { demoScene: 'ai-chat-showcase', demoPriority: 12 }), { initialUnreadCount: 1 });
        return;
    }

    chatStore.seedConversation(createJobConversationSeed(demoJob, { demoPriority: 8 }), { initialUnreadCount: 1 });
    chatStore.seedConversation(createCandidateConversationSeed(demoResume, { demoPriority: 5 }), { initialUnreadCount: 1 });
}

export const useDemoStore = create<DemoState>((set, get) => ({
    ...getDemoState(),
    isPanelOpen: false,
    presets: demoPresets,
    steps: getPresetSteps(getDemoState().activePresetId),
    actionRunToken: 0,
    focusToken: 0,

    hydrate: () => {
        const persisted = getDemoState();
        set((state) => ({
            ...state,
            ...persisted,
            steps: getPresetSteps(persisted.activePresetId),
        }));
    },

    openPanel: () => set((state) => ({ ...state, isPanelOpen: true })),
    closePanel: () => set((state) => ({ ...state, isPanelOpen: false })),
    togglePanel: () => set((state) => ({ ...state, isPanelOpen: !state.isPanelOpen })),

    setStep: (step) => {
        const steps = get().steps;
        const nextPersisted = persistDemoState({
            ...getDemoState(),
            activePresetId: get().activePresetId,
            currentStep: clampStep(step, steps),
        });
        set((state) => ({
            ...state,
            ...nextPersisted,
            actionRunToken: state.activePresetId ? state.actionRunToken + 1 : state.actionRunToken,
            focusToken: state.activePresetId ? state.focusToken + 1 : state.focusToken,
        }));
    },

    nextStep: () => get().setStep(get().currentStep + 1),
    previousStep: () => get().setStep(get().currentStep - 1),

    toggleHints: () => {
        const nextPersisted = persistDemoState({
            ...getDemoState(),
            activePresetId: get().activePresetId,
            currentStep: get().currentStep,
            hintsEnabled: !get().hintsEnabled,
        });
        set((state) => ({
            ...state,
            ...nextPersisted,
        }));
    },

    applyPreset: (presetId) => {
        getPresetSeedData(presetId);
        useAppStore.getState().setAppMode('c-end');

        const steps = getPresetSteps(presetId);
        const nextPersisted = persistDemoState({
            activePresetId: presetId,
            currentStep: 0,
            hintsEnabled: true,
            lastAppliedAt: new Date().toISOString(),
        });

        set((state) => ({
            ...state,
            ...nextPersisted,
            steps,
            isPanelOpen: true,
            actionRunToken: state.actionRunToken + 1,
            focusToken: state.focusToken + 1,
        }));
    },

    resetDemo: () => {
        useDataStore.getState().resetCoreData();
        useChatStore.getState().resetChat();
        useAppStore.getState().setAppMode('c-end');
        const nextPersisted = resetDemoState();
        set((state) => ({
            ...state,
            ...nextPersisted,
            steps: [],
            actionRunToken: state.actionRunToken + 1,
            focusToken: state.focusToken + 1,
        }));
    },

    prefillResume: () => {
        useDataStore.getState().prefillDemoResume();
    },

    publishSampleJob: () => {
        useDataStore.getState().publishDemoJob();
    },

    triggerFirstChat: () => {
        const chatStore = useChatStore.getState();
        const appMode = useAppStore.getState().appMode;
        const dataStore = useDataStore.getState();

        if (appMode === 'c-end') {
            const job = dataStore.jobs[0] ?? dataStore.publishDemoJob();
            chatStore.openConversation(createJobConversationSeed(job, {
                demoScene: get().activePresetId === 'ai-chat-showcase' ? 'ai-chat-showcase' : undefined,
                demoPriority: get().activePresetId === 'ai-chat-showcase' ? 12 : 6,
            }));
            return;
        }

        const candidate = dataStore.candidates[0] ?? dataStore.prefillDemoResume();
        chatStore.openConversation(createCandidateConversationSeed(candidate, { demoPriority: 6 }));
    },

    rerunCurrentStep: () => {
        set((state) => ({
            ...state,
            actionRunToken: state.actionRunToken + 1,
        }));
    },

    focusCurrentTarget: () => {
        set((state) => ({
            ...state,
            focusToken: state.focusToken + 1,
        }));
    },
}));

if (typeof window !== 'undefined') {
    useDemoStore.getState().hydrate();
}
