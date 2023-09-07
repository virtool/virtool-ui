import { act, renderHook } from "@testing-library/react-hooks";
import { beforeEach, describe, expect, it } from "vitest";
import { useFuse } from "../hooks";

describe("useFuseHook", () => {
    let collection;
    let keys;
    let deps;

    beforeEach(() => {
        collection = [{ name: "nan" }, { name: "test1" }, { name: "aaaaa" }, { name: "zzzzz" }];
        keys = ["name"];
        deps = ["zzz"];
    });

    it("should render hook correctly and return collection when term = empty string", () => {
        const { result } = renderHook(() => useFuse(collection, keys, deps));
        const length = result.current.length;
        expect(length).toBe(3);
        expect(result.current[0]).toBe(collection);
        expect(result.current[1]).toBe("");
    });

    it("should change returnObj to match useFuse result when term is changed to non empty single character", () => {
        const { result } = renderHook(() => useFuse(collection, keys, deps));
        const setTerm = result.current[2];

        act(() => {
            setTerm("z");
        });
        expect(result.current[0]).toEqual([{ item: { name: "zzzzz" }, refIndex: 3 }]);
        expect(result.current[1]).toBe("z");
    });

    it("should return empty array when searchFuse yields no matches", () => {
        const { result } = renderHook(() => useFuse(collection, keys, deps));
        const setTerm = result.current[2];

        act(() => {
            setTerm("wwwwwwwww");
        });
        expect(result.current[1]).toBe("wwwwwwwww");
        expect(result.current[0]).toEqual([]);
    });

    it("should return collection when term changed from non empty string to empty string", () => {
        const { result } = renderHook(() => useFuse(collection, keys, deps));
        const setTerm = result.current[2];

        act(() => {
            setTerm("z");
        });
        expect(result.current[1]).toBe("z");
        expect(result.current[0]).toEqual([{ item: { name: "zzzzz" }, refIndex: 3 }]);
        act(() => {
            setTerm("");
        });
        expect(result.current[1]).toBe("");
        expect(result.current[0]).toBe(collection);
    });

    it("should reset term to empty string when deps change", () => {
        const { rerender, result } = renderHook(() => useFuse(collection, keys, deps));
        const setTerm = result.current[2];

        act(() => {
            setTerm("z");
        });

        expect(result.current[1]).toBe("z");
        deps = ["aaa"];
        rerender();
        expect(result.current[1]).toBe("");
    });
});
