import initialCandidates from '../mock/candidates.json';
import { createLocalBox } from './localBox';
import type { Candidate, ResumeDraft } from '../types/domain';

const STORAGE_KEY_MY_RESUME = 'zhilinghui_my_resume';
const SELF_RESUME_ID = 'cand-self';
const SELF_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=f59e0b';

type CandidateInput = {
    id?: string;
    name: string;
    age: string | number;
    gender: string;
    expectedSalary: string;
    desc: string;
    healthTags?: string[];
    skillTags?: string[];
    avatar?: string;
    isSelf?: boolean;
};

function normalizeCandidate(candidate: CandidateInput): Candidate {
    return {
        id: candidate.id ?? `cand-${Date.now()}`,
        name: candidate.name,
        age: String(candidate.age ?? ''),
        gender: candidate.gender,
        expectedSalary: candidate.expectedSalary,
        healthTags: Array.isArray(candidate.healthTags) ? candidate.healthTags : [],
        skillTags: Array.isArray(candidate.skillTags) ? candidate.skillTags : [],
        desc: candidate.desc,
        avatar: candidate.avatar ?? SELF_AVATAR,
        isSelf: Boolean(candidate.isSelf),
    };
}

const resumeBox = createLocalBox<Candidate | null>({
    key: STORAGE_KEY_MY_RESUME,
    version: 2,
    initialValue: () => null,
    migrate: (raw) => {
        if (typeof raw === 'object' && raw !== null) {
            const migrated = raw as Partial<Candidate>;
            if (typeof migrated.name === 'string') {
                return normalizeCandidate({
                    ...migrated,
                    name: migrated.name,
                    id: SELF_RESUME_ID,
                    avatar: migrated.avatar ?? SELF_AVATAR,
                    isSelf: true,
                    age: migrated.age ?? '',
                    gender: migrated.gender ?? '男',
                    expectedSalary: migrated.expectedSalary ?? '3-4K',
                    desc: migrated.desc ?? '',
                });
            }
        }
        return null;
    },
});

const baseCandidates = initialCandidates.map((candidate) => normalizeCandidate(candidate));

export function getMyResume() {
    return resumeBox.read();
}

export function saveMyResume(resume: ResumeDraft): Candidate {
    const savedResume = normalizeCandidate({
        ...resume,
        id: SELF_RESUME_ID,
        avatar: SELF_AVATAR,
        isSelf: true,
    });
    resumeBox.write(savedResume);
    return savedResume;
}

export function clearMyResume() {
    resumeBox.clear();
    return null;
}

export function getCandidates() {
    const myResume = getMyResume();
    return myResume ? [myResume, ...baseCandidates] : baseCandidates;
}

export function findCandidateById(id: string) {
    return getCandidates().find((candidate) => candidate.id === id) ?? null;
}

export function createDemoResume(): ResumeDraft {
    return {
        name: '王大爷',
        age: '60',
        gender: '男',
        expectedSalary: '3-4K',
        healthTags: ['硬朗能干体力活', '无心脑血管疾病'],
        skillTags: ['擅长维修', '精通绿化', '熟悉电脑基础'],
        desc: '退休前做过设备维修和社区协调，沟通耐心，住得近，希望找一份离家近、时间稳定的工作。',
    };
}
