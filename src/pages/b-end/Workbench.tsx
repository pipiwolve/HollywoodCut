import { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Sparkles, Wand2 } from 'lucide-react';
import { useDemoTarget } from '../../demo/useDemoTarget';
import { useDataStore } from '../../store/useDataStore';
import { cn } from '../../utils/cn';

const ALL_TAGS = ['弹性工作', '就近分配', '免费体检', '户外工作', '按件计酬', '无年龄硬性限制', '包吃', '下午半天上班', '夜班', '包三餐', '单人宿舍'];

export default function Workbench() {
    const publishJob = useDataStore((state) => state.publishJob);
    const formTargetRef = useDemoTarget<HTMLDivElement>('workbench-form');
    const previewTargetRef = useDemoTarget<HTMLDivElement>('workbench-preview');
    const [formData, setFormData] = useState({
        title: '',
        company: '我司（默认）',
        salary: '',
        location: '',
        matchRate: 100,
        tags: [] as string[],
        desc: '',
    });

    const previewText = useMemo(() => {
        if (!formData.title && !formData.desc) {
            return '右侧这份岗位会即时同步到长者端岗位大厅，方便您在答辩现场展示双端闭环。';
        }
        return `${formData.title || '待命名岗位'}：${formData.desc || '请补充岗位职责与强度说明。'}`;
    }, [formData.desc, formData.title]);

    const handlePublish = () => {
        if (!formData.title || !formData.salary || !formData.location || !formData.desc) {
            alert('请填写完整带 * 号的必填项');
            return;
        }

        publishJob(formData);
        alert('岗位发布成功！切回长者版岗位大厅后，新的岗位会立即出现。');
        setFormData({
            title: '',
            company: '我司（默认）',
            salary: '',
            location: '',
            matchRate: 100,
            tags: [],
            desc: '',
        });
    };

    const toggleTag = (tag: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter((item) => item !== tag)
                : [...prev.tags, tag],
        }));
    };

    return (
        <div className="container mx-auto max-w-5xl px-6 py-8">
            <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
                        <Sparkles className="h-3.5 w-3.5" /> 企业工作台
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">工作台 / 发布适老岗位</h1>
                    <p className="flex items-center gap-2 text-gray-500">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        发布针对银发族的岗位时，请务必客观描述工作强度，保障长辈安全。
                    </p>
                </div>
                <div className="rounded-3xl border border-teal-100 bg-white px-5 py-4 shadow-sm lg:max-w-sm">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                            <Wand2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">演示提示</p>
                            <p className="mt-1 text-sm leading-6 text-gray-500">发布成功后，长者端岗位大厅会马上刷新出这条岗位，不需要重新进入应用。</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div ref={formTargetRef} className="space-y-8 rounded-2xl border border-teal-50 bg-white p-8 shadow-sm">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">岗位名称 <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                                placeholder="如：社区园艺师、晚托班阿姨"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">薪资待遇 <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={formData.salary}
                                onChange={(event) => setFormData({ ...formData, salary: event.target.value })}
                                placeholder="如：3-4K 或者 面议"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">招聘企业名称</label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(event) => setFormData({ ...formData, company: event.target.value })}
                                placeholder="您的企业名称"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">工作地点 <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(event) => setFormData({ ...formData, location: event.target.value })}
                                placeholder="如：静安区南京西路100号"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-3 block text-sm font-bold text-gray-700">适老岗位亮点福利（可多选）</label>
                        <div className="flex flex-wrap gap-3">
                            {ALL_TAGS.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={cn(
                                        'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                                        formData.tags.includes(tag)
                                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50',
                                    )}
                                >
                                    {formData.tags.includes(tag) && <CheckCircle2 className="mr-1.5 inline-block h-4 w-4" />}
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-gray-700">详细岗位职责与身体要求 <span className="text-red-500">*</span></label>
                        <textarea
                            value={formData.desc}
                            onChange={(event) => setFormData({ ...formData, desc: event.target.value })}
                            placeholder="请详细描述工作时间和强度要求，例如是否有重体力劳动，是否需要长时间站立等..."
                            className="h-32 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
                        <button
                            onClick={() => setFormData({
                                title: '',
                                company: '我司（默认）',
                                salary: '',
                                location: '',
                                matchRate: 100,
                                tags: [],
                                desc: '',
                            })}
                            className="rounded-xl bg-gray-100 px-8 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
                        >
                            清空表单
                        </button>
                        <button
                            onClick={handlePublish}
                            className="rounded-xl bg-teal-600 px-10 py-3 font-bold text-white shadow-md shadow-teal-600/20 transition-all hover:bg-teal-700 hover:shadow-lg active:scale-95"
                        >
                            马上发布
                        </button>
                    </div>
                </div>

                <div ref={previewTargetRef} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">Live Preview</p>
                    <h2 className="mt-3 text-xl font-bold text-gray-900">岗位卡片预览</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {['发布后立即同步', '适合演示闭环', '本地稳定可复位'].map((point) => (
                            <span key={point} className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                                {point}
                            </span>
                        ))}
                    </div>
                    <div className="mt-6 rounded-3xl border border-teal-100 bg-teal-50/40 p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xl font-bold text-gray-900">{formData.title || '待发布岗位'}</p>
                                <p className="mt-2 text-sm text-gray-500">{formData.company || '请输入企业名称'}</p>
                            </div>
                            <div className="text-right text-lg font-bold text-teal-600">{formData.salary || '薪资待定'}</div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {(formData.tags.length > 0 ? formData.tags : ['标签将显示在这里']).map((tag) => (
                                <span key={tag} className="rounded-full border border-teal-100 bg-white px-3 py-1 text-sm text-teal-700">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <p className="mt-4 rounded-2xl bg-white p-4 text-sm leading-6 text-gray-600">{previewText}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
