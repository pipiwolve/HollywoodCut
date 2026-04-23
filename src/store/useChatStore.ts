import { create } from 'zustand';
import { scenarioEngine } from '../chat/scenarioEngine';
import { buildConversationId } from '../chat/conversationSeeds';
import { getDemoState, getPresetSteps } from '../repositories/demoRepository';
import { getChatSnapshot, resetChatSnapshot, saveChatSnapshot } from '../repositories/chatRepository';
import type {
    ChatMessage,
    Conversation,
    ConversationScenarioState,
    ConversationSeed,
    ScenarioEngine,
    SummaryCard,
    SuggestionItem,
} from '../types/domain';

interface SeedConversationOptions {
    openShell?: boolean;
    markRead?: boolean;
    initialUnreadCount?: number;
}

interface ChatState {
    engine: ScenarioEngine;
    isShellOpen: boolean;
    activeConversationId: string | null;
    conversations: Conversation[];
    messagesByConversation: Record<string, ChatMessage[]>;
    scenarioStatesByConversation: Record<string, ConversationScenarioState>;
    hydrate: () => void;
    openShell: (conversationId?: string | null) => void;
    closeShell: () => void;
    openConversation: (seed: ConversationSeed) => string;
    seedConversation: (seed: ConversationSeed, options?: SeedConversationOptions) => string;
    setActiveConversation: (conversationId: string) => void;
    markConversationRead: (conversationId: string) => void;
    sendMessage: (conversationId: string, content: string) => Promise<void>;
    resetChat: () => void;
    getSuggestions: (conversationId: string | null) => SuggestionItem[];
    getSummaryCards: (conversationId: string | null) => SummaryCard[];
    getScenarioState: (conversationId: string | null) => ConversationScenarioState | null;
}

const pendingReplyTimers = new Map<string, number>();

function sortConversations(conversations: Conversation[]) {
    return [...conversations].sort((a, b) => {
        if (b.demoPriority !== a.demoPriority) {
            return b.demoPriority - a.demoPriority;
        }
        return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
    });
}

function persistSnapshot(
    conversations: Conversation[],
    messagesByConversation: Record<string, ChatMessage[]>,
    scenarioStatesByConversation: Record<string, ConversationScenarioState>,
) {
    saveChatSnapshot({
        conversations,
        messagesByConversation,
        scenarioStatesByConversation,
    });
}

