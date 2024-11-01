import { forEach } from "lodash-es/lodash";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useParams, useSearch } from "wouter";
import { map } from "lodash";

const getSize = ref => ({
    height: ref.current ? ref.current.offsetHeight : 0,
    width: ref.current ? ref.current.offsetWidth : 0,
});

type Size = {
    height: number;
    width: number;
};

export function useElementSize<T extends HTMLElement>(): [React.MutableRefObject<T>, Size] {
    const ref = useRef(null);

    const [size, setSize] = useState<{ height: number; width: number }>(getSize(ref));

    const handleResize = () => {
        setSize(getSize(ref));
    };

    useEffect(() => {
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
export function formatPath(basePath: string, searchParams: Record<string, string | number | boolean | null>) {
    return basePath + formatSearchParams(searchParams);
}

/**
 * Format a collection of search parameters into a search string
 *
 * @param params - the collection of values to be written to the URL
 */
export function formatSearchParams(params: Record<string, string | number | boolean | null>) {
    const searchParams = new URLSearchParams();

    forEach(params, (value, key) => {
        if (Array.isArray(value)) {
            forEach(value, arrayValue => searchParams.append(key, arrayValue));
        } else {
            searchParams.set(key, value);
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
function updateUrlSearchParams(value: string, key: string, navigate: navigate, search: string, location: string) {
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
function updateUrlSearchParamsList(key: string, navigate: navigate, search: string, values: SearchParam[]) {
    const params = new URLSearchParams(search);

    params.delete(key);
    forEach(values, value => params.append(key, value));

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

type navigate = <S>(to: string | URL, options?: { replace?: boolean; state?: S }) => void;

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

function createUseUrlSearchParam(): [
    <T extends SearchParam>(
        key: string,
        defaultValue?: T,
    ) => {
        value: T;
        setValue: (value: T) => void;
        unsetValue: () => void;
    },
    <T extends SearchParam>(key: string, defaultValues?: T[]) => { values: T[]; setValues: (newValue: T[]) => void },
] {
    const cache = { search: "" };

    /**
     * Store and retrieve component state in a URL search parameter
     *
     * @param key - The search parameter key to be managed
     * @param defaultValue - The default value to use when the search parameter key is not present in the URL
     * @returns The current value and a functions for setting the URL search parameter
     */
    function useUrlSearchParam<T extends SearchParam>(
        key: string,
        defaultValue?: T,
    ): { value: T; setValue: (value: T) => void; unsetValue: () => void } {
        cache.search = useSearch();
        const [location] = useLocation();

        const navigate = useNavigate();
        const firstRender = useRef(true);

        let value = new URLSearchParams(cache.search).get(key);

        if (firstRender.current && defaultValue && !value) {
            firstRender.current = false;
            value = String(defaultValue);
            cache.search = updateUrlSearchParams(String(defaultValue), key, navigate, cache.search, location);
        }

        firstRender.current = false;

        function setURLSearchParam(value) {
            cache.search = updateUrlSearchParams(value, key, navigate, cache.search, location);
        }

        function unsetValue() {
            cache.search = unsetUrlSearchParam(key, navigate, cache.search, location);
        }

        return {
            value: castSearchParamValue(value) as T,
            setValue: (value: T) => setURLSearchParam(String(value)),
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
    function useListSearchParam<T extends SearchParam>(
        key: string,
        defaultValues?: T[],
    ): { values: T[]; setValues: (newValue: T[]) => void } {
        cache.search = useSearch();
        const navigate = useNavigate();
        const firstRender = useRef(true);

        let values = new URLSearchParams(cache.search).getAll(key);

        if (firstRender.current && defaultValues && !values.length) {
            values = defaultValues as string[];
            cache.search = updateUrlSearchParamsList(key, navigate, cache.search, values);
        }

        firstRender.current = false;

        function setValues(values: T[]) {
            cache.search = updateUrlSearchParamsList(key, navigate, cache.search, values);
        }

        return {
            values: map(values, castSearchParamValue) as T[],
            setValues,
        };
    }

    return [useUrlSearchParam, useListSearchParam];
}

export const [useUrlSearchParam, useListSearchParam] = createUseUrlSearchParam();

/**
 * Store dialog visibility in within the URL search params
 *
 * @param key - the key that the dialog visiblity state is stored under
 */
export function useDialogParam(key: string) {
    const { value: open, setValue, unsetValue } = useUrlSearchParam<boolean>(key);

    function setDialogValue(value: boolean) {
        if (value) {
            setValue(value);
        } else {
            unsetValue();
        }
    }

    return { open, setOpen: setDialogValue };
}

/**
 * Store the current page of a resources into the URL search params
 */
export function usePageParam() {
    const { value: page, setValue: setPage, unsetValue: unsetPage } = useUrlSearchParam<number>("page");
    return { page: page || 1, setPage, unsetPage };
}

type ScrollSyncProps = {
    children: React.ReactNode;
};

const ScrollContext = createContext(null);

/**
 * Manages the context and synchronises scroll between subscribed components
 *
 * @param children - The component to synchronise scroll within
 */
export function ScrollSyncContext({ children }: ScrollSyncProps) {
    const [scrollPercentage, setScrollPercentage] = useState(0);

    function handleScroll(percentage) {
        setScrollPercentage(percentage);
    }

    return <ScrollContext.Provider value={[scrollPercentage, handleScroll]}>{children}</ScrollContext.Provider>;
}

/**
 * Subscribes components to the context and handles scroll functionality
 *
 * @param children - The components to subscribe to the context
 */
export function ScrollSync({ children }: ScrollSyncProps) {
    const [scrollPercentage, handleScroll] = useContext(ScrollContext);
    const ref = useRef(null);

    useEffect(() => {
        function handleScrollEvent(e) {
            const { scrollLeft } = e.target;
            handleScroll(scrollLeft);
        }

        ref.current.addEventListener("scroll", handleScrollEvent);
    }, []);

    useEffect(() => {
        if (scrollPercentage !== undefined) {
            ref.current.scrollLeft = scrollPercentage;
        }
    }, [scrollPercentage]);

    return (
        <div ref={ref} style={{ overflowX: "auto" }}>
            {children}
        </div>
    );
}
