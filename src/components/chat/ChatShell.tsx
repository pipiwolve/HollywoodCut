import { useMemo } from 'react';
import ConversationList from './ConversationList';
import MessagePane from './MessagePane';
import { useChatStore } from '../../store/useChatStore';
import { useDemoTarget } from '../../demo/useDemoTarget';

export default function ChatShell() {
    const isShellOpen = useChatStore((state) => state.isShellOpen);
    const activeConversationId = useChatStore((state) => state.activeConversationId);
    const conversations = useChatStore((state) => state.conversations);
    const messagesByConversation = useChatStore((state) => state.messagesByConversation);
    const closeShell = useChatStore((state) => state.closeShell);
    const openShell = useChatStore((state) => state.openShell);
    const setActiveConversation = useChatStore((state) => state.setActiveConversation);
    const sendMessage = useChatStore((state) => state.sendMessage);
    const getSuggestions = useChatStore((state) => state.getSuggestions);
    const getSummaryCards = useChatStore((state) => state.getSummaryCards);
    const getScenarioState = useChatStore((state) => state.getScenarioState);
    const shellTargetRef = useDemoTarget<HTMLDivElement>('chat-shell');

    const activeConversation = useMemo(
        () => conversations.find((conversation) => conversation.id === activeConversationId) ?? null,
        [activeConversationId, conversations],
    );

    const activeMessages = activeConversationId ? messagesByConversation[activeConversationId] ?? [] : [];
    const suggestions = getSuggestions(activeConversationId);
    const summaryCards = getSummaryCards(activeConversationId);
    const scenarioState = getScenarioState(activeConversationId);

    if (!isShellOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[120] flex items-end justify-end bg-slate-900/30 backdrop-blur-sm sm:items-center sm:justify-center lg:justify-end lg:p-6">
            <button className="absolute inset-0" aria-label="关闭聊天层" onClick={closeShell} />
            <div ref={shellTargetRef} className="relative z-10 flex h-[100dvh] w-full overflow-hidden bg-white shadow-2xl sm:h-[88vh] sm:max-h-[760px] sm:w-[92vw] sm:max-w-6xl sm:rounded-[32px]">
                <aside className="hidden w-[320px] shrink-0 border-r border-gray-100 bg-gray-50 lg:flex lg:flex-col">
                    <div className="border-b border-gray-100 px-5 py-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Conversation Hub</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-900">消息中心</h2>
                        <p className="mt-2 text-sm leading-6 text-gray-500">跨长者端与企业端统一留存，每次重新打开都会回到原会话。</p>
                    </div>
                    <ConversationList
                        conversations={conversations}
                        activeConversationId={activeConversationId}
                        onSelect={setActiveConversation}
                    />
                </aside>

                <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 lg:hidden">
                        <div>
                            <p className="text-sm font-semibold text-gray-900">消息中心</p>
                            <p className="text-xs text-gray-500">共 {conversations.length} 个会话</p>
                        </div>
                        {conversations.length > 1 && (
                            <button
                                onClick={() => openShell(conversations[0]?.id ?? null)}
                                className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600"
                            >
                                切换会话
                            </button>
                        )}
                    </div>

                    <div className="border-b border-gray-100 bg-gray-50 px-3 py-3 lg:hidden">
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {conversations.map((conversation) => (
                                <button
                                    key={conversation.id}
                                    onClick={() => setActiveConversation(conversation.id)}
                                    className={[
                                        'whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                                        conversation.id === activeConversationId
                                            ? conversation.appMode === 'c-end'
                                                ? 'bg-amber-500 text-white'
                                                : 'bg-teal-600 text-white'
                                            : 'bg-white text-gray-600 shadow-sm ring-1 ring-gray-200',
                                    ].join(' ')}
                                >
                                    {conversation.participantName}
                                    {conversation.unreadCount > 0 ? ` (${conversation.unreadCount})` : ''}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="min-h-0 flex-1">
                        <MessagePane
                            conversation={activeConversation}
                            messages={activeMessages}
                            suggestions={suggestions}
                            summaryCards={summaryCards}
                            scenarioState={scenarioState}
                            onSend={(content) => activeConversationId ? sendMessage(activeConversationId, content) : Promise.resolve()}
                            onClose={closeShell}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
