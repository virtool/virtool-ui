import { faker } from "@faker-js/faker";
import { Group, GroupMinimal, Permissions } from "@groups/types";
import { UserNested } from "@users/types";
import { merge } from "lodash-es";
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
