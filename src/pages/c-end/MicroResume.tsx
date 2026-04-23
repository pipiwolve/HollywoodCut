import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Mic, Sparkles, User as UserIcon } from 'lucide-react';
import { useDemoTarget } from '../../demo/useDemoTarget';
import { createDemoResume } from '../../repositories/resumeRepository';
import { useDataStore } from '../../store/useDataStore';
import { cn } from '../../utils/cn';
import type { ResumeDraft } from '../../types/domain';

const HEALTH_TAGS = ['硬朗能干体力活', '慢性病稳定', '需要坐班', '腿脚不便', '无心脑血管疾病', '视力正常'];
const SKILL_TAGS = ['有驾照(C1)', '有驾照(C2)', '懂厨艺', '会带小孩', '精通绿化', '擅长维修', '退伍军人', '熟悉电脑基础', '有保安经验'];

type SpeechRecognitionInstance = {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    onresult: ((event: { results: { transcript: string }[][] }) => void) | null;
    onerror: ((event: { error: string }) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
};

function toDraft(resume: ResumeDraft): ResumeDraft {
    return {
        ...resume,
        healthTags: [...resume.healthTags],
        skillTags: [...resume.skillTags],
    };
}

export default function MicroResume() {
    const myResume = useDataStore((state) => state.myResume);
    const saveResume = useDataStore((state) => state.saveResume);
    const [resume, setResume] = useState<ResumeDraft>(() => toDraft(createDemoResume()));
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
    const editorTargetRef = useDemoTarget<HTMLDivElement>('resume-editor');
    const voiceTargetRef = useDemoTarget<HTMLButtonElement>('resume-voice');
    const saveButtonTargetRef = useDemoTarget<HTMLButtonElement>('resume-save-button');

    useEffect(() => {
        if (myResume) {
            setResume(toDraft({
                name: myResume.name,
                age: myResume.age,
                gender: myResume.gender,
                expectedSalary: myResume.expectedSalary,
                healthTags: myResume.healthTags,
                skillTags: myResume.skillTags,
                desc: myResume.desc,
            }));
        }
    }, [myResume]);

    useEffect(() => {
        const SpeechRecognition = (window as Window & {
            SpeechRecognition?: new () => SpeechRecognitionInstance;
            webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
        }).SpeechRecognition ?? (window as Window & { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = event.results[0]?.[0]?.transcript ?? '';
            setResume((prev) => ({
                ...prev,
                desc: prev.desc ? `${prev.desc}，${transcript}` : transcript,
            }));
            setIsRecording(false);
        };

        recognition.onerror = () => {
            setIsRecording(false);
            alert('语音输入失败，请确保您已授权麦克风或当前浏览器支持该功能。');
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, []);

    const toggleTag = (type: 'healthTags' | 'skillTags', tag: string) => {
        setResume((prev) => {
            const values = prev[type];
            return {
                ...prev,
                [type]: values.includes(tag) ? values.filter((item) => item !== tag) : [...values, tag],
            };
        });
    };

    const handleSpeechInput = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            return;
        }

        if (!recognitionRef.current) {
            alert('抱歉，当前浏览器暂不支持原生语音识别。您仍然可以手动输入，不影响整个演示流程。');
            return;
        }

        try {
            recognitionRef.current.start();
            setIsRecording(true);
        } catch {
            setIsRecording(false);
        }
    };

    const handleSave = () => {
        if (!resume.name || !resume.age) {
            alert('请至少填写真实姓名和年龄');
            return;
        }
        saveResume(resume);
        alert('档案保存成功！切到企业版后，人才大厅会立即看到这份简历。');
    };

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
            <div className="mb-10 flex items-center justify-between gap-4">
                <div>
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">我的微档案</h1>
                    <p className="text-xl text-gray-500">点选标签，说句话补充，一分钟搞定简历</p>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 shadow-inner">
                    <UserIcon className="h-10 w-10 text-amber-500" />
                </div>
            </div>

            <div className="mb-6 rounded-3xl border border-amber-100 bg-white px-5 py-4 shadow-sm">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-base font-bold text-gray-900">保存后会实时同步到企业版牛人大厅</p>
                        <p className="mt-1 text-sm leading-6 text-gray-500">这次简历编辑已经接入共享数据层，不用刷新页面，也不用重新进应用。</p>
                    </div>
                </div>
            </div>

            <div ref={editorTargetRef} className="space-y-10 rounded-3xl border border-amber-100 bg-white p-6 shadow-sm sm:p-10">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <div className="flex flex-col gap-3">
                        <label className="text-xl font-bold text-gray-800">怎么称呼您</label>
                        <input
                            type="text"
                            value={resume.name}
                            onChange={(event) => setResume({ ...resume, name: event.target.value })}
                            placeholder="例如：王师傅"
                            className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-lg outline-none transition-all focus:border-amber-500 focus:ring-4 focus:ring-amber-200"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-xl font-bold text-gray-800">今年高寿（岁）</label>
                        <input
                            type="number"
                            value={resume.age}
                            onChange={(event) => setResume({ ...resume, age: event.target.value })}
                            placeholder="例如：60"
                            className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-lg outline-none transition-all focus:border-amber-500 focus:ring-4 focus:ring-amber-200"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-4 block text-xl font-bold text-gray-800">身体状况（点击选择，可多选）</label>
                    <div className="flex flex-wrap gap-4">
                        {HEALTH_TAGS.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => toggleTag('healthTags', tag)}
                                className={cn(
                                    'rounded-2xl border-2 px-6 py-3 text-xl font-medium transition-all',
                                    resume.healthTags.includes(tag)
                                        ? 'scale-105 border-amber-500 bg-amber-100 text-amber-800 shadow-md'
                                        : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100',
                                )}
                            >
                                {resume.healthTags.includes(tag) && <CheckCircle2 className="mr-2 inline-block h-5 w-5 text-amber-600" />}
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="mb-4 block text-xl font-bold text-gray-800">有啥拿把抓的本事（点击选择）</label>
                    <div className="flex flex-wrap gap-4">
                        {SKILL_TAGS.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => toggleTag('skillTags', tag)}
                                className={cn(
                                    'rounded-2xl border-2 px-6 py-3 text-xl font-medium transition-all',
                                    resume.skillTags.includes(tag)
                                        ? 'scale-105 border-amber-500 bg-amber-100 text-amber-800 shadow-md'
                                        : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100',
                                )}
                            >
                                {resume.skillTags.includes(tag) && <CheckCircle2 className="mr-2 inline-block h-5 w-5 text-amber-600" />}
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <label className="text-xl font-bold text-gray-800">补充介绍一下自己吧</label>
                        <button
                            ref={voiceTargetRef}
                            onClick={handleSpeechInput}
                            className={cn(
                                'flex items-center gap-2 rounded-full px-5 py-3 text-lg font-bold text-white shadow-lg transition-all active:scale-95',
                                isRecording ? 'animate-pulse bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600',
                            )}
                        >
                            <Mic className={cn('h-6 w-6', isRecording && 'animate-bounce')} />
                            {isRecording ? '听您说中...（点击停止）' : '按这里对着屏幕说话'}
                        </button>
                    </div>
                    <textarea
                        value={resume.desc}
                        onChange={(event) => setResume({ ...resume, desc: event.target.value })}
                        placeholder="打字慢也不要紧，您可以直接点击右上角的麦克风按钮，把您以前做过什么、对找工作的要求大声讲出来即可..."
                        className="h-40 w-full resize-none rounded-3xl border border-gray-200 bg-gray-50 px-6 py-5 text-xl leading-relaxed outline-none transition-all focus:border-amber-500 focus:ring-4 focus:ring-amber-200"
                    />
                </div>
            </div>

            <div className="fixed bottom-0 left-0 z-40 w-full border-t border-gray-200 bg-white/90 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] backdrop-blur-md">
                <div className="container mx-auto max-w-4xl px-4">
                    <button
                        ref={saveButtonTargetRef}
                        onClick={handleSave}
                        className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-6 text-3xl font-bold tracking-widest text-white shadow-xl transition-transform hover:-translate-y-1 hover:from-amber-600 hover:to-orange-600 active:scale-95"
                    >
                        保存并公开展示我的档案
                    </button>
                </div>
            </div>
        </div>
    );
}
