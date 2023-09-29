import { useEffect, useRef, useState } from "react";

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

export function getUrlSearchParams(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key) || "";
}

export function updateUrlSearchParams(newTerm, key) {
    const search = new URLSearchParams(window.location.search);
    search.set(key, newTerm);
    const newUrl = `${window.location.pathname}?${search.toString()}`;
    window.history.replaceState({}, "", newUrl);
}

/**
 * Hook for managing and synchronizing URL search parameters with a component's state
 *
 * @param key - The search parameter key to be managed
 * @param defaultValue - The default value to use when the search parameter is not present in the URL
 * @returns Object - An object containing the current value and a function to set the URL search parameter
 */
export function useUrlSearchParams({ key, defaultValue }) {
    const searchTerm = getUrlSearchParams(key);

    useEffect(() => {
        if (!searchTerm && defaultValue) {
            updateUrlSearchParams(defaultValue, key);
        }
    }, [key, defaultValue, searchTerm]);

    const setUrlValue = newValue => {
        updateUrlSearchParams(newValue, key);
    };

    return {
        value: searchTerm || defaultValue,
        setValue: setUrlValue,
    };
}
