import React, { useState, useEffect, useRef } from 'react';
import { Mic, CheckCircle2, User as UserIcon } from 'lucide-react';
import { getMyResume, saveMyResume } from '../../utils/storage';
import { cn } from '../../utils/cn';

const HEALTH_TAGS = ['硬朗能干体力活', '慢性病稳定', '需要坐班', '腿脚不便', '无心脑血管疾病', '视力正常'];
const SKILL_TAGS = ['有驾照(C1)', '有驾照(C2)', '懂厨艺', '会带小孩', '精通绿化', '擅长维修', '退伍军人', '熟悉电脑基础', '有保安经验'];

export default function MicroResume() {
    const [resume, setResume] = useState({
        name: '王大爷',
        age: '60',
        gender: '男',
        expectedSalary: '3-4K',
        healthTags: [] as string[],
        skillTags: [] as string[],
        desc: ''
    });

    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const saved = getMyResume();
        if (saved) {
            setResume(saved);
        }

        // 初始化 Web Speech API
        // 兼容各浏览器前缀
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.lang = 'zh-CN';
            recognitionRef.current.interimResults = false;
            recognitionRef.current.maxAlternatives = 1;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setResume(prev => ({
                    ...prev,
                    desc: prev.desc ? `${prev.desc}，${transcript}` : transcript
                }));
                setIsRecording(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsRecording(false);
                alert('语音输入失败，请确保您已授权麦克风或当前浏览器支持该功能。');
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }
    }, []);

    const toggleTag = (type: 'healthTags' | 'skillTags', tag: string) => {
        setResume(prev => {
            const targetTags = prev[type];
            if (targetTags.includes(tag)) {
                return { ...prev, [type]: targetTags.filter(t => t !== tag) };
            } else {
                return { ...prev, [type]: [...targetTags, tag] };
            }
        });
    };

    const handleSpeechInput = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
        } else {
            if (!recognitionRef.current) {
                alert('抱歉，您的浏览器目前可能不支持原生语音识别功能（建议使用 Chrome / Edge）。您可以尝试手动输入。');
                return;
            }
            try {
                recognitionRef.current.start();
                setIsRecording(true);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleSave = () => {
        if (!resume.name || !resume.age) {
            alert("请至少填写真实姓名和年龄");
            return;
        }
        saveMyResume(resume);
        alert('档案保存成功！企业已经可以看到您的简历了。');
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl pb-32">
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">我的微档案</h1>
                    <p className="text-xl text-gray-500">点选标签，说句话补充，一分钟搞定简历</p>
                </div>
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center shadow-inner">
                    <UserIcon className="w-10 h-10 text-amber-500" />
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-amber-100 space-y-10">

                {/* 基础信息 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                        <label className="text-xl font-bold text-gray-800">怎么称呼您</label>
                        <input
                            type="text"
                            value={resume.name}
                            onChange={e => setResume({ ...resume, name: e.target.value })}
                            placeholder="例如：王师傅"
                            className="text-lg px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-xl font-bold text-gray-800">今年高寿（岁）</label>
                        <input
                            type="number"
                            value={resume.age}
                            onChange={e => setResume({ ...resume, age: e.target.value })}
                            placeholder="例如：60"
                            className="text-lg px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* 身体状况 */}
                <div>
                    <label className="text-xl font-bold text-gray-800 mb-4 block">身体状况 (点击选择，可多选)</label>
                    <div className="flex flex-wrap gap-4">
                        {HEALTH_TAGS.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag('healthTags', tag)}
                                className={cn(
                                    "px-6 py-3 rounded-2xl text-xl font-medium transition-all border-2",
                                    resume.healthTags.includes(tag)
                                        ? "bg-amber-100 border-amber-500 text-amber-800 shadow-md transform scale-105"
                                        : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100"
                                )}
                            >
                                {resume.healthTags.includes(tag) && <CheckCircle2 className="w-5 h-5 inline-block mr-2 text-amber-600" />}
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 技能特长 */}
                <div>
                    <label className="text-xl font-bold text-gray-800 mb-4 block">有啥拿把抓的本事 (点击选择)</label>
                    <div className="flex flex-wrap gap-4">
                        {SKILL_TAGS.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag('skillTags', tag)}
                                className={cn(
                                    "px-6 py-3 rounded-2xl text-xl font-medium transition-all border-2",
                                    resume.skillTags.includes(tag)
                                        ? "bg-amber-100 border-amber-500 text-amber-800 shadow-md transform scale-105"
                                        : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100"
                                )}
                            >
                                {resume.skillTags.includes(tag) && <CheckCircle2 className="w-5 h-5 inline-block mr-2 text-amber-600" />}
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 语音自我介绍 */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-xl font-bold text-gray-800">补充介绍一下自己吧</label>
                        <button
                            onClick={handleSpeechInput}
                            className={cn(
                                "flex items-center gap-2 px-5 py-3 rounded-full text-lg font-bold text-white transition-all shadow-lg active:scale-95",
                                isRecording
                                    ? "bg-red-500 hover:bg-red-600 animate-pulse"
                                    : "bg-amber-500 hover:bg-amber-600"
                            )}
                        >
                            <Mic className={cn("w-6 h-6", isRecording ? "animate-bounce" : "")} />
                            {isRecording ? "听您说中... (点击停止)" : "按这里对着屏幕说话"}
                        </button>
                    </div>
                    <textarea
                        value={resume.desc}
                        onChange={e => setResume({ ...resume, desc: e.target.value })}
                        placeholder="打字慢也不要紧，您可以直接点击右上角的麦克风按钮，把您以前做过什么、对找工作的要求大声讲出来即可..."
                        className="w-full h-40 text-xl px-6 py-5 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500 outline-none transition-all resize-none leading-relaxed"
                    ></textarea>
                </div>

            </div>

            {/* 底部悬浮大按钮 */}
            <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-40">
                <div className="container mx-auto px-4 max-w-4xl">
                    <button
                        onClick={handleSave}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-3xl py-6 rounded-2xl shadow-xl transition-transform hover:-translate-y-1 active:scale-95 tracking-widest"
                    >
                        保存并公开展示我的档案
                    </button>
                </div>
            </div>
        </div>
    );
}
