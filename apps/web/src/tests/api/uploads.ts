import type { Upload } from "@uploads/types";
import { expect, vi } from "vitest";

/**
 * Mock handles for the `@server/uploads/functions` server-fn module. Wired in
 * globally from `tests/setup.tsx` so any test importing this helper can stub
 * the uploads server functions without per-file `vi.mock` boilerplate.
 */
export const uploadServerFnMocks = {
	getUploads: vi.fn(),
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

/**
 * Sets up getUploads to resolve with those of the given uploads whose ids were
 * asked for.
 *
 * Ids with no matching upload are simply absent from the result, which is how
 * the real server function reports a file that has been removed or reserved
 * since it was selected.
 *
 * @param uploads - the uploads available to be resolved
 */
export function mockApiGetUploads(uploads: Upload[]): MockScope {
	uploadServerFnMocks.getUploads.mockImplementation(
		async ({ data }: { data: { ids: number[] } }) =>
			uploads.filter((upload) => data.ids.includes(upload.id)),
	);

	return makeScope(uploadServerFnMocks.getUploads);
}
