import { faker } from "@faker-js/faker";
import { Group, GroupMinimal, Permissions } from "@groups/types";
import { UserNested } from "@users/types";
import { merge } from "lodash-es";
import nock from "nock";
import { createFakePermissions } from "./permissions";

type CreateFakeGroupMinimalProps = {
    id?: string;
    name?: string;
};

/**
 * Create a GroupMinimal object with fake data.
 *
 * @param  props values to override the default automatically generated values
 * @returns {GroupMinimal} GroupMinimal object with fake data
 */
export function createFakeGroupMinimal(
    props?: CreateFakeGroupMinimalProps,
): GroupMinimal {
    const defaultGroupMinimal = {
        id: faker.number.int(),
        name: `${faker.person.jobType()}s`,
        legacy_id: null,
    };

    return merge(defaultGroupMinimal, props);
}

type CreateFakeGroupProps = {
    id?: string;
    name?: string;
    permissions?: Permissions;
    users?: UserNested[];
};

/**
 * Create Group object with fake data.
 *
 * @param {createFakeGroup} props values to override the default automatically generated values
 * @returns {Group} Group object with fake data
 */
export function createFakeGroup(props?: CreateFakeGroupProps): Group {
    const { name, permissions, users, id } = props || {};
    return {
        ...createFakeGroupMinimal({ name, id }),
        permissions: createFakePermissions(permissions),
        users: users || [],
    };
}

/**
 * Creates a mocked API call for getting a group.
 *
 * @param {Group} group group to be returned from the mocked API call
 * @returns {nock.Scope} nock scope for the mocked API call
 */
export function mockApiGetGroup(group: Group) {
    return nock("http://localhost")
        .get(`/api/groups/${group.id}`)
        .reply(200, group);
}

/**
 * Creates a mocked API call for getting a list of groups.
 *
 * @param {Group[]} groups groups to be returned from the mocked API call
 * @returns {nock.Scope} nock scope for the mocked API call
 */
export function mockApiListGroups(groups: Group[]) {
    return nock("http://localhost").get("/api/groups").reply(200, groups);
}
