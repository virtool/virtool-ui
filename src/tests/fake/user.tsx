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
 * Returns a UserNested object populated with fake data
 *
 * @param props - values to override automatically generated values
 * @returns a UserNested object with fake data
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
 * Returns a User object populated with fake data
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
 * Returns an array of User objects populated with fake data
 *
 * @param count - the number of users to create
 * @returns An array of User objects populated with fake data
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
 * Mocks an API call for getting page of userSearchResults
 *
 * @param users - an array of users to return
 * @param query - the query parameters to match
 * @returns - a nock Scope for the mocked API call
 */
export function mockApiFindUsers(users: Array<User>, query?: Query) {
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
