import { forEach } from "lodash-es/lodash";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useParams, useSearch } from "wouter";

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
export const useSearchParams = useParams;

export function formatPath(basePath: string, searchParams: object) {
    return basePath + formatSearchParams(searchParams);
}

/**
 * create a new search string based on a collection of key:value pairs
 *
 * @param params -
 */
export function formatSearchParams(params: object) {
    const searchParams = new URLSearchParams();
    forEach(params, (value, key) => {
        searchParams.append(key, value);
    });
    return `?${searchParams.toString()}`;
}

/**
 * create a modified search param string with an updated key:value based on the existing search string
 *
 * @param value - The value to be used in the search parameter
 * @param key - The search parameter key to be managed
 * @param search - The current search string
 */
export function formatSearchParam(key: string, value: string, search: string) {
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
 * @param history - The history object
 */
function updateUrlSearchParams(value: string, key: string, navigate, search, location) {
    const params = new URLSearchParams(search);

    if (value) {
        params.set(key, String(value));
    } else {
        params.delete(key);
    }

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

function createUseUrlSearchParam() {
    const cache = { search: "" };

    return function useUrlSearchParams(key: string, defaultValue?: string): [string, (newValue: string) => void] {
        cache.search = useSearch();
        const [location] = useLocation();

        const [, navigate] = useLocation();
        const firstRender = useRef(true);

        let value = new URLSearchParams(cache.search).get(key);

        if (firstRender.current && defaultValue && !value) {
            firstRender.current = false;
            value = defaultValue;
            cache.search = updateUrlSearchParams(String(defaultValue), key, navigate, cache.search, location);
        }

        firstRender.current = false;

        function setURLSearchParam(value) {
            cache.search = updateUrlSearchParams(value, key, navigate, cache.search, location);
        }

        return [value, (value: string) => setURLSearchParam(value)];
    };
}

export const useUrlSearchParam = createUseUrlSearchParam();

/**
 * Updates the URL search parameters by either adding a new value for a given key or removing the key-value pair
 *
 * @param values - The values to be used in the search parameter
 * @param key - The search parameter key to be managed
 * @param history - The history object
 */
function updateUrlSearchParamsList(key: string, navigate, search: string, values: string[]) {
    const params = new URLSearchParams(search);

    params.delete(key);
    forEach(values, value => params.append(key, value));

    navigate(`?${params.toString()}`);
}

/**
 * Hook for managing and synchronizing a list of URL search parameters with a component's state
 *
 * @param key - The search parameter key to be managed
 * @param defaultValue - The default values to use when the search parameter key is not present in the URL
 * @returns Object - An object containing the current values and a function to set the URL search parameter
 */
export function useUrlSearchParamsList(key: string, defaultValue?: string[]): [string[], (newValue: string[]) => void] {
    const search = useSearch();
    const [, navigate] = useLocation();
    const firstRender = useRef(true);

    let values = new URLSearchParams(search).getAll(key);

    if (firstRender.current && defaultValue && !values.length) {
        values = defaultValue;
        updateUrlSearchParamsList(key, navigate, search, values);
    }

    firstRender.current = false;

    return [values, (values: string[]) => updateUrlSearchParamsList(key, navigate, search, values)];
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
