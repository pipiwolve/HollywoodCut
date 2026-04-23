import { createLocalBox } from './localBox';
import type { DemoPersistedState, DemoPresetDescriptor, DemoStepDefinition } from '../types/domain';

const STORAGE_KEY_DEMO = 'zhilinghui_demo_state';

const defaultDemoState: DemoPersistedState = {
    activePresetId: null,
    currentStep: 0,
    hintsEnabled: true,
    lastAppliedAt: null,
};

const demoBox = createLocalBox<DemoPersistedState>({
    key: STORAGE_KEY_DEMO,
    version: 2,
    initialValue: () => defaultDemoState,
    migrate: (raw) => {
        if (typeof raw === 'object' && raw !== null) {
            const candidate = raw as Partial<DemoPersistedState>;
            const activePresetId = candidate.activePresetId === 'chat-showcase' ? 'ai-chat-showcase' : candidate.activePresetId;
            return {
                activePresetId: typeof activePresetId === 'string' ? activePresetId : null,
                currentStep: typeof candidate.currentStep === 'number' ? candidate.currentStep : 0,
                hintsEnabled: typeof candidate.hintsEnabled === 'boolean' ? candidate.hintsEnabled : true,
                lastAppliedAt: typeof candidate.lastAppliedAt === 'string' ? candidate.lastAppliedAt : null,
            };
        }
        return defaultDemoState;
    },
});

export const demoPresets: DemoPresetDescriptor[] = [
    {
        id: 'defense-flow',
        label: '三分钟答辩',
        description: '围绕双端切换、简历同步、岗位发布和聊天闭环的一条完整导演剧本。',
    },
    {
        id: 'ai-chat-showcase',
        label: 'AI 聊天压轴',
        description: '直接进入一条多轮上下文会话，展示建议追问、识别关注点和试岗推进。',
    },
];

const presetSteps: Record<string, DemoStepDefinition[]> = {
    'defense-flow': [
        {
            id: 'defense-hero',
            route: '/',
            targetKey: 'job-hall-hero',
            title: '适老化岗位大厅',
            speakerNote: '先强调大字号、高对比、就近岗位和纯前端本地稳定性，让评委先建立“这个 Demo 很稳”的预期。',
            expectedAction: '口述适老化设计与双端闭环背景',
            autoActions: [
                { type: 'set-mode', mode: 'c-end' },
                { type: 'navigate', route: '/' },
                { type: 'focus-target', targetKey: 'job-hall-hero', delayMs: 150 },
            ],
            completionRule: { type: 'target-visible' },
            canAutoAdvance: true,
        },
        {
            id: 'defense-resume',
            route: '/profile',
            targetKey: 'resume-editor',
            title: '微档案快速生成',
            speakerNote: '切到微档案后，展示标签式输入、语音录入和一键保存，同时说明保存后会实时同步到企业版。',
            expectedAction: '展示标签选择、语音按钮和保存动作',
            autoActions: [
                { type: 'set-mode', mode: 'c-end' },
                { type: 'navigate', route: '/profile' },
                { type: 'prefill-resume' },
                { type: 'focus-target', targetKey: 'resume-save-button', delayMs: 180 },
            ],
            completionRule: { type: 'target-visible' },
            canAutoAdvance: true,
        },
        {
            id: 'defense-talents',
            route: '/b-end/talents',
            targetKey: 'talent-hall-self-card',
            title: '企业版实时看到同步简历',
            speakerNote: '切到企业版后，直接指出刚刚保存的长者简历已经出现在人才库里，证明这不是静态演示图。',
            expectedAction: '展示同步后的“我的简历”卡片',
            autoActions: [
                { type: 'set-mode', mode: 'b-end' },
                { type: 'navigate', route: '/b-end/talents' },
                { type: 'focus-target', targetKey: 'talent-hall-self-card', delayMs: 220 },
            ],
            completionRule: { type: 'target-visible' },
            canAutoAdvance: true,
        },
        {
            id: 'defense-workbench',
            route: '/b-end/workbench',
            targetKey: 'workbench-form',
            title: '发布岗位形成双端闭环',
            speakerNote: '在发布岗位页说明：企业侧只要填好岗位，长者端岗位大厅会立刻看到，闭环就在现场发生。',
            expectedAction: '展示工作台表单和岗位预览',
            autoActions: [
                { type: 'set-mode', mode: 'b-end' },
                { type: 'navigate', route: '/b-end/workbench' },
                { type: 'publish-demo-job' },
                { type: 'focus-target', targetKey: 'workbench-preview', delayMs: 220 },
            ],
            completionRule: { type: 'target-visible' },
            canAutoAdvance: true,
        },
        {
            id: 'defense-chat',
            route: '/',
            targetKey: 'chat-shell',
            title: '统一消息中心与智能沟通压轴',
            speakerNote: '最后回到长者版直接打开聊天，让评委看到会话会保留、能给建议追问，还会把薪资与排班信息提炼成摘要卡。',
            expectedAction: '打开聊天并展示建议追问、识别关注点和试岗推进',
            autoActions: [
                { type: 'set-mode', mode: 'c-end' },
                { type: 'navigate', route: '/' },
                { type: 'open-chat', sourceType: 'job', delayMs: 120 },
                { type: 'focus-target', targetKey: 'chat-insights', delayMs: 320 },
            ],
            completionRule: { type: 'conversation-open' },
            canAutoAdvance: true,
        },
    ],
    'ai-chat-showcase': [
        {
            id: 'ai-chat-entry',
            route: '/',
            targetKey: 'chat-shell',
            title: 'AI 感聊天线程',
            speakerNote: '这个预置会直接打开一条已经识别多轮上下文的示例会话，让评委第一眼就看到“这不像写死回复”。',
            expectedAction: '展示多轮上下文会话和统一消息中心',
            autoActions: [
                { type: 'set-mode', mode: 'c-end' },
                { type: 'navigate', route: '/' },
                { type: 'open-chat', sourceType: 'job', demoScene: 'ai-chat-showcase', delayMs: 80 },
                { type: 'focus-target', targetKey: 'chat-shell', delayMs: 260 },
            ],
            completionRule: { type: 'conversation-open' },
            canAutoAdvance: true,
        },
        {
            id: 'ai-chat-insights',
            route: '/',
            targetKey: 'chat-insights',
            title: '识别关注点与摘要卡',
            speakerNote: '重点解释系统会把聊天里最关键的信息抽出来，比如薪资、排班、距离和推进状态，这就是“像 AI”的来源。',
            expectedAction: '展示摘要卡与已识别关注点',
            autoActions: [
                { type: 'focus-target', targetKey: 'chat-insights' },
            ],
            completionRule: { type: 'target-visible' },
            canAutoAdvance: true,
        },
        {
            id: 'ai-chat-suggestions',
            route: '/',
            targetKey: 'chat-suggestions',
            title: '推荐追问与推进动作',
            speakerNote: '最后展示建议区的三类建议：下一句怎么问、适合展示的亮点问题、以及推进到试岗/电话沟通的话术。',
            expectedAction: '点击建议追问继续推进会话',
            autoActions: [
                { type: 'focus-target', targetKey: 'chat-suggestions' },
            ],
            completionRule: { type: 'target-visible' },
            canAutoAdvance: true,
        },
    ],
};

export function getPresetSteps(presetId: string | null) {
    return presetId ? presetSteps[presetId] ?? [] : [];
}

export function getDemoState() {
    return demoBox.read();
}

export function saveDemoState(state: DemoPersistedState) {
    return demoBox.write(state);
}

export function resetDemoState() {
    return demoBox.write(defaultDemoState);
}
