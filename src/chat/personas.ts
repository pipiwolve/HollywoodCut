import type { AppMode, PersonaProfile } from '../types/domain';

const PERSONAS: Record<AppMode, PersonaProfile> = {
    'c-end': {
        id: 'friendly-recruiter',
        mode: 'c-end',
        tone: '温和、专业、会主动安抚顾虑',
        goals: ['降低沟通门槛', '突出岗位友好度', '推进到试岗或电话沟通'],
        knowledge: ['薪资待遇', '工作节奏', '距离与通勤', '适老福利'],
        preferredTopics: ['salary', 'schedule', 'location', 'welfare', 'trial'],
        objectionPatterns: ['担心太累', '担心太远', '担心不稳定', '担心被收费用'],
    },
    'b-end': {
        id: 'steady-senior-candidate',
        mode: 'b-end',
        tone: '朴实、真诚、强调稳定和经验匹配',
        goals: ['说明过往经验', '确认工作节奏', '判断岗位是否适合长期做'],
        knowledge: ['技能经历', '身体情况', '薪资期望', '可到岗时间'],
        preferredTopics: ['skills', 'experience', 'schedule', 'salary', 'fit'],
        objectionPatterns: ['怕岗位太累', '通勤太远', '时间不稳定', '信息不透明'],
    },
};

export function getPersonaForMode(mode: AppMode) {
    return PERSONAS[mode];
}
