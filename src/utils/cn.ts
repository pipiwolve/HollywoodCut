import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 Tailwind 类名的工具函数
 * 解决 clsx 和 tailwind-merge 的组合使用，避免样式冲突
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
