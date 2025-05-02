import { useFuse } from "../fuse";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

describe("useFuse()", () => {
    let collection: { name: string }[];
    let keys: string[] = [];

    beforeEach(() => {
        collection = [
            { name: "nan" },
            { name: "test1" },
            { name: "aaaaa" },
            { name: "zzzzz" },
        ];
        keys = ["name"];
    });

    it("should change returnObj to match useFuse result when term is changed to non empty single character", () => {
        const { result } = renderHook(() => useFuse(collection, keys));
        const setTerm = result.current[2];

        act(() => {
            setTerm("z");
        });
        expect(result.current[0]).toEqual([{ name: "zzzzz" }]);
        expect(result.current[1]).toBe("z");
    });

    it("should return empty array when searchFuse yields no matches", () => {
        const { result } = renderHook(() => useFuse(collection, keys));
        const setTerm = result.current[2];

        act(() => {
            setTerm("wwwwwwwww");
        });
        expect(result.current[1]).toBe("wwwwwwwww");
        expect(result.current[0]).toEqual([]);
    });

    it("should return everything when term changes to empty string", () => {
        const { result } = renderHook(() => useFuse(collection, keys));
        const setTerm = result.current[2];

        act(() => {
            setTerm("z");
        });

        expect(result.current[1]).toBe("z");
        expect(result.current[0]).toEqual([{ name: "zzzzz" }]);

        act(() => {
            setTerm("");
        });

        expect(result.current[1]).toBe("");
        expect(result.current[0]).toBe(collection);
    });

    it("should reset term to empty string when collection changes", async () => {
        const { rerender, result } = renderHook(({ c, k }) => useFuse(c, k), {
            initialProps: {
                c: [
                    { name: "nan" },
                    { name: "test1" },
                    { name: "aaaaa" },
                    { name: "zzzzz" },
                ],
                k: ["name"],
            },
        });

        expect(result.current[1]).toBe("");

        const setTerm = result.current[2];

        act(() => {
            setTerm("z");
        });

        expect(result.current[1]).toBe("z");

        rerender({
            c: [...collection, { name: "a_new_item" }],
            k: ["name"],
        });

        expect(result.current[1]).toBe("");
    });
});
