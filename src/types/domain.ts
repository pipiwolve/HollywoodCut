export type AppMode = 'c-end' | 'b-end';
export type SourceType = 'job' | 'candidate' | 'system';
export type ChatRole = 'user' | 'assistant' | 'system';
export type ChatMessageStatus = 'sending' | 'sent' | 'typing' | 'failed';
export type MessageSource = 'mock' | 'system' | 'suggestion';
export type ConversationStage = 'intro' | 'discovery' | 'fit' | 'salary' | 'schedule' | 'trial' | 'conversion';
export type IntentKind = 'greeting' | 'salary' | 'schedule' | 'trial' | 'skills' | 'location' | 'welfare' | 'safety' | 'availability' | 'experience' | 'fit' | 'generic';
export type SuggestionCategory = 'next-question' | 'showcase' | 'conversion';
export type HighlightTone = 'neutral' | 'positive' | 'caution';
export type DemoCompletionRuleType = 'manual' | 'target-visible' | 'conversation-open';

export interface Job {
    id: string;
    title: string;
    company: string;
    salary: string;
    location: string;
    matchRate: number;
    tags: string[];
    desc: string;
    createdAt: string;
}

export interface ResumeDraft {
    name: string;
    age: string;
    gender: string;
    expectedSalary: string;
    healthTags: string[];
    skillTags: string[];
    desc: string;
}

export interface Candidate extends ResumeDraft {
    id: string;
    avatar: string;
    isSelf?: boolean;
}

export interface MessageHighlight {
    label: string;
    value?: string;
    tone?: HighlightTone;
}

export interface SummaryCard {
    id: string;
    title: string;
    value: string;
    tone?: HighlightTone;
}

export interface SuggestionItem {
    id: string;
    label: string;
    category: SuggestionCategory;
    intent: IntentKind;
    reason: string;
}

export interface Conversation {
    id: string;
    appMode: AppMode;
    sourceType: SourceType;
    sourceId: string;
    title: string;
    participantName: string;
    lastMessagePreview: string;
    lastMessageAt: string;
    unreadCount: number;
    personaId: string;
    stage: ConversationStage;
    contextTags: string[];
    lastIntent: IntentKind;
    demoPriority: number;
    meta?: Record<string, unknown>;
}

export interface ChatMessage {
    id: string;
    conversationId: string;
    role: ChatRole;
    content: string;
    createdAt: string;
    status: ChatMessageStatus;
    source?: MessageSource;
    intent?: IntentKind;
    highlights?: MessageHighlight[];
}

export interface ConversationSeed {
    appMode: AppMode;
    sourceType: SourceType;
    sourceId: string;
    title: string;
    participantName: string;
    meta?: Record<string, unknown>;
}

export interface ChatProviderReply {
    content: string;
    delayMs?: number;
    intent?: IntentKind;
    highlights?: MessageHighlight[];
    source?: MessageSource;
}

export interface ConversationScenarioState {
    conversationId: string;
    stage: ConversationStage;
    visitedIntents: IntentKind[];
    recommendedNextActions: SuggestionItem[];
    focusTopics: string[];
    summaryCards: SummaryCard[];
}

export interface ScenarioEngineContext {
    conversation: Conversation;
    messages: ChatMessage[];
    scenarioState?: ConversationScenarioState;
    latestUserMessage?: ChatMessage;
    activeDemoStepId?: string | null;
}

export interface ScenarioBootstrap {
    initialMessages: ChatMessage[];
    conversationPatch: Pick<Conversation, 'personaId' | 'stage' | 'contextTags' | 'lastIntent' | 'demoPriority'>;
    scenarioState: ConversationScenarioState;
}

export interface ScenarioAdvanceResult {
    reply: ChatProviderReply;
    conversationPatch: Partial<Pick<Conversation, 'stage' | 'contextTags' | 'lastIntent' | 'demoPriority'>>;
    scenarioState: ConversationScenarioState;
}

export interface PersonaProfile {
    id: string;
    mode: AppMode;
    tone: string;
    goals: string[];
    knowledge: string[];
    preferredTopics: IntentKind[];
    objectionPatterns: string[];
}

export interface ScenarioEngine {
    bootstrap: (seed: ConversationSeed) => ScenarioBootstrap;
    advance: (context: ScenarioEngineContext) => Promise<ScenarioAdvanceResult>;
    suggest: (context: ScenarioEngineContext) => SuggestionItem[];
    summarize: (context: ScenarioEngineContext) => SummaryCard[];
}

export interface ChatStateSnapshot {
    conversations: Conversation[];
    messagesByConversation: Record<string, ChatMessage[]>;
    scenarioStatesByConversation: Record<string, ConversationScenarioState>;
}

export interface DemoPresetDescriptor {
    id: string;
    label: string;
    description: string;
}

export type DemoAutoAction =
    | { type: 'set-mode'; mode: AppMode; delayMs?: number }
    | { type: 'navigate'; route: string; delayMs?: number }
    | { type: 'prefill-resume'; delayMs?: number }
    | { type: 'publish-demo-job'; delayMs?: number }
    | { type: 'open-chat'; sourceType: 'job' | 'candidate'; sourceId?: string; demoScene?: string; delayMs?: number }
    | { type: 'focus-target'; targetKey: string; delayMs?: number };

export interface DemoCompletionRule {
    type: DemoCompletionRuleType;
}

export interface DemoStepDefinition {
    id: string;
    route: string;
    targetKey: string;
    title: string;
    speakerNote: string;
    expectedAction: string;
    autoActions: DemoAutoAction[];
    completionRule: DemoCompletionRule;
    canAutoAdvance: boolean;
}

export interface DemoPersistedState {
    activePresetId: string | null;
    currentStep: number;
    hintsEnabled: boolean;
    lastAppliedAt: string | null;
}
