import { create } from 'zustand';

interface AppState {
    // 当前处于哪一端：'c-end' (长者端) 还是 'b-end' (企业端)
    appMode: 'c-end' | 'b-end';
    toggleAppMode: () => void;
    // 模拟当前登录用户的简单信息演示
    currentUser: {
        name: string;
        avatar: string;
    };
}

export const useAppStore = create<AppState>((set) => ({
    appMode: 'c-end', // 默认进入长者端
    toggleAppMode: () => set((state) => ({
        appMode: state.appMode === 'c-end' ? 'b-end' : 'c-end'
    })),
    currentUser: {
        name: '王大爷',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=f59e0b',
    }
}));
