import type { Label } from "@labels/types";
import { expect, vi } from "vitest";

/**
 * Mock handles for the `@server/labels/functions` server-fn module. Wired in
 * globally from `tests/setup.tsx` so any test importing this helper can stub
 * the labels server functions without per-file `vi.mock` boilerplate.
 */
export const labelServerFnMocks = {
	createLabel: vi.fn(),
	deleteLabel: vi.fn(),
	findLabels: vi.fn(),
	getLabel: vi.fn(),
	updateLabel: vi.fn(),
};

/** Asserts that the corresponding mock was called at least once. */
export type MockScope = { done(): void };

function makeScope(fn: ReturnType<typeof vi.fn>): MockScope {
	return {
		done() {
			expect(fn).toHaveBeenCalled();
		},
	};
}

/** Sets up findLabels to resolve with the given labels. */
export function mockApiGetLabels(labels: Label[]): MockScope {
	labelServerFnMocks.findLabels.mockResolvedValue(labels);
	return makeScope(labelServerFnMocks.findLabels);
}
