import { faker } from "@faker-js/faker";
import { times } from "lodash-es";
import { AdministratorRoles } from "../administration/types";

type Group = {
    id: string;
    name: string;
    toggled: boolean;
};

type Permissions = {
    cancel_job: boolean;
    create_ref: boolean;
    create_sample: boolean;
    modify_hmm: boolean;
    modify_subtraction: boolean;
    remove_file: boolean;
    remove_job: boolean;
    upload_file: boolean;
};

class UserDetail {
    active: boolean;
    administrator: boolean;
    administrator_role: AdministratorRoles;
    force_reset: boolean;
    groups: Group[];
    handle: string;
    id: string;
    last_password_change: string;
    permissions: Permissions;
    primary_group: Group;
}

export function createFakeUserDetail(): UserDetail {
    const groups = times(5, (i: number) => ({
        id: faker.random.alphaNumeric(9, { casing: "lower" }),
        name: `group${i}`,
        toggled: true
    }));

    return {
        active: faker.datatype.boolean(),
        administrator: faker.datatype.boolean(),
        administrator_role: null,
        force_reset: faker.datatype.boolean(),
        groups,
        handle: faker.name.firstName(),
        id: "3691nwak3",
        last_password_change: "2022-11-16T22:28:52.915000Z",
        permissions: {
            cancel_job: faker.datatype.boolean(),
            create_ref: faker.datatype.boolean(),
            create_sample: faker.datatype.boolean(),
            modify_hmm: faker.datatype.boolean(),
            modify_subtraction: faker.datatype.boolean(),
            remove_file: faker.datatype.boolean(),
            remove_job: faker.datatype.boolean(),
            upload_file: faker.datatype.boolean()
        },
        primary_group: groups[2]
    };
}

export const createFakeDocuments = (numOfDocs: number): UserDetail[] => times(numOfDocs, () => createFakeUserDetail());
