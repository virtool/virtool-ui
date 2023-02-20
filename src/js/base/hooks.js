import { useEffect, useRef, useState } from "react";
import { createFuse } from "../utils/utils";

export const useClickOutside = (popperElement, referenceElement, callback) => {
    useEffect(() => {
        function handleClickOutside(e) {
            if (
                popperElement &&
                referenceElement &&
                !popperElement.contains(e.target) &&
                !referenceElement.contains(e.target)
            ) {
                e.stopImmediatePropagation();
                callback();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    });
};

export const useFuse = (collection, keys, deps) => {
    const [fuse, setFuse] = useState(createFuse(collection, keys));
    const [term, setTerm] = useState("");

    useEffect(() => setTerm(""), [...deps]);
    useEffect(() => {
        setFuse(createFuse(collection, keys));
    }, [...deps, collection]);

    return [term ? fuse.search(term) : collection, term, setTerm];
};

export function useKeyPress(key, callback) {
    useEffect(() => {
        function handleKeyUp(e) {
            if (e.key === key) {
                callback();
            }
        }

        window.addEventListener("keyup", handleKeyUp);

        return () => window.removeEventListener("keyup", handleKeyUp);
    });
}

export function usePrevious(value) {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    });

    return ref.current || 1;
}
