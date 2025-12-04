import { faker } from "@faker-js/faker";
import { Message } from "@message/types";
import nock from "nock";
import { createFakeUserNested } from "./user";

/**
 * Create a fake message
 *
 * @param overrides - optional properties for creating a fake message with specific values
 */
export function createFakeMessage(overrides?: Partial<Message>): Message {
    return {
        active: true,
        color: "red",
        created_at: faker.date.past().toISOString(),
        id: faker.number.int(),
        message: faker.lorem.sentence(),
        updated_at: faker.date.past().toISOString(),
        user: createFakeUserNested(),
        ...overrides,
    };
}

/**
 * Creates a mocked API call for getting the instance message
 *
 * @param message - The message documents
 * @returns A nock scope for the mocked API call
 */
export function mockApiGetMessage(message) {
    return nock("http://localhost")
        .get("/api/instance_message")
        .reply(200, message);
}
