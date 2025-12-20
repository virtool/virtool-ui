import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLocation, useParams, useSearch } from "wouter";

function subscribeToTime(callback: () => void) {
    const interval = setInterval(callback, 1000);
    return () => clearInterval(interval);
}

/**
 * Subscribe to the current time, updating every second.
 *
 * Uses useSyncExternalStore for React Compiler compatibility.
 */
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

/**
 * Aliased useParams from wouter
 */
export const usePathParams = useParams;

/**
 * get a function for programmatic internal navigation
 */
export function useNavigate() {
    const [, navigate] = useLocation();

    return navigate;
}
export function formatPath(
    basePath: string,
    searchParams: Record<string, string | number | boolean | null>,
) {
    return basePath + formatSearchParams(searchParams);
}

/**
 * Format a collection of search parameters into a search string
 *
 * @param params - the collection of values to be written to the URL
 */
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

/**
 * create a modified search string with an updated key:value based on the existing search string
 *
 * @param value - The value to be used in the search parameter
 * @param key - The search parameter key to be managed
 * @param search - The current search string
 */
export function updateSearchParam(key: string, value: string, search: string) {
    const params = new URLSearchParams(search);

    if (value) {
        params.set(key, String(value));
    } else {
        params.delete(key);
    }

    return `?${params.toString()}`;
}

/**
 * Updates the URL search parameters by either setting a new value for a given key or removing the key-value pair
 *
 * @param value - The value to be used in the search parameter
 * @param key - The search parameter key to be managed
 * @param navigate - navigate the URL to the passed string
 * @param search - URL search string containing the search params
 * @param location - the base URL
 */
function updateUrlSearchParams(
    value: string,
    key: string,
    navigate: navigate,
    search: string,
    location: string,
) {
    const params = new URLSearchParams(search);

    params.set(key, String(value));

    search = params.toString();
    if (search && location !== "/") {
        navigate(`${location}?${search}`, { replace: true });
    } else if (search) {
        navigate(`?${search}`, { replace: true });
    } else {
        navigate(location, { replace: true });
    }

    return search;
}

/**
 * Updates the URL search parameters by either adding a new value for a given key or removing the key-value pair
 *
 * @param key - The search parameter key to be managed
 * @param navigate - navigate the URL to the passed string
 * @param search - URL search string containing the search params
 * @param values - The values to be used in the search parameter
 */
function updateUrlSearchParamsList(
    key: string,
    navigate: navigate,
    search: string,
    values: SearchParam[],
) {
    const params = new URLSearchParams(search);

    params.delete(key);
    values.forEach((value) => params.append(key, String(value)));

    search = `?${params.toString()}`;
    navigate(search);
    return search;
}
/**
 * Updates the URL search parameters by either setting a new value for a given key or removing the key-value pair
 *
 * @param key - The search parameter key to be managed
 * @param navigate - navigate the URL to the passed string
 * @param search - URL search string containing the search params
 * @param location - the base URL
 */
function unsetUrlSearchParam(key, navigate, search, location) {
    const params = new URLSearchParams(search);
    params.delete(key);

    search = params.toString();
    if (search && location !== "/") {
        navigate(`${location}?${search}`, { replace: true });
    } else if (search) {
        navigate(`?${search}`, { replace: true });
    } else {
        navigate(location, { replace: true });
    }

    return search;
}

type SearchParam = string | boolean | number | null;

type navigate = <S>(
    to: string | URL,
    options?: { replace?: boolean; state?: S },
) => void;

/**
 * Attempt to cast a search param value into the correct type
 *
 * @param value - search param value to be converted
 */
