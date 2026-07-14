import type { AdministratorRole } from "@administration/types";
import type { User, UserNested } from "@users/types";
import { expect, vi } from "vitest";

/**
 * Mock handles for the `@server/users/functions` server-fn module. Wired in
 * globally from `tests/setup.tsx` so any test importing this helper can stub
 * the users server functions without per-file `vi.mock` boilerplate.
 */
export const userServerFnMocks = {
	findUsers: vi.fn(),
	listUsers: vi.fn(),
	getAccount: vi.fn(),
	getUser: vi.fn(),
	createUser: vi.fn(),
	updateUser: vi.fn(),
	updateAccountHandle: vi.fn(),
	setAdministratorRole: vi.fn(),
	listAdministratorRoles: vi.fn(),
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

/** Sets up findUsers to resolve with a single page containing the given users. */
export function mockApiFindUsers(users: User[]): MockScope {
	userServerFnMocks.findUsers.mockResolvedValue({
		items: users,
		found_count: users.length,
		page: 1,
		page_count: 1,
		per_page: 25,
		total_count: users.length,
	});
	return makeScope(userServerFnMocks.findUsers);
}

/** Sets up listUsers to resolve with the given users, reduced to id and handle. */
export function mockApiListUsers(users: UserNested[]): MockScope {
	userServerFnMocks.listUsers.mockResolvedValue(
		users.map(({ handle, id }) => ({ handle, id })),
	);
	return makeScope(userServerFnMocks.listUsers);
}

/** Sets up getUser to resolve with the given user when matched by id. */
export function mockApiGetUser(userId: number, user: User): MockScope {
	userServerFnMocks.getUser.mockImplementation(
		async ({ data }: { data: { userId: number } }) => {
			if (data.userId === userId) {
				return user;
			}
			throw new Error(`unexpected userId in mockApiGetUser: ${data.userId}`);
		},
	);
	return makeScope(userServerFnMocks.getUser);
}

/** Sets up createUser to resolve with the given user (or reject on a 4xx code). */
export function mockApiCreateUser(
	user?: User,
	statusCode = 201,
	message = "User already exists.",
): MockScope {
	if (statusCode >= 400) {
		userServerFnMocks.createUser.mockRejectedValue(new Error(message));
	} else {
		userServerFnMocks.createUser.mockResolvedValue(user ?? {});
	}
	return makeScope(userServerFnMocks.createUser);
}

/** Sets up updateUser to resolve with the merged user (or reject on a 4xx code). */
export function mockApiEditUser(
	_userId: number | string,
	statusCode: number,
	update: Record<string, unknown>,
	user?: User,
): MockScope {
	if (statusCode >= 400) {
		const message =
			typeof update.message === "string" ? update.message : "Bad request.";
		userServerFnMocks.updateUser.mockRejectedValue(new Error(message));
	} else {
		userServerFnMocks.updateUser.mockResolvedValue({ ...user, ...update });
	}
	return makeScope(userServerFnMocks.updateUser);
}

/**
 * Sets up updateAccountHandle to resolve with the updated user (or reject on a
 * 4xx code, e.g. 409 for a duplicate handle).
 *
 * When `expectedHandle` is given, the resolved variant also asserts the payload
 * carried the expected handle so callers can verify the value actually sent.
 */
export function mockApiUpdateAccountHandle(
	user?: User,
	statusCode = 200,
	message = "User already exists.",
	expectedHandle?: string,
): MockScope {
	if (statusCode >= 400) {
		userServerFnMocks.updateAccountHandle.mockRejectedValue(new Error(message));
	} else {
		userServerFnMocks.updateAccountHandle.mockImplementation(
			async ({ data }: { data: { handle: string } }) => {
				if (expectedHandle !== undefined) {
					expect(data.handle).toBe(expectedHandle);
				}
				return user ?? {};
			},
		);
	}
	return makeScope(userServerFnMocks.updateAccountHandle);
}

/** Sets up listAdministratorRoles to resolve with the given roles. */
export function mockApiListAdministratorRoles(
	roles: AdministratorRole[],
): MockScope {
	userServerFnMocks.listAdministratorRoles.mockResolvedValue(roles);
	return makeScope(userServerFnMocks.listAdministratorRoles);
}

/** Sets up setAdministratorRole to resolve with the given user. */
export function mockApiSetAdministratorRole(user: User): MockScope {
	userServerFnMocks.setAdministratorRole.mockResolvedValue(user);
	return makeScope(userServerFnMocks.setAdministratorRole);
}
