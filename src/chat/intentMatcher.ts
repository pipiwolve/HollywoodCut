import type { AppMode, IntentKind } from '../types/domain';

interface MatchRule {
    intent: IntentKind;
    patterns: RegExp[];
}

export interface IntentMatch {
    intent: IntentKind;
    keywords: string[];
    confidence: number;
}

const commonRules: MatchRule[] = [
    { intent: 'salary', patterns: [/工资/, /薪资/, /待遇/, /多少钱/, /收入/] },
    { intent: 'schedule', patterns: [/时间/, /排班/, /几点/, /班次/, /上班/, /轮班/] },
    { intent: 'trial', patterns: [/试岗/, /面试/, /试试/, /有意向/, /感兴趣/, /电话聊/, /到场/] },
    { intent: 'location', patterns: [/距离/, /通勤/, /近不近/, /远不远/, /地点/, /离家/] },
    { intent: 'welfare', patterns: [/福利/, /体检/, /包吃/, /宿舍/, /弹性/, /保险/] },
    { intent: 'safety', patterns: [/保证金/, /收费/, /靠谱不/, /安全/, /合同/, /被骗/] },
    { intent: 'fit', patterns: [/适合/, /匹配/, /稳不稳/, /能不能干/, /强度/] },
    { intent: 'greeting', patterns: [/你好/, /您好/, /在吗/, /方便沟通/, /打扰/] },
];

const modeRules: Record<AppMode, MatchRule[]> = {
    'c-end': [
        { intent: 'availability', patterns: [/什么时候去/, /何时去/, /什么时候到/, /下周/, /这周/] },
        { intent: 'fit', patterns: [/适合我/, /我能做吗/, /体力/] },
    ],
    'b-end': [
        { intent: 'skills', patterns: [/技能/, /会什么/, /擅长/, /拿手/] },
        { intent: 'experience', patterns: [/经验/, /做过/, /之前做什么/, /干过/] },
        { intent: 'availability', patterns: [/何时到岗/, /什么时候能上岗/, /周几/, /能来几天/] },
    ],
};

function extractKeywords(text: string, patterns: RegExp[]) {
    const keywords: string[] = [];
    patterns.forEach((pattern) => {
        const match = text.match(pattern);
        if (match) {
            keywords.push(match[0]);
        }
    });
    return keywords;
}

export function matchIntent(message: string, mode: AppMode): IntentMatch {
    const normalized = message.trim();
    if (!normalized) {
        return { intent: 'generic', keywords: [], confidence: 0 };
    }

    const rules = [...modeRules[mode], ...commonRules];
    for (const rule of rules) {
        const keywords = extractKeywords(normalized, rule.patterns);
        if (keywords.length > 0) {
            return {
                intent: rule.intent,
                keywords,
                confidence: Math.min(0.55 + keywords.length * 0.15, 0.95),
            };
        }
    }

    return {
        intent: 'generic',
        keywords: [],
        confidence: 0.3,
    };
}
