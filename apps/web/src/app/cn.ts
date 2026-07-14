import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names, resolving conflicting Tailwind utilities.
 */
export function cn(...args: ClassValue[]): string {
	return twMerge(clsx(args));
}
