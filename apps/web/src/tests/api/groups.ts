import type { Group } from "@groups/types";
import { expect, vi } from "vitest";

/**
 * Mock handles for the `@server/groups/functions` server-fn module. Wired in
 * globally from `tests/setup.tsx` so any test importing this helper can stub
 * the groups server functions without per-file `vi.mock` boilerplate.
 */
export const groupServerFnMocks = {
	listGroups: vi.fn(),
	findGroups: vi.fn(),
	getGroup: vi.fn(),
	createGroup: vi.fn(),
	updateGroup: vi.fn(),
	deleteGroup: vi.fn(),
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

/** Sets up the listGroups server fn to resolve with the provided groups. */
export function mockApiListGroups(groups: Group[]): MockScope {
	groupServerFnMocks.listGroups.mockResolvedValue(groups);
	return makeScope(groupServerFnMocks.listGroups);
}

/** Sets up the getGroup server fn to resolve with the provided group. */
export function mockApiGetGroup(group: Group): MockScope {
	groupServerFnMocks.getGroup.mockImplementation(
		async ({ data }: { data: { groupId: number } }) => {
			if (data.groupId === group.id) {
				return group;
			}
			throw new Error(`unexpected groupId in mockApiGetGroup: ${data.groupId}`);
		},
	);
	return makeScope(groupServerFnMocks.getGroup);
}
