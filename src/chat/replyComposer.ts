import type { ChatProviderReply, IntentKind, ScenarioEngineContext } from '../types/domain';
import { readNumber, readString, readStringArray } from './scenarioUtils';

function createReply(content: string, intent: IntentKind, delayMs: number, highlights: ChatProviderReply['highlights'] = []): ChatProviderReply {
    return {
        content,
        intent,
        delayMs,
        source: 'mock',
        highlights,
    };
}

function composeCEndReply(context: ScenarioEngineContext, intent: IntentKind): ChatProviderReply {
    const meta = context.conversation.meta;
    const title = readString(meta, 'title', '这个岗位');
    const company = readString(meta, 'company', context.conversation.participantName);
    const salary = readString(meta, 'salary', '面议');
    const location = readString(meta, 'location', '离家很近');
    const tags = readStringArray(meta, 'tags');
    const matchRate = readNumber(meta, 'matchRate', 90);
    const scheduleHint = tags.find((tag) => /(半天|弹性|夜班)/.test(tag)) ?? '弹性安排';
    const welfareHint = tags.find((tag) => /(体检|包吃|宿舍)/.test(tag)) ?? tags[0] ?? '就近分配';

    switch (intent) {
        case 'salary':
            return createReply(
                `${company} 这边给到 ${salary}，另外岗位主打“${scheduleHint}”和“${welfareHint}”，对长者来说节奏会更友好。`,
                intent,
                950,
                [
                    { label: '薪资范围', value: salary, tone: 'positive' },
                    { label: '匹配度', value: `${matchRate}%`, tone: 'positive' },
                ],
            );
        case 'schedule':
            return createReply(
                `这份 ${title} 目前按“${scheduleHint}”安排，地点在${location}，我们会优先照顾通勤方便、想找稳定节奏的长辈。`,
                intent,
                1050,
                [
                    { label: '排班特点', value: scheduleHint, tone: 'neutral' },
                    { label: '通勤提示', value: location, tone: 'positive' },
                ],
            );
        case 'location':
            return createReply(
                `岗位地点就在${location}，这也是平台给您高匹配推荐的原因之一，适合就近沟通、先来看看环境再决定。`,
                intent,
                900,
                [
                    { label: '距离优势', value: location, tone: 'positive' },
                    { label: '推荐原因', value: '就近匹配', tone: 'neutral' },
                ],
            );
        case 'welfare':
            return createReply(
                `我们会把长者最关心的福利讲清楚，目前能明确的是“${welfareHint}”，如果您需要，我也可以继续把上岗支持和保障细节发给您。`,
                intent,
                980,
                [
                    { label: '重点福利', value: welfareHint, tone: 'positive' },
                    { label: '平台提示', value: '适老保障', tone: 'neutral' },
                ],
            );
        case 'safety':
            return createReply(
                '平台内沟通不会收取任何保证金，这边也会先把岗位内容、时间和联系人说明清楚，您确认放心后再安排试岗。',
                intent,
                900,
                [
                    { label: '安全提醒', value: '不收保证金', tone: 'caution' },
                    { label: '流程方式', value: '先沟通后试岗', tone: 'neutral' },
                ],
            );
        case 'trial':
        case 'availability':
            return createReply(
                `太好了，您如果有意向，我们这周就可以先安排试岗或电话沟通。岗位是 ${title}，地点${location}，我把适合展示的时间段一起发给您。`,
                intent,
                1200,
                [
                    { label: '下一步', value: '试岗/电话沟通', tone: 'positive' },
                    { label: '岗位名称', value: title, tone: 'neutral' },
                ],
            );
        case 'fit':
            return createReply(
                `从平台画像看，您和这份 ${title} 的契合度大约在 ${matchRate}% 左右，主要亮点是“${scheduleHint}”和“${welfareHint}”，比较适合想找稳定、强度可控工作的长辈。`,
                intent,
                1050,
                [
                    { label: '契合度', value: `${matchRate}%`, tone: 'positive' },
                    { label: '适合原因', value: `${scheduleHint} / ${welfareHint}`, tone: 'neutral' },
                ],
            );
        default:
            return createReply(
                `收到，我会结合 ${title} 的时间、薪资和距离信息给您更适合的建议。如果您愿意，我们可以先从“上班时间”或“试岗安排”继续聊。`,
                'generic',
                980,
                [
                    { label: '建议继续问', value: '时间 / 试岗', tone: 'neutral' },
                ],
            );
    }
}

function composeBEndReply(context: ScenarioEngineContext, intent: IntentKind): ChatProviderReply {
    const meta = context.conversation.meta;
    const name = readString(meta, 'name', context.conversation.participantName);
    const salary = readString(meta, 'expectedSalary', '面议');
    const desc = readString(meta, 'desc', '我做事比较稳当。');
    const skills = readStringArray(meta, 'skillTags');
    const healthTags = readStringArray(meta, 'healthTags');
    const topSkill = skills.slice(0, 2).join('、') || '社区服务';
    const availability = healthTags.find((tag) => /(坐班|硬朗|腿脚)/.test(tag)) ?? '时间比较灵活';

    switch (intent) {
        case 'skills':
        case 'experience':
            return createReply(
                `${name} 之前主要做 ${topSkill} 相关的工作，${desc} 如果岗位内容说得清楚、节奏稳定，我会比较有把握。`,
                intent,
                1000,
                [
                    { label: '核心技能', value: topSkill, tone: 'positive' },
                    { label: '沟通风格', value: '愿意继续了解', tone: 'neutral' },
                ],
            );
        case 'salary':
            return createReply(
                `我目前的期望大概是 ${salary}，当然比起单纯薪资，我更看重岗位是否稳定、是否照顾长者的工作节奏。`,
                intent,
                920,
                [
                    { label: '期望薪资', value: salary, tone: 'positive' },
                    { label: '优先关注', value: '稳定、节奏友好', tone: 'neutral' },
                ],
            );
        case 'schedule':
        case 'availability':
            return createReply(
                `${name} 这边 ${availability}，如果工作地点不远、排班清晰，我可以尽快配合安排试岗或面聊。`,
                intent,
                1000,
                [
                    { label: '可配合情况', value: availability, tone: 'neutral' },
                    { label: '下一步', value: '可安排试岗', tone: 'positive' },
                ],
            );
        case 'fit':
            return createReply(
                `如果岗位更看重耐心、稳定和经验复用，那我应该是比较合适的。只要工作内容明确，我愿意继续往下聊。`,
                intent,
                980,
                [
                    { label: '岗位匹配', value: '重视稳定与经验', tone: 'positive' },
                ],
            );
        case 'location':
            return createReply(
                '我比较看重离家近、来回方便。如果岗位地点合适，长期做会更稳定，也更方便现场答辩时说明这个匹配逻辑。',
                intent,
                900,
                [
                    { label: '核心关注', value: '就近通勤', tone: 'positive' },
                ],
            );
        default:
            return createReply(
                `您好，我愿意进一步了解岗位细节。像 ${topSkill} 这样的经验如果能用得上，我会很愿意继续沟通。`,
                'generic',
                980,
                [
                    { label: '可继续追问', value: '经验 / 排班 / 到岗', tone: 'neutral' },
                ],
            );
    }
}

export function composeReply(context: ScenarioEngineContext, intent: IntentKind) {
    if (context.conversation.appMode === 'c-end') {
        return composeCEndReply(context, intent);
    }
    return composeBEndReply(context, intent);
}
