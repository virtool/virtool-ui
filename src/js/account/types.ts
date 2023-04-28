import { faker } from "@faker-js/faker";
import { AdministratorRoles } from "../administration/types";

export class Account {
    id: string;
    administrator_role: AdministratorRoles;
    groups: string[];
    handle: string;
    last_password_change: Date;
}

export function createFakeAccount(): Account {
    return {
        id: "3691nwak3",
        administrator_role: null,
        groups: [],
        handle: faker.internet.userName(),
        last_password_change: faker.date.past()
    };
}
