import { faker } from "@faker-js/faker";
import { times } from "lodash-es";
import nock from "nock";
import { AdministratorRoles } from "../../js/administration/types";
import { GroupMinimal } from "../../js/groups/types";
import { Permissions, User } from "../../js/users/types";
import { createFakeGroupMinimal } from "./groups";
import { createFakePermissions } from "./permissions";

type createFakeUserProps = {
    permissions?: Permissions;
    groups?: Array<GroupMinimal>;
    primary_group?: GroupMinimal;
    handle?: string;
    administrator_role?: AdministratorRoles;
};

export function createFakeUser(props?: createFakeUserProps): User {
    let { permissions, groups, primary_group, handle, administrator_role } = props || {};

    groups = groups || [createFakeGroupMinimal()];
    return {
        id: faker.random.alphaNumeric(8),
        administrator: administrator_role === AdministratorRoles.FULL,
        handle: handle || faker.internet.userName(),
        active: true,
        force_reset: false,
        groups: groups,
        last_password_change: faker.date.past(),
        permissions: createFakePermissions(permissions),
        primary_group: primary_group || groups[0],
        administrator_role: administrator_role || null,
    };
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
