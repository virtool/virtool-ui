/**
 * Coercion helpers for route `validateSearch` functions.
 *
 * `validateSearch` is a critical route export: the router calls it synchronously
 * while matching, so whatever it imports lands in the eager bundle every page
 * load pays for. Zod schemas here cost ~108 KB of that bundle, so search params
 * are validated with these dependency-free helpers instead.
 *
 * The router parses each raw param with `JSON.parse`, so `?page=2` arrives as
 * the number `2` and `?labels=[1,2]` as an array. Every helper takes `unknown`
 * and falls back rather than throwing — a malformed URL should render the page,
 * not an error boundary.
 */

export function str(value: unknown, fallback: string): string {
	return typeof value === "string" ? value : fallback;
}

export function strOptional(value: unknown): string | undefined {
	return typeof value === "string" ? value : undefined;
}

export function num(value: unknown, fallback: number): number {
	return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function bool(value: unknown, fallback: boolean): boolean {
	return typeof value === "boolean" ? value : fallback;
}

export function boolOptional(value: unknown): boolean | undefined {
	return typeof value === "boolean" ? value : undefined;
}

export function numberArray(value: unknown, fallback: number[]): number[] {
	return Array.isArray(value) &&
		value.every((item) => typeof item === "number" && Number.isFinite(item))
		? (value as number[])
		: fallback;
}

export function stringArray(value: unknown, fallback: string[]): string[] {
	return Array.isArray(value) && value.every((item) => typeof item === "string")
		? (value as string[])
		: fallback;
}

export function oneOf<T extends string>(
	value: unknown,
	allowed: ReadonlyArray<T>,
	fallback: T,
): T {
	return allowed.includes(value as T) ? (value as T) : fallback;
}

export function oneOfOptional<T extends string>(
	value: unknown,
	allowed: ReadonlyArray<T>,
): T | undefined {
	return allowed.includes(value as T) ? (value as T) : undefined;
}

/**
 * Coerce an array of allowed members, also accepting a bare member as a
 * one-element array so `?state=running` works as well as `?state=["running"]`.
 */
export function oneOfArray<T extends string>(
	value: unknown,
	allowed: ReadonlyArray<T>,
	fallback: T[],
): T[] {
	if (allowed.includes(value as T)) {
		return [value as T];
	}

	return Array.isArray(value) && value.every((item) => allowed.includes(item))
		? (value as T[])
		: fallback;
}
