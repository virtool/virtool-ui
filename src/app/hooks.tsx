import { useEffect, useRef, useState, useSyncExternalStore } from "react";

export {
	useDialogParam,
	useListSearchParam,
	useNaiveUrlSearchParam,
	useNavigate,
	usePageParam,
	usePathParams,
	useUrlSearchParam,
} from "./hooks.tanstack";

export { useMatchPartialPath } from "./useMatchPartialPath.tanstack";

function subscribeToTime(callback: () => void) {
	const interval = setInterval(callback, 1000);
	return () => clearInterval(interval);
}

export function useNow() {
	return useSyncExternalStore(subscribeToTime, Date.now, Date.now);
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

export function formatPath(
	basePath: string,
	searchParams: Record<string, string | number | boolean | null>,
) {
	return basePath + formatSearchParams(searchParams);
}

export function formatSearchParams(
	params: Record<string, string | number | boolean | null>,
) {
	const searchParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (Array.isArray(value)) {
			value.forEach((arrayValue) =>
				searchParams.append(key, String(arrayValue)),
			);
		} else {
			searchParams.set(key, String(value));
		}
	});

	return `?${searchParams.toString()}`;
}

export function updateSearchParam(key: string, value: string, search: string) {
	const params = new URLSearchParams(search);

	if (value) {
		params.set(key, String(value));
	} else {
		params.delete(key);
	}

	return `?${params.toString()}`;
}

export type SearchParam = string | boolean | number | null;

export function castSearchParamValue(value: string) {
	if (value === null) {
		return undefined;
	}

	const trimValue = value.trim();
	const numValue = Number(trimValue);
	if (value.trim().length > 0 && !Number.isNaN(numValue)) {
		return numValue;
	}

	switch (value) {
		case "true":
			return true;
		case "false":
			return false;
		case "null":
			return null;
		default:
			break;
	}

	return value;
}
