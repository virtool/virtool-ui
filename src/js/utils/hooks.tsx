import { LocationType } from "@/types/types";
import { forEach } from "lodash-es/lodash";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { useLocation, useSearch } from "wouter";

export type HistoryType = RouteComponentProps["history"];

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
 * create a modified search param string with an updated key:value based on the existing search string
 *
 * @param value - The value to be used in the search parameter
 * @param key - The search parameter key to be managed
 * @param search - The current search string
 */
export function formatSearchParams(key: string, value: string, search: string) {
    const params = new URLSearchParams(search);

    if (value) {
        params.set(key, String(value));
    } else {
        params.delete(key);
    }

    return `?${params.toString()}`;
}

type SearchParamValue = string | boolean | number;

/**
 * Updates the URL search parameters by either setting a new value for a given key or removing the key-value pair
 *
 * @param value - The value to be used in the search parameter
 * @param key - The search parameter key to be managed
 * @param history - The history object
 */
function updateUrlSearchParams<T extends SearchParamValue>(value: T, key: string, navigate, search) {
    const params = new URLSearchParams(search);

    if (value) {
        params.set(key, String(value));
    } else {
        params.delete(key);
    }

    search = params.toString();

    navigate(`?${search}`, { replace: true });

    return search;
}

/**
 * Hook for managing and synchronizing URL search parameters with a component's state
 *
 * @param key - The search parameter key to be managed
 * @param defaultValue - The default value to use when the search parameter key is not present in the URL
 * @returns Object - An object containing the current value and a function to set the URL search parameter
 */
export function useUrlSearchParams2<T extends SearchParamValue>(
    key: string,
    defaultValue?: T
): [T, (newValue: T) => void] {
    const search = useSearch();
    const [_, navigate] = useLocation();
    const firstRender = useRef(true);

    let value = new URLSearchParams(search).get(key) as T;

    if (firstRender.current && defaultValue && !value) {
        value = defaultValue;
        updateUrlSearchParams(String(defaultValue), key, navigate, search);
    }

    firstRender.current = false;

    return [value, (value: T) => flushSync(() => updateUrlSearchParams(value, key, navigate, search))];
}

function createUseUrlSearchParams2() {
    let cache = { search: "" };

    return function useURLSearchParams(key: string, defaultValue?: T) {
        cache.search = useSearch();

        const [_, navigate] = useLocation();
        const firstRender = useRef(true);

        let value = new URLSearchParams(cache.search).get(key) as T;

        if (firstRender.current && defaultValue && !value) {
            value = defaultValue;
            cache.search = updateUrlSearchParams(String(defaultValue), key, navigate, cache.search);
        }

        firstRender.current = false;

        function setURLSearchParam(value) {
            console.log(cache);
            cache.search = updateUrlSearchParams(value, key, navigate, cache.search);
        }

        return [value, (value: T) => setURLSearchParam(value)];
    };
}

export const useUrlSearchParams = createUseUrlSearchParams2();

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
    const [_, navigate] = useLocation();
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

/**
 * Hook for managing the location state
 */
export function useLocationState(): [
    locationState: LocationType,
    setLocationState: (state: { [key: string]: boolean | string | number }) => void
] {
    const location = useLocation();
    const history = useHistory();

    function setLocationState(state: { [key: string]: boolean | string }) {
        history.push({ ...history.location, state });
    }

    return [location.state, setLocationState];
}
