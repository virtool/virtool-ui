import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { describe, expect, it } from "vitest";
import { Router } from "wouter";
import { useUrlSearchParams } from "../hooks";

describe("useUrlSearchParams", () => {
    it("should render empty with no default value given", () => {
        const key = "find";
        const { result } = renderHook(() => useUrlSearchParams(key), {
            wrapper: ({ children }) => <Router>{children}</Router>,
        });
        console.log(result.all);
        const length = result.current.length;
        expect(length).toBe(2);
        expect(result.current[0]).toBe(null);
    });

    it("should render with default value", () => {
        const { result } = renderHook(() => useUrlSearchParams("find", "test"), {
            wrapper: ({ children }) => <Router>{children}</Router>,
        });
        console.log(result.all);
        const length = result.current.length;
        expect(length).toBe(2);
        expect(result.current[0]).toBe("test");
    });
});
