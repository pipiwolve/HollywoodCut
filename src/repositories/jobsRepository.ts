import initialJobs from '../mock/jobs.json';
import { createLocalBox } from './localBox';
import type { Job } from '../types/domain';

const STORAGE_KEY_JOBS = 'zhilinghui_jobs';

const defaultCreatedAt = '2026-01-01T09:00:00.000Z';

function normalizeJob(input: Partial<Job> & Pick<Job, 'title' | 'company' | 'salary' | 'location' | 'desc'>): Job {
    return {
        id: input.id ?? `job-${Date.now()}`,
        title: input.title,
        company: input.company,
        salary: input.salary,
        location: input.location,
        matchRate: typeof input.matchRate === 'number' ? input.matchRate : 88,
        tags: Array.isArray(input.tags) ? input.tags : [],
        desc: input.desc,
        createdAt: input.createdAt ?? defaultCreatedAt,
    };
}

const jobsBox = createLocalBox<Job[]>({
    key: STORAGE_KEY_JOBS,
    version: 2,
    initialValue: () => initialJobs.map((job) => normalizeJob(job)),
    migrate: (raw) => {
        if (Array.isArray(raw)) {
            return raw
                .filter((item): item is Partial<Job> & Pick<Job, 'title' | 'company' | 'salary' | 'location' | 'desc'> => typeof item === 'object' && item !== null)
                .map((job) => normalizeJob(job));
        }
        return initialJobs.map((job) => normalizeJob(job));
    },
});

function sortJobs(jobs: Job[]) {
    return [...jobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getJobs() {
    return sortJobs(jobsBox.read());
}

export function setJobs(jobs: Job[]) {
    return jobsBox.write(sortJobs(jobs.map((job) => normalizeJob(job))));
}

export function addJob(job: Omit<Job, 'id' | 'createdAt'> & Partial<Pick<Job, 'matchRate'>>): Job {
    const newJob = normalizeJob({
        ...job,
        id: `job-${Date.now()}`,
        createdAt: new Date().toISOString(),
    });
    jobsBox.update((current) => sortJobs([newJob, ...current]));
    return newJob;
}

export function resetJobs() {
    return jobsBox.reset();
}

export function findJobById(id: string) {
    return getJobs().find((job) => job.id === id) ?? null;
}

export function createDemoJob(): Job {
    return normalizeJob({
        id: 'job-demo-community',
        title: '社区活动登记员',
        company: '静安邻里服务中心',
        salary: '3500-4200元',
        location: '距离您 900m',
        matchRate: 97,
        tags: ['就近分配', '下午半天上班', '弹性工作'],
        desc: '负责社区活动签到、物资登记和现场秩序维护，工作时间友好，适合沟通耐心、熟悉社区环境的长者。',
        createdAt: new Date().toISOString(),
    });
}
