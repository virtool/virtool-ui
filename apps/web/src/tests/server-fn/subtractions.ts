import type {
	Subtraction,
	SubtractionMinimal,
	SubtractionOption,
} from "@subtraction/types";
import { type Mock, vi } from "vitest";

/**
 * Mock handles for the `@server/subtraction/functions` server-fn module. Wired
 * in globally from `tests/setup.tsx` so any test rendering a view that lists or
 * reads subtractions can stub them without per-file `vi.mock` boilerplate.
 */
export const subtractionServerFnMocks = {
	createSubtraction: vi.fn(),
	deleteSubtraction: vi.fn(),
	findSubtractions: vi.fn(),
	getSubtraction: vi.fn(),
	listSubtractionsShortlist: vi.fn(),
	updateSubtraction: vi.fn(),
};

/** Sets up findSubtractions to resolve with a single page of the given items. */
export function mockFindSubtractions(items: SubtractionMinimal[]): Mock {
	subtractionServerFnMocks.findSubtractions.mockResolvedValue({
		found_count: items.length,
		total_count: items.length,
		ready_count: items.filter((item) => item.ready).length,
		page: 1,
		page_count: 1,
		per_page: 25,
		items,
	});
	return subtractionServerFnMocks.findSubtractions;
}

/** Sets up getSubtraction to resolve with the given subtraction when matched. */
export function mockGetSubtraction(subtraction: Subtraction): Mock {
	subtractionServerFnMocks.getSubtraction.mockImplementation(
		async ({ data }: { data: { subtractionId: number } }) => {
			if (data.subtractionId === subtraction.id) {
				return subtraction;
			}
			throw new Error(
				`unexpected subtractionId in mockGetSubtraction: ${data.subtractionId}`,
			);
		},
	);
	return subtractionServerFnMocks.getSubtraction;
}

/** Sets up createSubtraction to resolve with the given subtraction. */
export function mockCreateSubtraction(subtraction: Subtraction): Mock {
	subtractionServerFnMocks.createSubtraction.mockResolvedValue(subtraction);
	return subtractionServerFnMocks.createSubtraction;
}

/**
 * Sets up updateSubtraction to resolve with the given subtraction, patched with
 * whatever name and nickname the caller submitted.
 */
export function mockUpdateSubtraction(subtraction: Subtraction): Mock {
	subtractionServerFnMocks.updateSubtraction.mockImplementation(
		async ({
			data,
		}: {
			data: { subtractionId: number; name?: string; nickname?: string };
		}) => ({
			...subtraction,
			name: data.name ?? subtraction.name,
			nickname: data.nickname ?? subtraction.nickname,
		}),
	);
	return subtractionServerFnMocks.updateSubtraction;
}

/** Sets up deleteSubtraction to resolve. */
export function mockDeleteSubtraction(): Mock {
	subtractionServerFnMocks.deleteSubtraction.mockResolvedValue(null);
	return subtractionServerFnMocks.deleteSubtraction;
}

/** Sets up listSubtractionsShortlist to resolve with the given options. */
export function mockListSubtractionsShortlist(
	subtractions: SubtractionOption[],
): Mock {
	subtractionServerFnMocks.listSubtractionsShortlist.mockResolvedValue(
		subtractions,
	);
	return subtractionServerFnMocks.listSubtractionsShortlist;
}
