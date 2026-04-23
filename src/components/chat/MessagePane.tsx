import { useMemo, useState } from 'react';
import { ArrowRightCircle, Bot, Lightbulb, Send, Sparkles, User as UserIcon, X } from 'lucide-react';
import { useDemoTarget } from '../../demo/useDemoTarget';
import { cn } from '../../utils/cn';
import type { ChatMessage, Conversation, ConversationScenarioState, SuggestionItem, SummaryCard } from '../../types/domain';

interface MessagePaneProps {
    conversation: Conversation | null;
    messages: ChatMessage[];
    suggestions: SuggestionItem[];
    summaryCards: SummaryCard[];
    scenarioState: ConversationScenarioState | null;
    onSend: (content: string) => Promise<void> | void;
    onClose: () => void;
}

function formatMessageTime(value: string) {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? ''
        : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function stageLabel(stage: Conversation['stage']) {
    switch (stage) {
        case 'salary':
            return '薪资待遇';
        case 'schedule':
            return '排班确认';
        case 'trial':
        case 'conversion':
            return '试岗推进';
        case 'fit':
            return '经验匹配';
        case 'discovery':
            return '信息确认';
        default:
            return '破冰沟通';
    }
}

function categoryLabel(category: SuggestionItem['category']) {
    switch (category) {
        case 'next-question':
            return '下一句怎么问';
        case 'showcase':
            return '适合展示的亮点问题';
        case 'conversion':
            return '推进到试岗/面聊';
        default:
            return '平台建议';
    }
}

function toneClass(tone: SummaryCard['tone']) {
    switch (tone) {
        case 'positive':
            return 'border-emerald-200 bg-emerald-50 text-emerald-700';
        case 'caution':
            return 'border-amber-200 bg-amber-50 text-amber-700';
        default:
            return 'border-slate-200 bg-slate-50 text-slate-700';
    }
}

export default function MessagePane({ conversation, messages, suggestions, summaryCards, scenarioState, onSend, onClose }: MessagePaneProps) {
    const [inputValue, setInputValue] = useState('');
    const insightsTargetRef = useDemoTarget<HTMLDivElement>('chat-insights');
    const suggestionsTargetRef = useDemoTarget<HTMLDivElement>('chat-suggestions');

    const activeTheme = useMemo(() => {
        const isCEnd = conversation?.appMode === 'c-end';
        return {
            header: isCEnd ? 'from-amber-500 to-orange-500' : 'from-teal-600 to-cyan-600',
            bubble: isCEnd ? 'bg-amber-500 text-white' : 'bg-teal-600 text-white',
            chip: isCEnd ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-teal-200 bg-teal-50 text-teal-700',
            ring: isCEnd ? 'focus:ring-amber-200' : 'focus:ring-teal-200',
        };
    }, [conversation?.appMode]);

    const groupedSuggestions = useMemo(() => {
        return suggestions.reduce<Record<string, SuggestionItem[]>>((accumulator, suggestion) => {
            if (!accumulator[suggestion.category]) {
                accumulator[suggestion.category] = [];
            }
            accumulator[suggestion.category].push(suggestion);
            return accumulator;
        }, {});
    }, [suggestions]);

    const isTyping = messages.some((message) => message.status === 'typing');

    const handleSend = async (value?: string) => {
        const content = (value ?? inputValue).trim();
        if (!content || !conversation) {
            return;
        }
        await onSend(content);
        if (!value) {
            setInputValue('');
        }
    };

    if (!conversation) {
        return (
            <div className="flex h-full flex-col items-center justify-center px-8 text-center text-gray-500">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-100 text-gray-400">
                    <Bot className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">从任意入口打开会话</h3>
                <p className="mt-3 max-w-md text-sm leading-6">
                    岗位大厅、牛人大厅和右上角消息中心都已经接入统一聊天系统。会话会被持久化，下次打开会继续上次的沟通记录。
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-white">
            <div className={cn('flex items-center justify-between bg-gradient-to-r px-5 py-4 text-white', activeTheme.header)}>
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                        {conversation.appMode === 'c-end' ? <Bot className="h-6 w-6" /> : <UserIcon className="h-6 w-6" />}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-lg font-bold">{conversation.participantName}</p>
                        <p className="truncate text-xs text-white/80">{conversation.title}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="rounded-full p-2 transition-colors hover:bg-white/15"
                    aria-label="关闭聊天"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div ref={insightsTargetRef} className="border-b border-gray-100 bg-white px-5 py-4">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-white">
                        <Sparkles className="h-3.5 w-3.5" /> 平台建议
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-slate-600">
                        当前阶段：{stageLabel(conversation.stage)}
                    </span>
                    {conversation.demoPriority >= 10 && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-indigo-700">
                            AI 展示线程
                        </span>
                    )}
                </div>
                {summaryCards.length > 0 && (
                    <div className="grid gap-3 md:grid-cols-3">
                        {summaryCards.map((card) => (
                            <div key={card.id} className={cn('rounded-2xl border px-4 py-3', toneClass(card.tone))}>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-80">{card.title}</p>
                                <p className="mt-2 text-sm font-bold leading-6">{card.value}</p>
                            </div>
                        ))}
                    </div>
                )}
                {scenarioState?.focusTopics.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500">
                            <Lightbulb className="h-3.5 w-3.5" /> 已识别关注点
                        </span>
                        {scenarioState.focusTopics.map((topic) => (
                            <span key={topic} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                                {topic}
                            </span>
                        ))}
                    </div>
                ) : null}
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 px-5 py-5">
                <div className="mb-4 text-center text-xs text-gray-400">
                    {new Date().toLocaleDateString()} 安全提示：平台不会收取求职保证金，请优先在平台内完成沟通。
                </div>
                {isTyping && (
                    <div className="mb-4 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
                        系统正在综合岗位信息生成回复建议，稍后会自动整理出适合展示的重点内容。
                    </div>
                )}
                <div className="flex flex-col gap-4">
                    {messages.map((message) => {
                        const isMine = message.role === 'user';
                        const isTypingMessage = message.status === 'typing';
                        return (
                            <div
                                key={message.id}
                                className={cn(
                                    'flex flex-col gap-1',
                                    isMine ? 'items-end' : 'items-start',
                                )}
                            >
                                <div className={cn(
                                    'max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm',
                                    isMine ? activeTheme.bubble : 'border border-gray-100 bg-white text-gray-800',
                                    isMine ? 'rounded-tr-md' : 'rounded-tl-md',
                                )}>
                                    {isTypingMessage ? (
                                        <div className="flex items-center gap-1.5 py-1">
                                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.15s' }} />
                                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.3s' }} />
                                        </div>
                                    ) : (
                                        message.content
                                    )}
                                </div>
                                {message.highlights?.length ? (
                                    <div className="mt-1 flex max-w-[85%] flex-wrap gap-2">
                                        {message.highlights.map((highlight) => (
                                            <span key={`${message.id}-${highlight.label}-${highlight.value ?? ''}`} className={cn('rounded-full border px-2.5 py-1 text-[11px] font-semibold', toneClass(highlight.tone))}>
                                                {highlight.label}{highlight.value ? `：${highlight.value}` : ''}
                                            </span>
                                        ))}
                                    </div>
                                ) : null}
                                <span className="px-1 text-xs text-gray-400">{formatMessageTime(message.createdAt)}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="border-t border-gray-100 bg-white px-5 py-4">
                <div ref={suggestionsTargetRef} className="mb-4 space-y-3">
                    {Object.entries(groupedSuggestions).map(([category, items]) => (
                        <div key={category} className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{categoryLabel(category as SuggestionItem['category'])}</p>
                            <div className="flex flex-wrap gap-2">
                                {items.map((suggestion) => (
                                    <button
                                        key={suggestion.id}
                                        onClick={() => handleSend(suggestion.label)}
                                        className={cn(
                                            'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-white',
                                            activeTheme.chip,
                                        )}
                                        title={suggestion.reason}
                                    >
                                        <ArrowRightCircle className="h-3.5 w-3.5" />
                                        {suggestion.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                void handleSend();
                            }
                        }}
                        placeholder={conversation.appMode === 'c-end' ? '输入想问的问题...' : '输入想对候选人说的话...'}
                        className={cn(
                            'h-12 flex-1 rounded-full border border-transparent bg-gray-100 px-4 text-sm outline-none transition-all focus:border-gray-200 focus:bg-white focus:ring-4',
                            activeTheme.ring,
                        )}
                    />
                    <button
                        onClick={() => {
                            void handleSend();
                        }}
                        disabled={!inputValue.trim()}
                        className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50',
                            conversation.appMode === 'c-end' ? 'bg-amber-500' : 'bg-teal-600',
                        )}
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
