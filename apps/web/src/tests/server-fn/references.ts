import type { Reference, ReferenceMinimal } from "@references/types";
import { type Mock, vi } from "vitest";

/**
 * Mock handles for the `@server/references/functions` server-fn module. Wired in
 * globally from `tests/setup.tsx` so any test rendering a view that lists, reads,
 * or mutates references can stub them without per-file `vi.mock` boilerplate.
 */
export const referenceServerFnMocks = {
	findReferences: vi.fn(),
	getReference: vi.fn(),
	createReference: vi.fn(),
	updateReference: vi.fn(),
	archiveReference: vi.fn(),
	unarchiveReference: vi.fn(),
	addReferenceUser: vi.fn(),
	addReferenceGroup: vi.fn(),
	updateReferenceUser: vi.fn(),
	updateReferenceGroup: vi.fn(),
	removeReferenceUser: vi.fn(),
	removeReferenceGroup: vi.fn(),
};

/** Sets up findReferences to resolve with a single page of the given items. */
export function mockFindReferences(
	items: ReferenceMinimal[],
	overrides?: Partial<{ foundCount: number; totalCount: number }>,
): Mock {
	referenceServerFnMocks.findReferences.mockResolvedValue({
		foundCount: items.length,
		totalCount: items.length,
		page: 1,
		pageCount: 1,
		perPage: 25,
		items,
		...overrides,
	});
	return referenceServerFnMocks.findReferences;
}

/** Sets up getReference to resolve with the given reference when matched. */
export function mockGetReference(reference: Reference): Mock {
	referenceServerFnMocks.getReference.mockImplementation(
		async ({ data }: { data: { referenceId: number } }) => {
			if (data.referenceId === reference.id) {
				return reference;
			}
			throw new Error(
				`unexpected referenceId in mockGetReference: ${data.referenceId}`,
			);
		},
	);
	return referenceServerFnMocks.getReference;
}

/** Sets up createReference to resolve with the given reference. */
export function mockCreateReference(reference: Reference): Mock {
	referenceServerFnMocks.createReference.mockResolvedValue(reference);
	return referenceServerFnMocks.createReference;
}

/** Sets up archiveReference to resolve with the given reference. */
export function mockArchiveReference(reference: Reference): Mock {
	referenceServerFnMocks.archiveReference.mockResolvedValue(reference);
	return referenceServerFnMocks.archiveReference;
}

/** Sets up unarchiveReference to resolve with the given reference. */
export function mockUnarchiveReference(reference: Reference): Mock {
	referenceServerFnMocks.unarchiveReference.mockResolvedValue(reference);
	return referenceServerFnMocks.unarchiveReference;
}
