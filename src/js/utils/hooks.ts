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

/**
 * Updates the URL search parameters by either setting a new value for a given key or removing the key-value pair
 *
 * @param value - The value to be used in the search parameter
 * @param key - The search parameter key to be managed
 */
function updateUrlSearchParams(value: string, key: string) {
    const params = new URLSearchParams(window.location.search);

    value ? params.set(key, value) : params.delete(key);

    window.history.replaceState(
        {},
        "",
        params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname,
    );
}

/**
 * Hook for managing and synchronizing URL search parameters with a component's state
 *
 * @param key - The search parameter key to be managed
 * @param defaultValue - The default value to use when the search parameter key is not present in the URL
 * @returns Object - An object containing the current value and a function to set the URL search parameter
 */
export function useUrlSearchParams(key: string, defaultValue?: string): [string, (newValue: string) => void] {
    const params = new URLSearchParams(window.location.search);
    const refValue = useRef(params.get(key) || defaultValue);

    updateUrlSearchParams(refValue.current, key);

    function setValue(newValue: string) {
        refValue.current = newValue;
        updateUrlSearchParams(newValue, key);
    }

    return [refValue.current, setValue];
}
