import { faker } from "@faker-js/faker";

class Account {
    id: string;
    administrator: boolean;
    groups: string[];
    handle: string;
    last_password_change: Date;
}

export function createFakeAccount(): Account {
    return {
        id: "3691nwak3",
        administrator: faker.datatype.boolean(),
        groups: [],
        handle: faker.internet.userName(),
        last_password_change: faker.date.past()
    };
}
