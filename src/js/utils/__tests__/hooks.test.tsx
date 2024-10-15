import React from "react";
import { describe, expect, it } from "vitest";
import { Router } from "wouter";
import { useUrlSearchParam } from "../hooks";
import { renderHook } from "@testing-library/react";

describe("useUrlSearchParams", () => {
    it("should render empty with no default value given", () => {
        const key = "find";
        const { result } = renderHook(() => useUrlSearchParam(key), {
            wrapper: ({ children }) => <Router>{children}</Router>,
        });

        const length = result.current.length;
        expect(length).toBe(2);
        expect(result.current[0]).toBe(null);
    });

    it("should render with default value", () => {
        const { result } = renderHook(() => useUrlSearchParam("find", "test"), {
            wrapper: ({ children }) => <Router>{children}</Router>,
        });

        const length = result.current.length;
        expect(length).toBe(2);
        expect(result.current[0]).toBe("test");
    });
});
