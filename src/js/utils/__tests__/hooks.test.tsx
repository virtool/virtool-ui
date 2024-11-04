import React from "react";
import { describe, expect, it } from "vitest";
import { useUrlSearchParam } from "../hooks";
import { act, renderHook } from "@testing-library/react";
import { MemoryRouter } from "@tests/setup";

describe("useUrlSearchParams", () => {
    it("should render empty with no default value given", () => {
        const key = "find";
        const { result } = renderHook(() => useUrlSearchParam(key), {
            wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
        });

        expect(Object.keys(result.current).length).toBe(3);
        expect(result.current.value).toBe(undefined);
    });

    it("should render with default value", () => {
        const { result } = renderHook(() => useUrlSearchParam("find", "test"), {
            wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
        });
        expect(result.current.value).toBe("test");
    });

    it("should render correctly set search params when setValue called", () => {
        const { result } = renderHook(() => useUrlSearchParam("find"), {
            wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
        });

        expect(result.current.value).toBe(undefined);
        act(() => {
            result.current.setValue("test");
        });
        expect(result.current.value).toBe("test");
    });
});
