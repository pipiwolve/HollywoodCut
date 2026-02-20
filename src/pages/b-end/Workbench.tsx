import React, { useState } from 'react';
import { addJob } from '../../utils/storage';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const ALL_TAGS = ['弹性工作', '就近分配', '免费体检', '户外工作', '按件计酬', '无年龄硬性限制', '包吃', '下午半天上班', '夜班', '包三餐', '单人宿舍'];

export default function Workbench() {
    const [formData, setFormData] = useState({
        title: '',
        company: '我司（默认）',
        salary: '',
        location: '',
        matchRate: 100,
        tags: [] as string[],
        desc: ''
    });

    const handlePublish = () => {
        if (!formData.title || !formData.salary || !formData.location || !formData.desc) {
            alert('请填写完整带 * 号的必填项');
            return;
        }
        addJob(formData);
        alert('✅ 岗位发布成功！您可以前往长者版的岗位大厅查看效果。');

        // 重置表单
        setFormData({
            title: '',
            company: '我司（默认）',
            salary: '',
            location: '',
            matchRate: 100,
            tags: [],
            desc: ''
        });
    };

    const toggleTag = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    return (
        <div className="container mx-auto px-6 py-8 max-w-4xl">
            <div className="mb-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">工作台 / 发布适老岗位</h1>
                <p className="text-gray-500 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    发布针对银发族的岗位时，请务必客观描述工作强度，保障长辈安全。
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-teal-50 p-8 space-y-8">

                {/* 标题 & 薪资 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">岗位名称 <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="如：社区园艺师、晚托班阿姨"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">薪资待遇 <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.salary}
                            onChange={e => setFormData({ ...formData, salary: e.target.value })}
                            placeholder="如：3-4K 或者 面议"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {/* 公司 & 地点 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">招聘企业名称</label>
                        <input
                            type="text"
                            value={formData.company}
                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                            placeholder="您的企业名称"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">工作地点 <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            placeholder="如：静安区南京西路100号"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {/* 亮点标签 */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">适老岗位亮点福利 (可多选)</label>
                    <div className="flex flex-wrap gap-3">
                        {ALL_TAGS.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                                    formData.tags.includes(tag)
                                        ? "bg-teal-50 border-teal-500 text-teal-700"
                                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                                )}
                            >
                                {formData.tags.includes(tag) && <CheckCircle2 className="w-4 h-4 inline-block mr-1.5" />}
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 职责描述 */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">详细岗位职责与身体要求 <span className="text-red-500">*</span></label>
                    <textarea
                        value={formData.desc}
                        onChange={e => setFormData({ ...formData, desc: e.target.value })}
                        placeholder="请详细描述工作时间和强度要求，例如是否有重体力劳动，是否需要长时间站立等..."
                        className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                    ></textarea>
                </div>

                {/* 提交区 */}
                <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                    <button
                        onClick={() => { }}
                        className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                    >
                        存草稿
                    </button>
                    <button
                        onClick={handlePublish}
                        className="px-10 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md shadow-teal-600/20 transition-all hover:shadow-lg active:scale-95"
                    >
                        马上发布
                    </button>
                </div>
            </div>
        </div>
    );
}
