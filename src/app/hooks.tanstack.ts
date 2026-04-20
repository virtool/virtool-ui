import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { castSearchParamValue, type SearchParam } from "./hooks";

// TanStack Router's navigate expects a strictly typed search reducer.
// The shim operates outside route-level type safety (strict: false),
// so we use this type to bypass the reducer constraint.
// biome-ignore lint/suspicious/noExplicitAny: shim operates outside strict route typing
type AnySearchReducer = any;

function castIfString(value: unknown): unknown {
	return typeof value === "string" ? castSearchParamValue(value) : value;
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
	const navigate = useNavigate();

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
	const navigate = useNavigate();

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

	const effectiveValues = values.length
		? values
		: ((defaultValues as string[]) ?? []);

	return {
		values: effectiveValues.map(castIfString) as T[],
		setValues,
	};
}

export function useDialogParam(key: string) {
	const search = useSearch({ strict: false }) as Record<string, unknown>;
	const navigate = useNavigate();

	const open = Boolean(search[key]);

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
