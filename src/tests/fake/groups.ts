import { faker } from "@faker-js/faker";
import { Group, GroupMinimal } from "@groups/types";
import { merge } from "lodash-es";
import { createFakePermissions } from "./permissions";

/**
 * Create a GroupMinimal object with fake data.
 *
 * @param overrides values to override the default automatically generated values
 * @returns GroupMinimal object with fake data
 */
export function createFakeGroupMinimal(
    overrides?: Partial<GroupMinimal>,
): GroupMinimal {
    const defaultGroupMinimal = {
        id: faker.number.int(),
        name: `${faker.person.jobType()}s`,
        legacy_id: null,
    };

    return merge(defaultGroupMinimal, overrides);
}

/**
 * Create Group object with fake data.
 *
 * @param overrides values to override the default automatically generated values
 * @returns Group object with fake data
 */
export function createFakeGroup(overrides?: Partial<Group>): Group {
    const { name, permissions, users, id } = overrides || {};
    return {
        ...createFakeGroupMinimal({ name, id }),
        permissions: createFakePermissions(permissions),
        users: users || [],
    };
}
