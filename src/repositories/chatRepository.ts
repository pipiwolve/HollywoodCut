import { createLocalBox } from './localBox';
import type { ChatMessage, ChatStateSnapshot, Conversation, ConversationScenarioState } from '../types/domain';

const STORAGE_KEY_CHAT = 'zhilinghui_chat_state';

function normalizeConversation(input: Partial<Conversation> & Pick<Conversation, 'id' | 'appMode' | 'sourceType' | 'sourceId' | 'title' | 'participantName' | 'lastMessagePreview' | 'lastMessageAt' | 'unreadCount'>): Conversation {
    return {
        ...input,
        id: input.id,
        appMode: input.appMode,
        sourceType: input.sourceType,
        sourceId: input.sourceId,
        title: input.title,
        participantName: input.participantName,
        lastMessagePreview: input.lastMessagePreview,
        lastMessageAt: input.lastMessageAt,
        unreadCount: input.unreadCount,
        personaId: input.personaId ?? (input.appMode === 'c-end' ? 'friendly-recruiter' : 'steady-senior-candidate'),
        stage: input.stage ?? 'intro',
        contextTags: Array.isArray(input.contextTags) ? input.contextTags : [],
        lastIntent: input.lastIntent ?? 'greeting',
        demoPriority: typeof input.demoPriority === 'number' ? input.demoPriority : 1,
        meta: input.meta,
    };
}

const chatBox = createLocalBox<ChatStateSnapshot>({
    key: STORAGE_KEY_CHAT,
    version: 2,
    initialValue: () => ({
        conversations: [],
        messagesByConversation: {},
        scenarioStatesByConversation: {},
    }),
    migrate: (raw) => {
        if (typeof raw === 'object' && raw !== null) {
            const candidate = raw as Partial<ChatStateSnapshot>;
            return {
                conversations: Array.isArray(candidate.conversations)
                    ? candidate.conversations
                        .filter((item) => typeof item === 'object' && item !== null)
                        .map((conversation) => normalizeConversation(conversation as Partial<Conversation> & Pick<Conversation, 'id' | 'appMode' | 'sourceType' | 'sourceId' | 'title' | 'participantName' | 'lastMessagePreview' | 'lastMessageAt' | 'unreadCount'>))
                    : [],
                messagesByConversation:
                    typeof candidate.messagesByConversation === 'object' && candidate.messagesByConversation !== null
                        ? candidate.messagesByConversation as Record<string, ChatMessage[]>
                        : {},
                scenarioStatesByConversation:
                    typeof candidate.scenarioStatesByConversation === 'object' && candidate.scenarioStatesByConversation !== null
                        ? candidate.scenarioStatesByConversation as Record<string, ConversationScenarioState>
                        : {},
            };
        }

        return {
            conversations: [],
            messagesByConversation: {},
            scenarioStatesByConversation: {},
        };
    },
});

function sortConversations(conversations: Conversation[]) {
    return [...conversations].sort((a, b) => {
        if (b.demoPriority !== a.demoPriority) {
            return b.demoPriority - a.demoPriority;
        }
        return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
    });
}

export function getChatSnapshot() {
    const snapshot = chatBox.read();
    return {
        conversations: sortConversations(snapshot.conversations.map((conversation) => normalizeConversation(conversation))),
        messagesByConversation: snapshot.messagesByConversation,
        scenarioStatesByConversation: snapshot.scenarioStatesByConversation,
    };
}

export function saveChatSnapshot(snapshot: ChatStateSnapshot) {
    return chatBox.write({
        conversations: sortConversations(snapshot.conversations.map((conversation) => normalizeConversation(conversation))),
        messagesByConversation: snapshot.messagesByConversation,
        scenarioStatesByConversation: snapshot.scenarioStatesByConversation,
    });
}

export function resetChatSnapshot() {
    return chatBox.reset();
}
