import { act, renderHook } from "@testing-library/react-hooks";
import { describe, expect, it } from "vitest";
import { useExpanded } from "../hooks";

describe("useExpanded()", () => {
    it("should be collapsed (false) initially and expand and collapse", () => {
        const { result } = renderHook(() => useExpanded());

        expect(result.current.expanded).toBe(false);

        act(() => {
            result.current.expand();
        });

        expect(result.current.expanded).toBe(true);

        act(() => {
            result.current.collapse();
        });

        expect(result.current.expanded).toBe(false);
    });
});
