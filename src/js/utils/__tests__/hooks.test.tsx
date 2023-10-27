import { renderHook } from "@testing-library/react-hooks";
import { describe, expect, it } from "vitest";
import { useUrlSearchParams } from "../hooks";

describe("useUrlSearchParams", () => {
    it("should render empty with no default value given", () => {
        const key = "find";
        const { result } = renderHook(() => useUrlSearchParams(key));
        const length = result.current.length;
        expect(length).toBe(2);
        expect(result.current[0]).toBe(null);
    });

    it("should render with default value", () => {
        const { result } = renderHook(() => useUrlSearchParams("find", "test"));
        const length = result.current.length;
        expect(length).toBe(2);
        expect(result.current[0]).toBe("test");
    });
});
