import { forEach } from "lodash-es/lodash";
import { useEffect, useRef, useState } from "react";
import { RouteComponentProps, useHistory, useLocation } from "react-router-dom";

export type HistoryType = RouteComponentProps["history"];

export const useStateWithReset = initialValue => {
    const [state, setState] = useState(initialValue);

    useEffect(() => {
        setState(initialValue);
    }, [initialValue]);

    return [state, setState];
};

const getSize = ref => ({
    height: ref.current ? ref.current.offsetHeight : 0,
    width: ref.current ? ref.current.offsetWidth : 0,
});

export const useElementSize = () => {
    const ref = useRef(null);

    const [size, setSize] = useState(getSize(ref));

    const handleResize = () => {
        setSize(getSize(ref));
    };

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [null]);

    return [ref, size];
};

export const useDidUpdateEffect = (onUpdate, deps) => {
    const firstRef = useRef(false);
    useEffect(() => {
        if (firstRef.current) {
            onUpdate();
        }
        firstRef.current = true;
    }, deps);
};

/**
 * Updates the URL search parameters by either setting a new value for a given key or removing the key-value pair
 *
 * @param value - The value to be used in the search parameter
 * @param key - The search parameter key to be managed
 * @param history - The history object
 */
function updateUrlSearchParams(value: string, key: string, history: HistoryType) {
    const params = new URLSearchParams(window.location.search);

    if (value) {
        params.set(key, value);
    } else {
        params.delete(key);
    }

    history?.replace({
        pathname: window.location.pathname,
        search: params.toString() ? `?${params.toString()}` : null,
    });
}

/**
 * Hook for managing and synchronizing URL search parameters with a component's state
 *
 * @param key - The search parameter key to be managed
 * @param defaultValue - The default value to use when the search parameter key is not present in the URL
 * @returns Object - An object containing the current value and a function to set the URL search parameter
 */
export function useUrlSearchParams(key: string, defaultValue?: string): [string, (newValue: string) => void] {
    const history = useHistory();
    const location = useLocation();
    const firstRender = useRef(true);

    let value = new URLSearchParams(location.search).get(key);

    if (firstRender.current && defaultValue && !value) {
        value = defaultValue;
        updateUrlSearchParams(defaultValue, key, history);
    }

    firstRender.current = false;

    return [value, (value: string) => updateUrlSearchParams(value, key, history)];
}

/**
 * Updates the URL search parameters by either adding a new value for a given key or removing the key-value pair
 *
 * @param values - The values to be used in the search parameter
 * @param key - The search parameter key to be managed
 * @param history - The history object
 */
function updateUrlSearchParamsList(values: string[], key: string, history: HistoryType) {
    const params = new URLSearchParams(window.location.search);

    params.delete(key);
    forEach(values, value => params.append(key, value));

    history?.replace({
        pathname: window.location.pathname,
        search: params.toString() ? `?${params.toString()}` : null,
    });
}

/**
 * Hook for managing and synchronizing a list of URL search parameters with a component's state
 *
 * @param key - The search parameter key to be managed
 * @param defaultValue - The default values to use when the search parameter key is not present in the URL
 * @returns Object - An object containing the current values and a function to set the URL search parameter
 */
export function useUrlSearchParamsList(key: string, defaultValue?: string[]): [string[], (newValue: string[]) => void] {
    const history = useHistory();
    const location = useLocation();
    const firstRender = useRef(true);

    let value = new URLSearchParams(location.search).getAll(key);

    if (firstRender.current && defaultValue && !value.length) {
        value = defaultValue;
        updateUrlSearchParamsList(value, key, history);
    }

    firstRender.current = false;

    return [value, (value: string[]) => updateUrlSearchParamsList(value, key, history)];
}
