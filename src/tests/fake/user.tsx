import { faker } from "@faker-js/faker";
import { merge, times } from "lodash-es";
import nock from "nock";
import { AdministratorRoles } from "../../js/administration/types";
import { GroupMinimal } from "../../js/groups/types";
import { Permissions, User, UserNested } from "../../js/users/types";
import { createFakeGroupMinimal } from "./groups";
import { createFakePermissions } from "./permissions";

type createFakeUserNestedProps = {
    handle?: string;
    id?: string;
    administrator?: boolean;
};

export function createFakeUserNested(props?: createFakeUserNestedProps): UserNested {
    let { handle, id, administrator } = props || {};

    return {
        id: id || faker.random.alphaNumeric(8),
        administrator: administrator || false,
        handle: handle || faker.internet.userName(),
    };
}

type createFakeUserProps = {
    permissions?: Permissions;
    groups?: Array<GroupMinimal>;
    primary_group?: GroupMinimal;
    handle?: string;
    administrator_role?: AdministratorRoles;
};

export function createFakeUser(props?: createFakeUserProps): User {
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

export function createFakeUsers(count: number): Array<User> {
    return times(count || 1, () => createFakeUser());
}

type Query = {
    page: number;
    per_page: number;
    term: string;
    administrator: boolean;
};

export function mockGetUsersAPI(users: Array<User>, query?: Query) {
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
