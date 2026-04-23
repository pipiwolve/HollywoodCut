import { create } from 'zustand';
import { addJob, createDemoJob, getJobs, resetJobs, setJobs } from '../repositories/jobsRepository';
import { clearMyResume, createDemoResume, getCandidates, getMyResume, saveMyResume } from '../repositories/resumeRepository';
import type { Candidate, Job, ResumeDraft } from '../types/domain';
import { useAppStore } from './useAppStore';

interface JobInput {
    title: string;
    company: string;
    salary: string;
    location: string;
    matchRate?: number;
    tags: string[];
    desc: string;
}

interface DataState {
    jobs: Job[];
    candidates: Candidate[];
    myResume: Candidate | null;
    hydrate: () => void;
    publishJob: (job: JobInput) => Job;
    saveResume: (resume: ResumeDraft) => Candidate;
    prefillDemoResume: () => Candidate;
    publishDemoJob: () => Job;
    resetCoreData: () => void;
}

function syncCurrentUserFromResume(candidate: Candidate | null) {
    if (candidate) {
        useAppStore.getState().updateCurrentUser({
            name: candidate.name,
            avatar: candidate.avatar,
        });
    } else {
        useAppStore.getState().resetCurrentUser();
    }
}

function getSnapshot() {
    const myResume = getMyResume();
    return {
        jobs: getJobs(),
        candidates: getCandidates(),
        myResume,
    };
}

export const useDataStore = create<DataState>((set) => ({
    jobs: [],
    candidates: [],
    myResume: null,

    hydrate: () => {
        const snapshot = getSnapshot();
        syncCurrentUserFromResume(snapshot.myResume);
        set(snapshot);
    },

    publishJob: (job) => {
        const created = addJob({
            ...job,
            matchRate: typeof job.matchRate === 'number' ? job.matchRate : 100,
        });
        set((state) => ({
            ...state,
            jobs: getJobs(),
        }));
        return created;
    },

    saveResume: (resume) => {
        const saved = saveMyResume(resume);
        syncCurrentUserFromResume(saved);
        set((state) => ({
            ...state,
            myResume: saved,
            candidates: getCandidates(),
        }));
        return saved;
    },

    prefillDemoResume: () => {
        const saved = saveMyResume(createDemoResume());
        syncCurrentUserFromResume(saved);
        set((state) => ({
            ...state,
            myResume: saved,
            candidates: getCandidates(),
        }));
        return saved;
    },

    publishDemoJob: () => {
        const demoJob = createDemoJob();
        const current = getJobs().filter((job) => job.id !== demoJob.id);
        setJobs([demoJob, ...current]);
        set((state) => ({
            ...state,
            jobs: getJobs(),
        }));
        return demoJob;
    },

    resetCoreData: () => {
        resetJobs();
        clearMyResume();
        syncCurrentUserFromResume(null);
        set(getSnapshot());
    },
}));

if (typeof window !== 'undefined') {
    useDataStore.getState().hydrate();
}
