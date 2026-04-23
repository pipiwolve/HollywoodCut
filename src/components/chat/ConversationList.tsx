import { MessageSquareText } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { Conversation } from '../../types/domain';

interface ConversationListProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelect: (conversationId: string) => void;
}

function formatConversationTime(value: string) {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? ''
        : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function stageLabel(stage: Conversation['stage']) {
    switch (stage) {
        case 'salary':
            return '薪资';
        case 'schedule':
            return '排班';
        case 'trial':
        case 'conversion':
            return '推进';
        case 'fit':
            return '匹配';
        case 'discovery':
            return '了解';
        default:
            return '破冰';
    }
}

export default function ConversationList({ conversations, activeConversationId, onSelect }: ConversationListProps) {
    if (conversations.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center text-gray-500">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                    <MessageSquareText className="h-7 w-7" />
                </div>
                <p className="text-base font-semibold text-gray-700">还没有历史会话</p>
                <p className="mt-2 text-sm leading-6">从岗位卡片、人才卡片或右上角消息中心进入后，会话会在这里持续保留。</p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col gap-3 overflow-y-auto px-3 py-3">
            {conversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;
                const isCEnd = conversation.appMode === 'c-end';
                return (
                    <button
                        key={conversation.id}
                        onClick={() => onSelect(conversation.id)}
                        className={cn(
                            'rounded-2xl border px-4 py-4 text-left transition-all',
                            isActive
                                ? isCEnd
                                    ? 'border-amber-200 bg-amber-50 shadow-sm'
                                    : 'border-teal-200 bg-teal-50 shadow-sm'
                                : 'border-transparent bg-white hover:border-gray-200 hover:bg-gray-50',
                        )}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-gray-900">{conversation.participantName}</p>
                                <p className="mt-1 truncate text-xs text-gray-500">{conversation.title}</p>
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="text-xs text-gray-400">{formatConversationTime(conversation.lastMessageAt)}</p>
                                {conversation.unreadCount > 0 && (
                                    <span className={cn(
                                        'mt-2 inline-flex min-w-6 justify-center rounded-full px-2 py-0.5 text-xs font-bold text-white',
                                        isCEnd ? 'bg-amber-500' : 'bg-teal-600',
                                    )}>
                                        {conversation.unreadCount}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                            <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                                {stageLabel(conversation.stage)}
                            </span>
                            {conversation.demoPriority >= 10 && (
                                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
                                    AI 展示
                                </span>
                            )}
                        </div>
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">{conversation.lastMessagePreview}</p>
                    </button>
                );
            })}
        </div>
    );
}
