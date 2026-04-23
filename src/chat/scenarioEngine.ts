import { buildConversationId } from './conversationSeeds';
import { matchIntent } from './intentMatcher';
import { getPersonaForMode } from './personas';
import { composeReply } from './replyComposer';
import { buildContextTags, deriveStageFromIntents, readNumber, readString, readStringArray, uniqueStrings } from './scenarioUtils';
import type {
    ChatMessage,
    Conversation,
    ConversationScenarioState,
    ConversationSeed,
    IntentKind,
    ScenarioAdvanceResult,
    ScenarioBootstrap,
    ScenarioEngine,
    ScenarioEngineContext,
    SuggestionItem,
    SummaryCard,
} from '../types/domain';

function createMessage(conversationId: string, role: ChatMessage['role'], content: string, extra: Partial<ChatMessage> = {}): ChatMessage {
    return {
        id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        conversationId,
        role,
        content,
        createdAt: new Date().toISOString(),
        status: 'sent',
        source: 'mock',
        ...extra,
    };
}

function stageLabel(stage: Conversation['stage']) {
    switch (stage) {
        case 'salary':
            return '薪资待遇';
        case 'schedule':
            return '排班时间';
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

function buildBootstrapMessage(seed: ConversationSeed, conversationId: string) {
    if (seed.appMode === 'c-end') {
        const title = readString(seed.meta, 'title', '这个岗位');
        const company = readString(seed.meta, 'company', seed.participantName);
        const location = readString(seed.meta, 'location', '离您很近');
        return createMessage(
            conversationId,
            'assistant',
            `您好，我是 ${company} 的招聘专员。您看的“${title}”目前还在招，地点${location}，如果您方便，我们可以先在线沟通一下。`,
            {
                intent: 'greeting',
                highlights: [
                    { label: '平台建议', value: '先确认时间和地点', tone: 'neutral' },
                ],
            },
        );
    }

    const name = readString(seed.meta, 'name', seed.participantName);
    const skills = readStringArray(seed.meta, 'skillTags');
    return createMessage(
        conversationId,
        'assistant',
        `您好，我是 ${name}。我之前主要做 ${skills[0] ?? '社区服务'} 相关工作，如果岗位合适，我愿意进一步沟通。`,
        {
            intent: 'greeting',
            highlights: [
                { label: '平台建议', value: '先确认经验和排班', tone: 'neutral' },
            ],
        },
    );
}

function buildAiShowcaseMessages(seed: ConversationSeed, conversationId: string) {
    const title = readString(seed.meta, 'title', '社区活动登记员');
    const salary = readString(seed.meta, 'salary', '3500-4200元');
    const location = readString(seed.meta, 'location', '距离您 900m');
    const tags = readStringArray(seed.meta, 'tags');
    const scheduleHint = tags.find((tag) => /(半天|弹性)/.test(tag)) ?? '弹性工作';

    return [
        createMessage(conversationId, 'assistant', `您好，我是岗位顾问。这份“${title}”目前仍在招，地点${location}，平台判断您和岗位的匹配度比较高。`, {
            intent: 'greeting',
            highlights: [
                { label: '匹配亮点', value: '就近 + 低强度', tone: 'positive' },
            ],
        }),
        createMessage(conversationId, 'user', '我住得近，想先看看上班时间和薪资是不是适合长期做。', {
            intent: 'salary',
            source: 'suggestion',
        }),
        createMessage(conversationId, 'assistant', `这份岗位目前给到 ${salary}，主打“${scheduleHint}”，工作强度比较平稳，比较适合想找稳定节奏的长辈。`, {
            intent: 'salary',
            highlights: [
                { label: '薪资范围', value: salary, tone: 'positive' },
                { label: '排班特点', value: scheduleHint, tone: 'neutral' },
            ],
        }),
        createMessage(conversationId, 'user', '我以前做过社区协调和登记，如果合适可以先试岗看看。', {
            intent: 'trial',
            source: 'suggestion',
        }),
        createMessage(conversationId, 'assistant', `非常合适，这也是平台推荐您重点展示的地方。您既有社区协调经验，又住得近，我们可以直接往“试岗/电话沟通”这一步推进。`, {
            intent: 'trial',
            highlights: [
                { label: '已识别关注点', value: '经验匹配 / 就近通勤', tone: 'positive' },
                { label: '下一步', value: '试岗或电话沟通', tone: 'positive' },
            ],
        }),
    ];
}

function buildInitialScenarioState(seed: ConversationSeed, messages: ChatMessage[], stage: Conversation['stage'], visitedIntents: IntentKind[]): ConversationScenarioState {
    const conversationId = buildConversationId(seed);
    const focusTopics = uniqueStrings([
        ...readStringArray(seed.meta, 'tags'),
        ...readStringArray(seed.meta, 'skillTags'),
        ...readStringArray(seed.meta, 'healthTags'),
        readString(seed.meta, 'salary'),
        readString(seed.meta, 'location'),
    ]).slice(0, 4);

    const tempConversation: Conversation = {
        id: conversationId,
        appMode: seed.appMode,
        sourceType: seed.sourceType,
        sourceId: seed.sourceId,
        title: seed.title,
        participantName: seed.participantName,
        lastMessagePreview: messages[messages.length - 1]?.content ?? '',
        lastMessageAt: messages[messages.length - 1]?.createdAt ?? new Date().toISOString(),
        unreadCount: 0,
        personaId: getPersonaForMode(seed.appMode).id,
        stage,
        contextTags: focusTopics,
        lastIntent: visitedIntents[visitedIntents.length - 1] ?? 'greeting',
        demoPriority: readNumber(seed.meta, 'demoPriority', readString(seed.meta, 'demoScene') ? 10 : 1),
        meta: seed.meta,
    };

    const context: ScenarioEngineContext = {
        conversation: tempConversation,
        messages,
        latestUserMessage: [...messages].reverse().find((message) => message.role === 'user'),
    };

    return {
        conversationId,
        stage,
        visitedIntents,
        recommendedNextActions: buildSuggestions(context, visitedIntents),
        focusTopics,
        summaryCards: buildSummaryCards(context),
    };
}

function buildSuggestions(context: ScenarioEngineContext, visitedIntents: IntentKind[]) {
    const mode = context.conversation.appMode;
    const hasIntent = (intent: IntentKind) => visitedIntents.includes(intent);

    if (mode === 'c-end') {
        const suggestions: SuggestionItem[] = [];

        if (!hasIntent('schedule')) {
            suggestions.push({
                id: 'ask-schedule',
                label: '这个岗位上班时间怎么安排？',
                category: 'next-question',
                intent: 'schedule',
                reason: '老师能马上看到系统会围绕排班节奏给出适老化解释。',
            });
        }
        if (!hasIntent('salary')) {
            suggestions.push({
                id: 'ask-salary',
                label: '这份工作薪资和福利怎么组合？',
                category: 'next-question',
                intent: 'salary',
                reason: '便于展示聊天不仅会回消息，还会提炼待遇信息。',
            });
        }
        suggestions.push({
            id: 'ask-fit',
            label: '这个岗位为什么会推荐给我？',
            category: 'showcase',
            intent: 'fit',
            reason: '适合展示平台如何解释匹配度、距离和适老标签。',
        });
        suggestions.push({
            id: 'ask-safety',
            label: '平台沟通会不会收保证金？',
            category: 'showcase',
            intent: 'safety',
            reason: '可以顺手展示安全提示和平台保障。',
        });
        suggestions.push({
            id: 'push-trial',
            label: '如果合适，我可以先试岗看看吗？',
            category: 'conversion',
            intent: 'trial',
            reason: '把会话推进到试岗，作为答辩压轴动作最自然。',
        });
        return suggestions.slice(0, 5);
    }

    const suggestions: SuggestionItem[] = [];
    if (!hasIntent('experience')) {
        suggestions.push({
            id: 'ask-experience',
            label: '您之前做过哪些相关工作？',
            category: 'next-question',
            intent: 'experience',
            reason: '方便展示候选人经验会被系统识别和提炼。',
        });
    }
    if (!hasIntent('schedule')) {
        suggestions.push({
            id: 'ask-availability',
            label: '方便介绍一下您能接受的排班时间吗？',
            category: 'next-question',
            intent: 'availability',
            reason: '展示系统对排班和到岗时间的敏感度。',
        });
    }
    suggestions.push({
        id: 'ask-fit-b',
        label: '这份岗位为什么可能适合您长期做？',
        category: 'showcase',
        intent: 'fit',
        reason: '适合展示经验、稳定性和就近匹配之间的关系。',
    });
    suggestions.push({
        id: 'push-conversion-b',
        label: '这边支持就近安排，您愿意继续电话沟通吗？',
        category: 'conversion',
        intent: 'trial',
        reason: '作为企业侧收口动作，便于继续展示下一步推进。',
    });
    return suggestions.slice(0, 4);
}

function buildSummaryCards(context: ScenarioEngineContext): SummaryCard[] {
    const meta = context.conversation.meta;
    if (context.conversation.appMode === 'c-end') {
        const tags = readStringArray(meta, 'tags');
        return [
            {
                id: 'summary-salary',
                title: '薪资区间',
                value: readString(meta, 'salary', '面议'),
                tone: 'positive',
            },
            {
                id: 'summary-schedule',
                title: '排班提示',
                value: tags.find((tag) => /(半天|弹性|夜班)/.test(tag)) ?? tags[0] ?? '可沟通安排',
                tone: 'neutral',
            },
            {
                id: 'summary-reason',
                title: '推荐原因',
                value: `${readString(meta, 'location', '就近')} / ${readNumber(meta, 'matchRate', 90)}%契合`,
                tone: 'positive',
            },
        ];
    }

    const skills = readStringArray(meta, 'skillTags');
    const healthTags = readStringArray(meta, 'healthTags');
    return [
        {
            id: 'summary-skill',
            title: '核心技能',
            value: skills.slice(0, 2).join('、') || '经验待沟通',
            tone: 'positive',
        },
        {
            id: 'summary-salary-b',
            title: '期望薪资',
            value: readString(meta, 'expectedSalary', '面议'),
            tone: 'neutral',
        },
        {
            id: 'summary-health',
            title: '到岗关注',
            value: healthTags[0] ?? '时间灵活',
            tone: 'neutral',
        },
    ];
}

export const scenarioEngine: ScenarioEngine = {
    bootstrap(seed): ScenarioBootstrap {
        const scene = readString(seed.meta, 'demoScene');
        const conversationId = buildConversationId(seed);
        const initialMessages = scene === 'ai-chat-showcase'
            ? buildAiShowcaseMessages(seed, conversationId)
            : [buildBootstrapMessage(seed, conversationId)];
        const visitedIntents = uniqueStrings(initialMessages.map((message) => message.intent).filter(Boolean) as IntentKind[]) as IntentKind[];
        const stage = deriveStageFromIntents(visitedIntents);
        const scenarioState = buildInitialScenarioState(seed, initialMessages, stage, visitedIntents.length > 0 ? visitedIntents : ['greeting']);

        return {
            initialMessages,
            conversationPatch: {
                personaId: getPersonaForMode(seed.appMode).id,
                stage,
                contextTags: scenarioState.focusTopics,
                lastIntent: scenarioState.visitedIntents[scenarioState.visitedIntents.length - 1] ?? 'greeting',
                demoPriority: readNumber(seed.meta, 'demoPriority', scene ? 10 : 1),
            },
            scenarioState,
        };
    },

    async advance(context): Promise<ScenarioAdvanceResult> {
        const latest = context.latestUserMessage;
        const match = matchIntent(latest?.content ?? '', context.conversation.appMode);
        const nextVisitedIntents = uniqueStrings([
            ...(context.scenarioState?.visitedIntents ?? []),
            match.intent,
        ]) as IntentKind[];
        const nextStage = deriveStageFromIntents(nextVisitedIntents);
        const nextContextTags = uniqueStrings([
            ...buildContextTags(context.conversation),
            ...match.keywords,
            stageLabel(nextStage),
        ]).slice(0, 8);
        const conversationPatch = {
            stage: nextStage,
            contextTags: nextContextTags,
            lastIntent: match.intent,
            demoPriority: context.conversation.demoPriority,
        };
        const reply = composeReply(context, match.intent);
        const nextConversation: Conversation = {
            ...context.conversation,
            ...conversationPatch,
        };
        const baseScenarioState: ConversationScenarioState = {
            conversationId: context.conversation.id,
            stage: nextStage,
            visitedIntents: nextVisitedIntents,
            recommendedNextActions: [],
            focusTopics: nextContextTags.slice(0, 4),
            summaryCards: [],
        };
        const nextContext: ScenarioEngineContext = {
            ...context,
            conversation: nextConversation,
            scenarioState: baseScenarioState,
        };

        const scenarioState: ConversationScenarioState = {
            ...baseScenarioState,
            recommendedNextActions: buildSuggestions(nextContext, nextVisitedIntents),
            summaryCards: buildSummaryCards(nextContext),
        };

        return {
            reply,
            conversationPatch,
            scenarioState,
        };
    },

    suggest(context) {
        const visited = context.scenarioState?.visitedIntents ?? [];
        return buildSuggestions(context, visited);
    },

    summarize(context) {
        return buildSummaryCards(context);
    },
};
