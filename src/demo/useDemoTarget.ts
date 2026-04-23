import { useCallback, useRef } from 'react';
import { demoTargetRegistry } from './targetRegistry';

export function useDemoTarget<T extends HTMLElement>(key: string) {
    const latestNodeRef = useRef<T | null>(null);

    return useCallback((node: T | null) => {
        if (latestNodeRef.current && latestNodeRef.current !== node) {
            demoTargetRegistry.unregisterTarget(key);
        }

        latestNodeRef.current = node;

        if (node) {
            demoTargetRegistry.registerTarget(key, node);
        } else {
            demoTargetRegistry.unregisterTarget(key);
        }
    }, [key]);
}
