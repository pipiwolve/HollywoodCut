import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Bot, User as UserIcon } from 'lucide-react';
import { cn } from '../utils/cn';

interface Message {
    id: string;
    text: string;
    sender: 'me' | 'other';
    time: string;
}

interface ChatWindowProps {
    isOpen: boolean;
    onClose: () => void;
    targetName: string;
    appMode: 'c-end' | 'b-end';
}

export default function ChatWindow({ isOpen, onClose, targetName, appMode }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: appMode === 'c-end'
                ? `您好，我是 ${targetName} 的人事，看到您的简历挺合适的。请问您方便沟通吗？`
                : `您好，我对贵公司的岗位很感兴趣，这是我长辈的简历。`,
            sender: 'other',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isCEnd = appMode === 'c-end';
    const themeColor = isCEnd ? 'text-amber-600' : 'text-teal-600';
    const themeBg = isCEnd ? 'bg-amber-600' : 'bg-teal-600';
    const themeHover = isCEnd ? 'hover:bg-amber-700' : 'hover:bg-teal-700';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');
        setIsTyping(true);

        // 模拟对方输入与自动回复
        setTimeout(() => {
            setIsTyping(false);
            const replyMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: appMode === 'c-end'
                    ? '好的，针对您的身体情况以及这边的弹性工作制，您可以下周一来当面试试吗？'
                    : '稍等，我看下您的技能标签符合我们的绿化维护岗位要求。',
                sender: 'other',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, replyMessage]);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-[100] border border-gray-100 overflow-hidden">
            {/* 头部 */}
            <div className={cn("p-4 flex items-center justify-between text-white", themeBg)}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        {appMode === 'c-end' ? <Bot className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{targetName}</h3>
                        <p className="text-xs text-white/80 font-medium">
                            {appMode === 'c-end' ? '来自: 前锦企业管理' : '期望薪资: 3K-4K'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* 消息区 */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
                <div className="text-center text-xs text-gray-400 my-2">
                    {new Date().toLocaleDateString()} 安全提示：平台绝不收取任何保证金
                </div>

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex flex-col max-w-[80%]",
                            msg.sender === 'me' ? "self-end items-end" : "self-start items-start"
                        )}
                    >
                        <div className={cn(
                            "px-4 py-3 rounded-2xl text-base shadow-sm relative",
                            msg.sender === 'me'
                                ? `${themeBg} text-white rounded-tr-sm`
                                : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"
                        )}>
                            {msg.text}
                        </div>
                        <span className="text-xs text-gray-400 mt-1 px-1">{msg.time}</span>
                    </div>
                ))}
                {isTyping && (
                    <div className="self-start items-start flex flex-col">
                        <div className="px-4 py-3 rounded-2xl bg-white text-gray-800 rounded-tl-sm border border-gray-100 shadow-sm flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* 输入区 */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={appMode === 'c-end' ? "输入您的回复..." : "请输入内容..."}
                        className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 rounded-full px-4 py-3 text-base outline-none transition-all"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className={cn(
                            "p-3 rounded-full text-white transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
                            themeBg,
                            themeHover
                        )}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
