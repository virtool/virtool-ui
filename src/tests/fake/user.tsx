import { faker } from "@faker-js/faker";
import { merge, times } from "lodash-es";
import nock from "nock";
import { AdministratorRoles } from "../../js/administration/types";
import { GroupMinimal, Permissions } from "../../js/groups/types";
import { User, UserNested } from "../../js/users/types";
import { createFakeGroupMinimal } from "./groups";
import { createFakePermissions } from "./permissions";

type CreateFakeUserNestedProps = {
    handle?: string;
    id?: string;
    administrator?: boolean;
};

/**
 * Create a UserNested object with fake data
 *
 * @param {CreateFakeUserNestedProps} props values to override the default automatically generated values
 * @returns {UserNested} a UserNested object with fake data
 */
export function createFakeUserNested(props?: CreateFakeUserNestedProps): UserNested {
    let { handle, id, administrator } = props || {};

    return {
        id: id || faker.random.alphaNumeric(8),
        administrator: administrator || false,
        handle: handle || faker.internet.userName(),
    };
}

type CreateFakeUserProps = {
    permissions?: Permissions;
    groups?: Array<GroupMinimal>;
    primary_group?: GroupMinimal;
    handle?: string;
    administrator_role?: AdministratorRoles;
};

/**
 * Create User object with fake data
 *
 * @param {CreateFakeUserProps} props values to override the default automatically generated values
 * @returns {User} a User object with fake data
 */
export function createFakeUser(props?: CreateFakeUserProps): User {
    let { permissions, groups, primary_group, ...userProps } = props || {};

    groups = groups === undefined ? [createFakeGroupMinimal()] : groups;
    primary_group = primary_group === undefined ? groups[0] : primary_group;

    const BaseUser = {
        id: faker.random.alphaNumeric(8),
        handle: faker.internet.userName(),
        active: true,
        force_reset: false,
        groups,
        primary_group,
        last_password_change: faker.date.past(),
        permissions: createFakePermissions(permissions),
        administrator_role: null,
    };

    return merge(BaseUser, userProps);
}

/**
 * Create an array of user objects with fake data
 *
 * @param {number} count the number of users to create
 * @returns {User[]} An array of User objects with fake data
 */
export function createFakeUsers(count: number): Array<User> {
    return times(count || 1, () => createFakeUser());
}

type Query = {
    page: number;
    per_page: number;
    term: string;
    administrator: boolean;
};

/**
 * Creates a mocked API call for getting a list of users
 *
 * @param {User[]} users an array of users to return
 * @param {Query} query the query parameters to match
 * @returns {nock.Scope} a nock scope that mocks the API call
 */
export function mockApiGetUsers(users: Array<User>, query?: Query) {
    return nock("http://localhost")
        .get("/api/admin/users")
        .query(query || true)
        .reply(200, {
            found_count: users.length,
            page: 1,
            page_count: 1,
            per_page: 25,
            total_count: users.length,
            items: users,
        });
}
