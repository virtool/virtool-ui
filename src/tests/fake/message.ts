import { faker } from "@faker-js/faker";
import { assign } from "lodash";
import nock from "nock";
import { createFakeUserNested } from "./user";

type CreateFakeMessage = {
    message?: string;
};

/**
 * Create a fake message
 *
 * @param overrides - optional properties for creating a fake message with specific values
 */
export function createFakeMessage(overrides?: CreateFakeMessage) {
    const defaultMessage = {
        active: true,
        color: "red",
        created_at: faker.date.past(),
        message: faker.random.word(),
        updated_at: faker.date.past(),
        user: createFakeUserNested(),
    };

    return assign(defaultMessage, overrides);
}

/**
 * Creates a mocked API call for getting the instance message
 *
 * @param message - The message documents
 * @returns A nock scope for the mocked API call
 */
export function mockApiGetMessage(message) {
    return nock("http://localhost").get("/api/instance_message").reply(200, message);
}
