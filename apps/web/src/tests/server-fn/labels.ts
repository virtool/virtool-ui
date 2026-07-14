import type { Label } from "@labels/types";
import { type Mock, vi } from "vitest";

/**
 * Mock handles for the `@server/labels/functions` server-fn module. Wired in
 * globally from `tests/setup.tsx` so any test rendering a view that lists
 * labels can stub them without per-file `vi.mock` boilerplate.
 */
export const labelServerFnMocks = {
	createLabel: vi.fn(),
	deleteLabel: vi.fn(),
	findLabels: vi.fn(),
	getLabel: vi.fn(),
	updateLabel: vi.fn(),
};

/** Set the labels `findLabels` will resolve with. */
export function mockFindLabels(labels: Label[]): Mock {
	labelServerFnMocks.findLabels.mockResolvedValue(labels);
	return labelServerFnMocks.findLabels;
}
