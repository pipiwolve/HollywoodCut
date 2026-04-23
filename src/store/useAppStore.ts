import { create } from 'zustand';
import type { AppMode } from '../types/domain';

interface CurrentUser {
    name: string;
    avatar: string;
}

interface AppState {
    appMode: AppMode;
    currentUser: CurrentUser;
    toggleAppMode: () => void;
    setAppMode: (mode: AppMode) => void;
    updateCurrentUser: (user: Partial<CurrentUser>) => void;
    resetCurrentUser: () => void;
}

const defaultCurrentUser: CurrentUser = {
    name: '王大爷',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=f59e0b',
};

export const useAppStore = create<AppState>((set) => ({
    appMode: 'c-end',
    currentUser: defaultCurrentUser,
    toggleAppMode: () => set((state) => ({
        appMode: state.appMode === 'c-end' ? 'b-end' : 'c-end',
    })),
    setAppMode: (mode) => set({ appMode: mode }),
    updateCurrentUser: (user) => set((state) => ({
        currentUser: {
            ...state.currentUser,
            ...user,
        },
    })),
    resetCurrentUser: () => set({ currentUser: defaultCurrentUser }),
}));
