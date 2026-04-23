import type { Candidate, ConversationSeed, Job } from '../types/domain';

interface SeedOptions {
    demoScene?: string;
    demoPriority?: number;
    extraMeta?: Record<string, unknown>;
}

export function buildConversationId(seed: Pick<ConversationSeed, 'appMode' | 'sourceType' | 'sourceId'>) {
    return `${seed.appMode}__${seed.sourceType}__${seed.sourceId}`;
}

export function createJobConversationSeed(job: Job, options: SeedOptions = {}): ConversationSeed {
    return {
        appMode: 'c-end',
        sourceType: 'job',
        sourceId: job.id,
        title: `${job.company} · ${job.title}`,
        participantName: job.company,
        meta: {
            title: job.title,
            company: job.company,
            salary: job.salary,
            location: job.location,
            tags: job.tags,
            desc: job.desc,
            matchRate: job.matchRate,
            demoScene: options.demoScene,
            demoPriority: options.demoPriority,
            ...options.extraMeta,
        },
    };
}

export function createCandidateConversationSeed(candidate: Candidate, options: SeedOptions = {}): ConversationSeed {
    return {
        appMode: 'b-end',
        sourceType: 'candidate',
        sourceId: candidate.id,
        title: `${candidate.name} · ${candidate.expectedSalary}`,
        participantName: candidate.name,
        meta: {
            name: candidate.name,
            expectedSalary: candidate.expectedSalary,
            healthTags: candidate.healthTags,
            skillTags: candidate.skillTags,
            desc: candidate.desc,
            avatar: candidate.avatar,
            demoScene: options.demoScene,
            demoPriority: options.demoPriority,
            ...options.extraMeta,
        },
    };
}
