import { faker } from "@faker-js/faker";
import { User, UserNested } from "@users/types";
import nock from "nock";
import { createFakeGroupMinimal } from "./groups";
import { createFakePermissions } from "./permissions";

/**
 * Returns a UserNested object populated with fake data
 *
 * @returns a UserNested object with fake data
 */
export function createFakeUserNested(): UserNested {
    return {
        id: faker.number.int(),
        handle: faker.internet.username(),
    };
}

/**
 * Returns a User object populated with fake data
 *
 * @param overrides values to override the default automatically generated values
 * @returns a User object with fake data
 */
export function createFakeUser(overrides?: Partial<User>): User {
    const {
        groups: overrideGroups,
        permissions,
        primary_group,
        ...rest
    } = overrides || {};
    const groups = overrideGroups ?? [createFakeGroupMinimal()];

    return {
        ...createFakeUserNested(),
        active: true,
        administrator_role: null,
        force_reset: false,
        groups,
        last_password_change: faker.date.past().toISOString(),
        permissions: createFakePermissions(permissions),
        primary_group: primary_group === undefined ? groups[0] : primary_group,
        ...rest,
    };
}

/**
 * Returns an array of User objects populated with fake data
 *
 * @param count - the number of users to create
 * @returns An array of User objects populated with fake data
 */
export function createFakeUsers(count: number): Array<User> {
    return Array.from({ length: count || 1 }, createFakeUser);
}

type FindUsersQuery = {
    administrator: boolean;
    page: number;
    per_page: number;
    term: string;
};

/**
 * Mocks an API call for getting page of userSearchResults
 *
 * @param users - an array of users to return
 * @param query - the query parameters to match
 * @returns - a nock Scope for the mocked API call
 */
export function mockApiFindUsers(users: Array<User>, query?: FindUsersQuery) {
    return nock("http://localhost")
        .get("/api/admin/users")
        .query(query || true)
        .reply(200, {
            found_count: users.length,
            items: users,
            page: 1,
            page_count: 1,
            per_page: 25,
            total_count: users.length,
        });
}

/**
 * Mocks an API call for getting the user details
 *
 * @param userId - The users unique id
 * @param user - The details of the user
 * @returns A nock scope for the mocked API call
 */
export function mockApiGetUser(userId: number, user: User) {
    return nock("http://localhost")
        .get(`/api/admin/users/${userId}`)
        .reply(200, user);
}

/**
 * Mocks an API call for updating the user details
 *
 * @param userId - The users unique id
 * @param statusCode - The HTTP status code to simulate in the response
 * @param update - The update to apply to the user
 * @param user - The user details
 * @returns A nock scope for the mocked API call
 */
export function mockApiEditUser(
    userId: number,
    statusCode: number,
    update: object,
    user?: User,
) {
    return nock("http://localhost")
        .patch(`/api/admin/users/${userId}`)
        .reply(statusCode, { ...user, ...update });
}
