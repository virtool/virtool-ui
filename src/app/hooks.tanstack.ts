import {
	useParams,
	useSearch,
	useNavigate as useTanStackNavigate,
} from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import { castSearchParamValue, type SearchParam } from "./hooks";

// TanStack Router's navigate expects a strictly typed search reducer.
// The shim operates outside route-level type safety (strict: false),
// so we use this type to bypass the reducer constraint.
// biome-ignore lint/suspicious/noExplicitAny: shim operates outside strict route typing
type AnySearchReducer = any;

function castIfString(value: unknown): unknown {
	if (value == null) {
		return undefined;
	}
	return typeof value === "string" ? castSearchParamValue(value) : value;
}

export function usePathParams<
	T extends Record<string, string> = Record<string, string>,
>(): T {
	return useParams({ strict: false } as any) as T;
}

export function useNavigate() {
	const navigate = useTanStackNavigate();

	return useCallback(
		(to: string, options?: { replace?: boolean }) => {
			const [path, searchStr] = to.split("?");
			const search = searchStr
				? Object.fromEntries(new URLSearchParams(searchStr))
				: undefined;
			navigate({
				to: path,
				search,
				replace: options?.replace,
			} as AnySearchReducer);
		},
		[navigate],
	);
}

export function useNaiveUrlSearchParam(
	key: string,
	defaultValue?: SearchParam,
): {
	value: string;
	setValue: (value: SearchParam) => void;
	unsetValue: () => void;
} {
	const search = useSearch({ strict: false }) as Record<string, unknown>;
	const navigate = useTanStackNavigate();

	useEffect(() => {
		if (defaultValue !== undefined && search[key] === undefined) {
			navigate({
				search: ((prev: Record<string, unknown>) => ({
					...prev,
					[key]: defaultValue,
				})) as AnySearchReducer,
				replace: true,
			});
		}
	}, [defaultValue, key, search[key], navigate]);

	const raw = search[key];
	const value =
		raw !== undefined
			? String(raw)
			: defaultValue !== undefined
				? String(defaultValue)
				: null;

	return {
		value,
		setValue: (value: SearchParam) =>
			navigate({
				search: ((prev: Record<string, unknown>) => ({
					...prev,
					[key]: value,
				})) as AnySearchReducer,
				replace: true,
			}),
		unsetValue: () =>
			navigate({
				search: ((prev: Record<string, unknown>) => ({
					...prev,
					[key]: undefined,
				})) as AnySearchReducer,
				replace: true,
			}),
	};
}

export function useUrlSearchParam<T extends SearchParam>(
	key: string,
	defaultValue?: T,
) {
	const { value, ...rest } = useNaiveUrlSearchParam(key, defaultValue);

	return { value: castIfString(value) as T, ...rest };
}

export function useListSearchParam<T extends SearchParam>(
	key: string,
	defaultValues?: T[],
): { values: T[]; setValues: (newValue: T[]) => void } {
	const search = useSearch({ strict: false }) as Record<string, unknown>;
	const navigate = useTanStackNavigate();

	const raw = search[key];
	const values = Array.isArray(raw) ? raw : [];

	useEffect(() => {
		if (defaultValues?.length && values.length === 0) {
			navigate({
				search: ((prev: Record<string, unknown>) => ({
					...prev,
					[key]: defaultValues,
				})) as AnySearchReducer,
				replace: true,
			});
		}
	}, [defaultValues, key, values.length, navigate]);

	function setValues(newValues: T[]) {
		navigate({
			search: ((prev: Record<string, unknown>) => ({
				...prev,
				[key]: newValues.length ? newValues : undefined,
			})) as AnySearchReducer,
		});
	}

	const effectiveValues = values.length ? values : (defaultValues ?? []);

	return {
		values: effectiveValues.map(castIfString) as T[],
		setValues,
	};
}

export function useDialogParam(key: string) {
	const search = useSearch({ strict: false }) as Record<string, unknown>;
	const navigate = useTanStackNavigate();

	const open = Boolean(castIfString(search[key]));

	function setOpen(value: boolean) {
		navigate({
			search: ((prev: Record<string, unknown>) => ({
				...prev,
				[key]: value || undefined,
			})) as AnySearchReducer,
			replace: true,
		});
	}

	return { open, setOpen };
}

export function usePageParam() {
	const {
		value: page,
		setValue: setPage,
		unsetValue: unsetPage,
	} = useUrlSearchParam<number>("page");
	return { page: page || 1, setPage, unsetPage };
}
