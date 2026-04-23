import { useEffect, useMemo, useState } from 'react';
import { demoTargetRegistry } from '../../demo/targetRegistry';

interface SpotlightRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

interface DemoSpotlightProps {
    targetKey: string | null;
    label?: string;
    visible: boolean;
}

export default function DemoSpotlight({ targetKey, label, visible }: DemoSpotlightProps) {
    const [rect, setRect] = useState<SpotlightRect | null>(null);

    useEffect(() => {
        if (!visible || !targetKey) {
            setRect(null);
            return;
        }

        let frameId = 0;
        let intervalId = 0;
        let timeoutId = 0;
        let stopped = false;

        const updateRect = () => {
            if (stopped) {
                return;
            }
            const element = demoTargetRegistry.getTargetElement(targetKey);
            if (!element) {
                setRect(null);
                return;
            }
            const box = element.getBoundingClientRect();
            setRect({
                top: box.top,
                left: box.left,
                width: box.width,
                height: box.height,
            });
        };

        updateRect();
        frameId = window.requestAnimationFrame(updateRect);
        timeoutId = window.setTimeout(updateRect, 220);
        intervalId = window.setInterval(updateRect, 180);
        window.addEventListener('resize', updateRect);
        window.addEventListener('scroll', updateRect, true);

        return () => {
            stopped = true;
            window.cancelAnimationFrame(frameId);
            window.clearTimeout(timeoutId);
            window.clearInterval(intervalId);
            window.removeEventListener('resize', updateRect);
            window.removeEventListener('scroll', updateRect, true);
        };
    }, [targetKey, visible]);

    const labelStyle = useMemo(() => {
        if (!rect) {
            return null;
        }
        return {
            top: Math.max(rect.top - 42, 16),
            left: Math.min(rect.left, window.innerWidth - 240),
        };
    }, [rect]);

    if (!visible || !rect) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-[104]">
            <div
                className="absolute rounded-[28px] border-2 border-sky-500/80 bg-sky-500/5 shadow-[0_0_0_9999px_rgba(15,23,42,0.12)] transition-all duration-300"
                style={{
                    top: rect.top - 8,
                    left: rect.left - 8,
                    width: rect.width + 16,
                    height: rect.height + 16,
                }}
            >
                <div className="absolute inset-0 animate-pulse rounded-[28px] border border-sky-400/70" />
            </div>
            {label && labelStyle && (
                <div
                    className="absolute rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-white shadow-lg"
                    style={labelStyle}
                >
                    {label}
                </div>
            )}
        </div>
    );
}
