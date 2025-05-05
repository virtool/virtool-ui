import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";

/**
 * Create a Fuse object.
 */
export function createFuse<T>(collection: T[], keys: string[]) {
    return new Fuse(collection, {
        keys,
        minMatchCharLength: 1,
        threshold: 0.3,
        useExtendedSearch: true,
    });
}

export function useFuse<T extends object>(
    collection: T[],
    keys: string[],
): [T[], string, (value: ((prevState: string) => string) | string) => void] {
    const memoizedKeys = useMemo(() => keys, []);

    const [fuse, setFuse] = useState(createFuse(collection, memoizedKeys));
    const [term, setTerm] = useState("");

    useEffect(() => {
        setTerm("");
    }, [collection]);

    useEffect(() => {
        setFuse(createFuse(collection, memoizedKeys));
    }, [collection, memoizedKeys]);

    const items = term
        ? fuse.search(term).map((result) => result.item)
        : collection;

    return [items, term, setTerm];
}
