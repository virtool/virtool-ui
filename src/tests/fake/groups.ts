import { faker } from "@faker-js/faker";
import { merge } from "lodash-es";
import nock from "nock";
import { Group, GroupMinimal, Permissions } from "../../js/groups/types";
import { UserNested } from "../../js/users/types";
import { createFakePermissions } from "./permissions";

type createFakeGroupMinimalProps = {
    id?: string;
    name?: string;
};
export function createFakeGroupMinimal(props?: createFakeGroupMinimalProps): GroupMinimal {
    const defaultGroupMinimal = {
        id: faker.random.alphaNumeric(8),
        name: `${faker.random.word()}_group`,
    };

    return merge(defaultGroupMinimal, props);
}

type createFakeGroupProps = {
    name?: string;
    permissions?: Permissions;
    users?: UserNested[];
};

export function createFakeGroup(props?: createFakeGroupProps): Group {
    const { name, permissions, users } = props || {};
    return {
        id: faker.random.alphaNumeric(8),
        name: name || `${faker.random.word()}_group`,
        permissions: createFakePermissions(permissions),
        users: users || [],
    };
}

export function mockGetGroupAPI(group: Group) {
    return nock("http://localhost").get(`/api/groups/${group.id}`).reply(200, group);
}

export function mockListGroupsAPI(groups: Group[]) {
    return nock("http://localhost").get("/api/groups").reply(200, groups);
}
