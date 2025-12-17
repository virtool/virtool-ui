import Fuse from "fuse.js";
import { useEffect, useState } from "react";

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
    // Serialize keys to a string for stable dependency comparison. Callers
    // typically pass inline array literals (e.g., ["name"]) which create new
    // references each render.
    const serializedKeys = keys.join(",");

    const [fuse, setFuse] = useState(createFuse(collection, keys));
    const [term, setTerm] = useState("");

    useEffect(() => {
        setTerm("");
    }, [collection]);

    useEffect(() => {
        setFuse(createFuse(collection, keys));
    }, [collection, serializedKeys]);

    const items = term
        ? fuse.search(term).map((result) => result.item)
        : collection;

    return [items, term, setTerm];
}
