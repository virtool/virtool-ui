import type { Group } from "@groups/types";
import { type Mock, vi } from "vitest";

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

/** Sets up the listGroups server fn to resolve with the provided groups. */
export function mockListGroups(groups: Group[]): Mock {
	groupServerFnMocks.listGroups.mockResolvedValue(groups);
	return groupServerFnMocks.listGroups;
}

/** Sets up the getGroup server fn to resolve with the provided group. */
export function mockGetGroup(group: Group): Mock {
	groupServerFnMocks.getGroup.mockImplementation(
		async ({ data }: { data: { groupId: number } }) => {
			if (data.groupId === group.id) {
				return group;
			}
			throw new Error(`unexpected groupId in mockGetGroup: ${data.groupId}`);
		},
	);
	return groupServerFnMocks.getGroup;
}
