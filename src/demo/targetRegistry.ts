export interface DemoTargetRegistry {
    registerTarget: (key: string, element: HTMLElement) => void;
    unregisterTarget: (key: string) => void;
    focusTarget: (key: string) => void;
    scrollToTarget: (key: string) => void;
    getTargetElement: (key: string) => HTMLElement | null;
}

const targets = new Map<string, HTMLElement>();

export const demoTargetRegistry: DemoTargetRegistry = {
    registerTarget(key, element) {
        element.dataset.demoTarget = key;
        targets.set(key, element);
    },
    unregisterTarget(key) {
        const element = targets.get(key);
        if (element?.dataset.demoTarget === key) {
            delete element.dataset.demoTarget;
        }
        targets.delete(key);
    },
    focusTarget(key) {
        const element = targets.get(key);
        element?.focus?.();
    },
    scrollToTarget(key) {
        const element = targets.get(key);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    },
    getTargetElement(key) {
        return targets.get(key) ?? null;
    },
};