function castSearchParamValue(value: string) {
    if (value === null) {
        return undefined;
    }

    const trimValue = value.trim();
    const numValue = Number(trimValue);
    if (value.trim().length > 0 && !isNaN(numValue)) {
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

/**
 * Store and retrieve stringified component state in a URL search parameter
 *
 * @param key - The search parameter key to be managed
 * @param defaultValue - The default value to use when the search parameter key is not present in the URL
 * @returns The current value and a functions for setting the URL search parameter
 */
export function useNaiveUrlSearchParam(
    key: string,
    defaultValue?: SearchParam,
): {
    value: string;
    setValue: (value: SearchParam) => void;
    unsetValue: () => void;
} {
    const search = useSearch();
    const [location] = useLocation();
    const navigate = useNavigate();

    const value = new URLSearchParams(search).get(key);

    useEffect(() => {
        if (
            defaultValue !== undefined &&
            !new URLSearchParams(search).has(key)
        ) {
            updateUrlSearchParams(
                String(defaultValue),
                key,
                navigate,
                search,
                location,
            );
        }
    }, []);

    function setURLSearchParam(newValue: string) {
        updateUrlSearchParams(newValue, key, navigate, search, location);
    }

    function unsetValue() {
        unsetUrlSearchParam(key, navigate, search, location);
    }

    return {
        value:
            value ?? (defaultValue !== undefined ? String(defaultValue) : null),
        setValue: (value: SearchParam) => setURLSearchParam(String(value)),
        unsetValue,
    };
}

/**
 * Hook for managing and synchronizing a list of URL search parameters with a component's state
 *
 * @param key - The search parameter key to be managed
 * @param defaultValues - The default values to use when the search parameter key is not present in the URL
 * @returns The current values and a function to set the URL search parameter
 */
export function useListSearchParam<T extends SearchParam>(
    key: string,
    defaultValues?: T[],
): { values: T[]; setValues: (newValue: T[]) => void } {
    const search = useSearch();
    const navigate = useNavigate();

    const values = new URLSearchParams(search).getAll(key);

    useEffect(() => {
        if (
            defaultValues?.length &&
            !new URLSearchParams(search).getAll(key).length
        ) {
            updateUrlSearchParamsList(key, navigate, search, defaultValues);
        }
    }, []);

    function setValues(newValues: T[]) {
        updateUrlSearchParamsList(key, navigate, search, newValues);
    }

    const effectiveValues = values.length
        ? values
        : ((defaultValues as string[]) ?? []);

    return {
        values: effectiveValues.map(castSearchParamValue) as T[],
        setValues,
    };
}

/**
 * Store and retrieve component state in a URL search parameter
 *
 * @param key - The search parameter key to be managed
 * @param defaultValue - The default value to use when the search parameter key is not present in the URL
 * @returns The current value and a functions for setting the URL search parameter
 */
export function useUrlSearchParam<T extends SearchParam>(
    key: string,
    defaultValue?: T,
) {
    const { value, ...rest } = useNaiveUrlSearchParam(key, defaultValue);

    return { value: castSearchParamValue(value) as T, ...rest };
}

/**
 * Store dialog visibility in within the URL search params
 *
 * @param key - the key that the dialog visibility state is stored under
 * @returns Whether the dialog is open and a callback to set the dialog state
 */
export function useDialogParam(key: string) {
    const {
        value: open,
        setValue,
        unsetValue,
    } = useUrlSearchParam<boolean | undefined>(key);

    function setDialogValue(value: boolean) {
        if (value) {
            setValue(value);
        } else {
            unsetValue();
        }
    }

    return { open: open || false, setOpen: setDialogValue };
}

/**
 * Store the current page of a resources into the URL search params
 * @returns The current page and a function to change the page
 */
export function usePageParam() {
    const {
        value: page,
        setValue: setPage,
        unsetValue: unsetPage,
    } = useUrlSearchParam<number>("page");
    return { page: page || 1, setPage, unsetPage };
}

/**
 * Determine if the pass path matches the start of the URL path
 *
 * Note: ignores search params
 *
 * @param path - the path to check against the current URL
 * @param exclude - A list of paths to never match
 * @returns flag indicating if the passed path matches the current URL
 */
export function useMatchPartialPath(path: string, exclude?: string[]) {
    const [location] = useLocation();

    if (exclude?.includes(location)) {
        return false;
    }

    return location.startsWith(path.split("?")[0].replace(/\/+$/, ""));
}
