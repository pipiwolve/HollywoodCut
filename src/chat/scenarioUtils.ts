import type { Conversation, IntentKind } from '../types/domain';

export function readString(meta: Record<string, unknown> | undefined, key: string, fallback = '') {
    const value = meta?.[key];
    return typeof value === 'string' ? value : fallback;
}

export function readNumber(meta: Record<string, unknown> | undefined, key: string, fallback = 0) {
    const value = meta?.[key];
    return typeof value === 'number' ? value : fallback;
}

export function readStringArray(meta: Record<string, unknown> | undefined, key: string) {
    const value = meta?.[key];
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

export function uniqueStrings(values: Array<string | undefined | null>) {
    return [...new Set(values.filter((value): value is string => Boolean(value?.trim())).map((value) => value.trim()))];
}

export function buildContextTags(conversation: Conversation) {
    const meta = conversation.meta;
    return uniqueStrings([
        ...conversation.contextTags,
        ...readStringArray(meta, 'tags'),
        ...readStringArray(meta, 'skillTags'),
        ...readStringArray(meta, 'healthTags'),
        readString(meta, 'salary'),
        readString(meta, 'location'),
    ]).slice(0, 8);
}

const stageOrder: IntentKind[] = ['greeting', 'fit', 'salary', 'schedule', 'trial'];

export function deriveStageFromIntents(intents: IntentKind[]) {
    if (intents.includes('trial') || intents.includes('availability')) {
        return 'conversion' as const;
    }
    if (intents.includes('schedule')) {
        return 'schedule' as const;
    }
    if (intents.includes('salary')) {
        return 'salary' as const;
    }
    if (intents.includes('skills') || intents.includes('experience') || intents.includes('fit')) {
        return 'fit' as const;
    }
    if (intents.some((intent) => stageOrder.includes(intent))) {
        return 'discovery' as const;
    }
    return 'intro' as const;
}
