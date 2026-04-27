import { act, waitFor } from "@testing-library/react";
import { renderHookWithRouter } from "@tests/setup";
import { describe, expect, it } from "vitest";
import { useUrlSearchParam } from "../hooks";

describe("useUrlSearchParams", () => {
	it("should render empty with no default value given", async () => {
		const key = "find";
		const { result } = await renderHookWithRouter(() => useUrlSearchParam(key));

		expect(Object.keys(result.current).length).toBe(3);
		expect(result.current.value).toBe(undefined);
	});

	it("should render with default value", async () => {
		const { result } = await renderHookWithRouter(() =>
			useUrlSearchParam("find", "test"),
		);
		expect(result.current.value).toBe("test");
	});

	it("should render correctly set search params when setValue called", async () => {
		const { result } = await renderHookWithRouter(() =>
			useUrlSearchParam("find"),
		);

		expect(result.current.value).toBe(undefined);
		act(() => {
			result.current.setValue("test");
		});
		await waitFor(() => {
			expect(result.current.value).toBe("test");
		});
	});
});
