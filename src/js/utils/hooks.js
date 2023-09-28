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
    if (window.location.search) {
        const search = new URLSearchParams(window.location.search);
        search.set(key, newTerm);
        const newUrl = `${window.location.pathname}?${search.toString()}`;
        window.history.replaceState({}, "", newUrl);
    }
}

export function useUrlSearchParams({ key, defaultValue = "" }) {
    const [value, setValue] = useState(defaultValue);
    useEffect(() => {
        const searchTerm = getUrlSearchParams(key);
        if (searchTerm) {
            setValue(searchTerm);
        } else {
            updateUrlSearchParams(defaultValue, key);
        }
    }, [key, defaultValue]);
    const setUrlValue = newValues => {
        setValue(newValues);
        updateUrlSearchParams(newValues, key);
    };

    return {
        value,
        setValue: setUrlValue,
    };
}
