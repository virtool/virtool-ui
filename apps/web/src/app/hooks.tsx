import { useEffect, useRef, useState, useSyncExternalStore } from "react";

function subscribeToTime(callback: () => void) {
	const interval = setInterval(callback, 1000);
	return () => clearInterval(interval);
}

export function useNow() {
	return useSyncExternalStore(subscribeToTime, Date.now, Date.now);
}

/**
 * Returns `value` delayed until it has been stable for `delayMs`.
 */
export function useDebouncedValue<T>(value: T, delayMs = 250): T {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const id = setTimeout(() => setDebounced(value), delayMs);
		return () => clearTimeout(id);
	}, [value, delayMs]);

	return debounced;
}

/**
 * Two-way binding for an input whose committed value lives in the parent (URL,
 * store, etc.). Returns a local `draft` for the input and a setter; commits
 * `draft` to `onChange` after it's been stable for `delayMs`, and resyncs
 * `draft` when `value` changes externally (e.g. back/forward navigation).
 */
export function useDebouncedDraft<T>(
	value: T,
	onChange: (next: T) => void,
	delayMs?: number,
): [T, (next: T) => void] {
	const [draft, setDraft] = useState(value);
	const debouncedDraft = useDebouncedValue(draft, delayMs);
	const lastSentRef = useRef(value);

	useEffect(() => {
		if (debouncedDraft !== value) {
			lastSentRef.current = debouncedDraft;
			onChange(debouncedDraft);
		}
	}, [debouncedDraft, onChange, value]);

	useEffect(() => {
		if (value !== lastSentRef.current) {
			lastSentRef.current = value;
			setDraft(value);
		}
	}, [value]);

	return [draft, setDraft];
}

function getSize(ref) {
	return {
		height: ref.current ? ref.current.offsetHeight : 0,
		width: ref.current ? ref.current.offsetWidth : 0,
	};
}

type Size = {
	height: number;
	width: number;
};

export function useElementSize<T extends HTMLElement>(): [
	React.MutableRefObject<T>,
	Size,
] {
	const ref = useRef(null);
	const [size, setSize] = useState<Size>({ height: 0, width: 0 });

	useEffect(() => {
		function handleResize() {
			setSize(getSize(ref));
		}

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return [ref, size];
}

function formatSearchParams(
	params: Record<
		string,
		string | number | boolean | null | Array<string | number | boolean>
	>,
) {
	const searchParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (Array.isArray(value)) {
			value.forEach((arrayValue) => {
				searchParams.append(key, String(arrayValue));
			});
		} else {
			searchParams.set(key, String(value));
		}
	});

	return `?${searchParams.toString()}`;
}

export function formatPath(
	basePath: string,
	searchParams: Record<
		string,
		string | number | boolean | null | Array<string | number | boolean>
	>,
) {
	return basePath + formatSearchParams(searchParams);
}
