import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDebounce } from "../hooks";

describe("useDebounce()", () => {
	it("should commit the draft once it has been stable for the delay", async () => {
		const onChange = vi.fn();

		const { result } = renderHook(() => useDebounce("", onChange, 10));

		act(() => result.current[1]("Foo"));
		expect(result.current[0]).toBe("Foo");
		expect(onChange).not.toHaveBeenCalled();

		await act(() => new Promise((resolve) => setTimeout(resolve, 20)));

		expect(onChange).toHaveBeenCalledExactlyOnceWith("Foo");
	});

	it("should not blank the draft while an async commit's echo is pending", async () => {
		// A router-backed onChange updates ``value`` a render later, so the render
		// triggered by the commit still sees the stale, pre-commit value. The draft
		// must survive that render rather than briefly flashing the placeholder.
		const onChange = vi.fn();

		const { result, rerender } = renderHook(
			({ value }) => useDebounce(value, onChange, 10),
			{ initialProps: { value: "" } },
		);

		act(() => result.current[1]("Foo"));

		await act(() => new Promise((resolve) => setTimeout(resolve, 20)));
		expect(onChange).toHaveBeenCalledWith("Foo");

		// The echo has not landed: ``value`` is still the pre-commit "".
		rerender({ value: "" });
		expect(result.current[0]).toBe("Foo");

		// Once it lands, the draft simply stays put.
		rerender({ value: "Foo" });
		expect(result.current[0]).toBe("Foo");
	});

	it("should abandon a pending commit when the value changes externally", async () => {
		const onChange = vi.fn();

		const { result, rerender } = renderHook(
			({ value }) => useDebounce(value, onChange, 10),
			{ initialProps: { value: "ferret" } },
		);

		act(() => result.current[1]("ferrets"));

		// Something outside clears the term before the delay elapses.
		rerender({ value: "" });
		expect(result.current[0]).toBe("");

		await act(() => new Promise((resolve) => setTimeout(resolve, 20)));

		expect(onChange).not.toHaveBeenCalled();
	});
});
