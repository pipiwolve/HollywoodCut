import initialJobs from '../mock/jobs.json';
import initialCandidates from '../mock/candidates.json';

const STORAGE_KEY_JOBS = 'zhilinghui_jobs';
const STORAGE_KEY_MY_RESUME = 'zhilinghui_my_resume';

// --- 岗位相关 ---
export function getJobs() {
    const local = localStorage.getItem(STORAGE_KEY_JOBS);
    if (local) {
        return JSON.parse(local);
    }
    // 如果本地没有，写入默认 mock 数据并返回
    localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(initialJobs));
    return initialJobs;
}

export function addJob(job: any) {
    const jobs = getJobs();
    const newJob = { ...job, id: `job-${Date.now()}` };
    const updated = [newJob, ...jobs];
    localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(updated));
    return updated;
}

// --- 长者简历相关 ---
export function getCandidates() {
    // 这部分为了演示 B 端大厅，直接返回静态 Mock 数据即可
    // 如果未来要将 C 端的"我的简历"发布到这里，可以在这合并数据
    const myResumeStr = localStorage.getItem(STORAGE_KEY_MY_RESUME);
    if (myResumeStr) {
        const myResume = JSON.parse(myResumeStr);
        return [myResume, ...initialCandidates];
    }
    return initialCandidates;
}

// 我的微简历（C端用户当前保存在本地的资料）
export function getMyResume() {
    const local = localStorage.getItem(STORAGE_KEY_MY_RESUME);
    if (local) {
        return JSON.parse(local);
    }
    return null;
}

export function saveMyResume(resume: any) {
    const newResume = {
        ...resume,
        id: `cand-my-${Date.now()}`,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=f59e0b'
    };
    localStorage.setItem(STORAGE_KEY_MY_RESUME, JSON.stringify(newResume));
    return newResume;
}