function createTypingMessage(conversationId: string): ChatMessage {
    return {
        id: `typing-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        conversationId,
        role: 'assistant',
        content: '系统正在综合岗位信息生成回复建议...',
        createdAt: new Date().toISOString(),
        status: 'typing',
        source: 'system',
    };
}

function createUserMessage(conversationId: string, content: string, source: ChatMessage['source']): ChatMessage {
    return {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        conversationId,
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
        status: 'sent',
        source,
    };
}

function upsertConversation(conversations: Conversation[], conversation: Conversation) {
    const existing = conversations.find((item) => item.id === conversation.id);
    if (!existing) {
        return sortConversations([conversation, ...conversations]);
    }

    return sortConversations(
        conversations.map((item) => (item.id === conversation.id ? { ...item, ...conversation } : item)),
    );
}

function ensureConversation(
    state: Pick<ChatState, 'conversations' | 'messagesByConversation' | 'scenarioStatesByConversation' | 'engine'>,
    seed: ConversationSeed,
    options: SeedConversationOptions = {},
) {
    const conversationId = buildConversationId(seed);
    const existingConversation = state.conversations.find((item) => item.id === conversationId);
    const existingMessages = state.messagesByConversation[conversationId] ?? [];
    const existingScenarioState = state.scenarioStatesByConversation[conversationId];
    const bootstrap = state.engine.bootstrap(seed);
    const initialMessages = existingConversation || existingMessages.length > 0 ? existingMessages : bootstrap.initialMessages;
    const latestMessage = initialMessages[initialMessages.length - 1];

    const conversation: Conversation = {
        id: conversationId,
        appMode: seed.appMode,
        sourceType: seed.sourceType,
        sourceId: seed.sourceId,
        title: seed.title,
        participantName: seed.participantName,
        lastMessagePreview: latestMessage?.content ?? existingConversation?.lastMessagePreview ?? '',
        lastMessageAt: latestMessage?.createdAt ?? existingConversation?.lastMessageAt ?? new Date().toISOString(),
        unreadCount: options.markRead ? 0 : existingConversation?.unreadCount ?? options.initialUnreadCount ?? 0,
        personaId: existingConversation?.personaId ?? bootstrap.conversationPatch.personaId,
        stage: existingConversation?.stage ?? bootstrap.conversationPatch.stage,
        contextTags: existingConversation?.contextTags ?? bootstrap.conversationPatch.contextTags,
        lastIntent: existingConversation?.lastIntent ?? bootstrap.conversationPatch.lastIntent,
        demoPriority: existingConversation?.demoPriority ?? bootstrap.conversationPatch.demoPriority,
        meta: seed.meta ?? existingConversation?.meta,
    };

    return {
        conversationId,
        conversation,
        messages: initialMessages,
        scenarioState: existingScenarioState ?? bootstrap.scenarioState,
    };
}

export const useChatStore = create<ChatState>((set, get) => ({
    engine: scenarioEngine,
    isShellOpen: false,
    activeConversationId: null,
    conversations: [],
    messagesByConversation: {},
    scenarioStatesByConversation: {},

    hydrate: () => {
        const snapshot = getChatSnapshot();
        set((state) => ({
            ...state,
            conversations: snapshot.conversations,
            messagesByConversation: snapshot.messagesByConversation,
            scenarioStatesByConversation: snapshot.scenarioStatesByConversation,
        }));
    },

    openShell: (conversationId) => {
        const targetId = conversationId ?? get().activeConversationId ?? get().conversations[0]?.id ?? null;
        set((state) => {
            const nextConversations = targetId
                ? state.conversations.map((conversation) => (
                    conversation.id === targetId
                        ? { ...conversation, unreadCount: 0 }
                        : conversation
                ))
                : state.conversations;

            persistSnapshot(nextConversations, state.messagesByConversation, state.scenarioStatesByConversation);

            return {
                ...state,
                isShellOpen: true,
                activeConversationId: targetId,
                conversations: nextConversations,
            };
        });
    },

    closeShell: () => set((state) => ({ ...state, isShellOpen: false })),

    openConversation: (seed) => get().seedConversation(seed, { openShell: true, markRead: true }),

    seedConversation: (seed, options = {}) => {
        const { conversationId, conversation, messages, scenarioState } = ensureConversation(get(), seed, options);

        set((state) => {
            const nextMessages = {
                ...state.messagesByConversation,
                [conversationId]: messages,
            };
            const nextScenarios = {
                ...state.scenarioStatesByConversation,
                [conversationId]: scenarioState,
            };
            const nextConversations = upsertConversation(state.conversations, conversation);

            persistSnapshot(nextConversations, nextMessages, nextScenarios);

            return {
                ...state,
                isShellOpen: options.openShell ? true : state.isShellOpen,
                activeConversationId: options.openShell ? conversationId : state.activeConversationId,
                conversations: nextConversations,
                messagesByConversation: nextMessages,
                scenarioStatesByConversation: nextScenarios,
            };
        });

        if (options.markRead) {
            get().markConversationRead(conversationId);
        }

        return conversationId;
    },

    setActiveConversation: (conversationId) => {
        set((state) => {
            const nextConversations = state.conversations.map((conversation) => (
                conversation.id === conversationId
                    ? { ...conversation, unreadCount: 0 }
                    : conversation
            ));

            persistSnapshot(nextConversations, state.messagesByConversation, state.scenarioStatesByConversation);

            return {
                ...state,
                activeConversationId: conversationId,
                conversations: nextConversations,
            };
        });
    },

    markConversationRead: (conversationId) => {
        set((state) => {
            const nextConversations = state.conversations.map((conversation) => (
                conversation.id === conversationId
                    ? { ...conversation, unreadCount: 0 }
                    : conversation
            ));

            persistSnapshot(nextConversations, state.messagesByConversation, state.scenarioStatesByConversation);

            return {
                ...state,
                conversations: nextConversations,
            };
        });
    },

    sendMessage: async (conversationId, content) => {
        const trimmed = content.trim();
        if (!trimmed) {
            return;
        }

        const currentSuggestions = get().getSuggestions(conversationId).map((item) => item.label);
        const userMessage = createUserMessage(conversationId, trimmed, currentSuggestions.includes(trimmed) ? 'suggestion' : 'mock');
        const typingMessage = createTypingMessage(conversationId);
        let messageHistory: ChatMessage[] = [];
        let targetConversation: Conversation | undefined;
        let targetScenarioState: ConversationScenarioState | undefined;

        set((state) => {
            targetConversation = state.conversations.find((conversation) => conversation.id === conversationId);
            targetScenarioState = state.scenarioStatesByConversation[conversationId];
            messageHistory = [...(state.messagesByConversation[conversationId] ?? []), userMessage, typingMessage];

            const nextMessages = {
                ...state.messagesByConversation,
                [conversationId]: messageHistory,
            };
            const nextConversations = sortConversations(
                state.conversations.map((conversation) => (
                    conversation.id === conversationId
                        ? {
                            ...conversation,
                            lastMessagePreview: trimmed,
                            lastMessageAt: userMessage.createdAt,
                            unreadCount: 0,
                        }
                        : conversation
                )),
            );

            persistSnapshot(nextConversations, nextMessages, state.scenarioStatesByConversation);

            return {
                ...state,
                conversations: nextConversations,
                messagesByConversation: nextMessages,
            };
        });

        if (!targetConversation) {
            return;
        }

        const demoState = getDemoState();
        const activeDemoStepId = demoState.activePresetId ? getPresetSteps(demoState.activePresetId)[demoState.currentStep]?.id ?? null : null;
        const result = await get().engine.advance({
            conversation: targetConversation,
            messages: messageHistory.filter((message) => message.status !== 'typing'),
            latestUserMessage: userMessage,
            scenarioState: targetScenarioState,
            activeDemoStepId,
        });

        const timerId = window.setTimeout(() => {
            set((state) => {
                const currentMessages = state.messagesByConversation[conversationId] ?? [];
                const replyMessage: ChatMessage = {
                    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                    conversationId,
                    role: 'assistant',
                    content: result.reply.content,
                    createdAt: new Date().toISOString(),
                    status: 'sent',
                    source: result.reply.source,
                    intent: result.reply.intent,
                    highlights: result.reply.highlights,
                };

                const nextConversationMessages = currentMessages.map((message) => (
                    message.id === typingMessage.id ? replyMessage : message
                ));
                const isActiveConversation = state.isShellOpen && state.activeConversationId === conversationId;
                const nextConversations = sortConversations(
                    state.conversations.map((conversation) => (
                        conversation.id === conversationId
                            ? {
                                ...conversation,
                                ...result.conversationPatch,
                                lastMessagePreview: result.reply.content,
                                lastMessageAt: replyMessage.createdAt,
                                unreadCount: isActiveConversation ? 0 : conversation.unreadCount + 1,
                            }
                            : conversation
                    )),
                );
                const nextMessages = {
                    ...state.messagesByConversation,
                    [conversationId]: nextConversationMessages,
                };
                const nextScenarios = {
                    ...state.scenarioStatesByConversation,
                    [conversationId]: result.scenarioState,
                };

                persistSnapshot(nextConversations, nextMessages, nextScenarios);
                pendingReplyTimers.delete(typingMessage.id);

                return {
                    ...state,
                    conversations: nextConversations,
                    messagesByConversation: nextMessages,
                    scenarioStatesByConversation: nextScenarios,
                };
            });
        }, result.reply.delayMs ?? 1100);

        pendingReplyTimers.set(typingMessage.id, timerId);
    },

    resetChat: () => {
        pendingReplyTimers.forEach((timerId) => {
            window.clearTimeout(timerId);
        });
        pendingReplyTimers.clear();
        resetChatSnapshot();
        set((state) => ({
            ...state,
            isShellOpen: false,
            activeConversationId: null,
            conversations: [],
            messagesByConversation: {},
            scenarioStatesByConversation: {},
        }));
    },

    getSuggestions: (conversationId) => {
        if (!conversationId) {
            return [];
        }
        const state = get();
        const conversation = state.conversations.find((item) => item.id === conversationId);
        if (!conversation) {
            return [];
        }
        const messages = state.messagesByConversation[conversationId] ?? [];
        return state.engine.suggest({
            conversation,
            messages,
            scenarioState: state.scenarioStatesByConversation[conversationId],
            latestUserMessage: [...messages].reverse().find((message) => message.role === 'user'),
        });
    },

    getSummaryCards: (conversationId) => {
        if (!conversationId) {
            return [];
        }
        const state = get();
        const conversation = state.conversations.find((item) => item.id === conversationId);
        if (!conversation) {
            return [];
        }
        const messages = state.messagesByConversation[conversationId] ?? [];
        return state.engine.summarize({
            conversation,
            messages,
            scenarioState: state.scenarioStatesByConversation[conversationId],
            latestUserMessage: [...messages].reverse().find((message) => message.role === 'user'),
        });
    },

    getScenarioState: (conversationId) => {
        if (!conversationId) {
            return null;
        }
        return get().scenarioStatesByConversation[conversationId] ?? null;
    },
}));

if (typeof window !== 'undefined') {
    useChatStore.getState().hydrate();
}
