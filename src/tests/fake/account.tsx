import { faker } from "@faker-js/faker";
import nock from "nock";
import { Account } from "../../js/account/types";

export function createFakeAccount(): Account {
    return {
        id: "3691nwak3",
        administrator_role: null,
        groups: [],
        handle: faker.internet.userName(),
        last_password_change: faker.date.past()
    };
}

export function mockAccountApi() {
    return nock("http://localhost").patch("/api/account").reply(200, createFakeAccount);
}
