import React from 'react';
import { ShieldCheck, HeartHandshake, PhoneCall, Scale, Copy } from 'lucide-react';

export default function Assurance() {
    return (
        <div className="container mx-auto px-6 py-8 pb-20">

            {/* 头部荣誉区 */}
            <div className="bg-gradient-to-r from-teal-800 to-teal-900 rounded-2xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden mb-12">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 flex items-center gap-3">
                        <ShieldCheck className="w-10 h-10 text-teal-300" />
                        企业适老招聘认证与保障
                    </h1>
                    <p className="text-teal-100 text-lg leading-relaxed">
                        智龄汇为长者求职保驾护航。展示您的信用与保障措施，获取更多长者求职者的信任。
                    </p>
                </div>
                {/* 背景装饰图形 */}
                <ShieldCheck className="absolute -right-10 -bottom-20 w-80 h-80 text-teal-500 opacity-20 pointer-events-none" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 左侧：信用徽章墙 */}
                <div className="lg:col-span-2 space-y-8">

                    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-teal-500 rounded-full"></span>
                            我的企业信用徽章
                        </h2>
                        <p className="text-sm text-gray-500 mb-8">点亮这些徽章将在长者端的岗位详情页中显眼展示，吸引长者投递。</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            <div className="flex bg-green-50 p-6 rounded-2xl border border-green-100 relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-green-900 mb-2">营业执照已核验</h3>
                                    <p className="text-sm text-green-700">完成真实工商主体认证</p>
                                </div>
                                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded font-bold shadow-sm">
                                    已点亮
                                </div>
                            </div>

                            <div className="flex bg-amber-50 p-6 rounded-2xl border border-amber-100 relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                                        <HeartHandshake className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-amber-900 mb-2">5000元 适老安全保证金</h3>
                                    <p className="text-sm text-amber-700">针对长者劳资纠纷先行赔付承诺</p>
                                </div>
                                <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs px-2 py-1 rounded font-bold shadow-sm">
                                    已缴纳
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                {/* 右侧：保险与法律援助指引 */}
                <div className="space-y-8">

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                            <Scale className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">银发法律援助通道</h3>
                        <p className="text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                            智龄汇联合公益律所提供适老用工免费咨询与法律援助。
                        </p>
                        <div className="flex items-center justify-between group">
                            <div>
                                <div className="text-xs font-semibold text-gray-400 mb-1 uppercase">援助专线</div>
                                <div className="font-bold text-gray-900 text-xl tracking-wider">400-888-9999</div>
                            </div>
                            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
                        <div className="w-10 h-10 bg-white text-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                            <HeartHandshake className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">长者意外险快捷接口</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            由于超龄人员无法缴纳工伤保险，在此可一键为已录用长辈购买按天/月折算的老年人意外险。
                        </p>
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors shadow-sm">
                            购买虚拟指引入口
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
