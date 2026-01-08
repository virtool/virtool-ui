import { faker } from "@faker-js/faker";
import {
    JobMinimal,
    JobNested,
    JobState,
    ServerJobMinimal,
    ServerJobNested,
    Workflow,
} from "@jobs/types";
import nock from "nock";
import { createFakeUserNested } from "./user";

/** V1 job states used by the server for nested jobs */
type ServerJobState =
    | "cancelled"
    | "complete"
    | "error"
    | "preparing"
    | "running"
    | "terminated"
    | "timeout"
    | "waiting";

/**
 * Creates a fake job minimal object in server response shape.
 * Use this for HTTP mocks.
 */
export function createFakeServerJobMinimal(
    overrides?: Partial<ServerJobMinimal>,
): ServerJobMinimal {
    return {
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        created_at: faker.date.past().toISOString(),
        progress: faker.number.int({ min: 0, max: 100 }),
        state: faker.helpers.arrayElement<JobState>([
            "cancelled",
            "failed",
            "pending",
            "running",
            "succeeded",
        ]),
        user: createFakeUserNested(),
        workflow: "pathoscope_bowtie",
        ...overrides,
    };
}

/**
 * Creates a fake job minimal object in client shape (transformed).
 * Use this for components that expect the transformed JobMinimal type.
 */
export function createFakeJobMinimal(
    overrides?: Partial<JobMinimal>,
): JobMinimal {
    return {
        createdAt: faker.date.past(),
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        progress: faker.number.int({ min: 0, max: 100 }),
        state: faker.helpers.arrayElement<JobState>([
            "cancelled",
            "failed",
            "pending",
            "running",
            "succeeded",
        ]),
        user: {
            handle: faker.internet.username(),
            id: faker.number.int(),
        },
        workflow: faker.helpers.arrayElement<Workflow>([
            "build_index",
            "create_sample",
            "create_subtraction",
            "nuvs",
            "pathoscope",
        ]),
        ...overrides,
    };
}

/**
 * Creates a fake nested job object in server response shape (V1 states).
 * Use this for HTTP mocks of resources with nested jobs (samples, analyses, etc).
 */
export function createFakeServerJobNested(
    overrides?: Partial<ServerJobNested>,
): ServerJobNested {
    return {
        created_at: faker.date.past().toISOString(),
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        progress: faker.number.int({ min: 0, max: 100 }),
        state: faker.helpers.arrayElement<ServerJobState>([
            "cancelled",
            "complete",
            "error",
            "preparing",
            "running",
            "terminated",
            "timeout",
            "waiting",
        ]),
        user: createFakeUserNested(),
        workflow: "pathoscope_bowtie",
        ...overrides,
    };
}

/**
 * Creates a fake nested job object in client shape (transformed with V2 states).
 * Use this for components that expect the transformed JobNested type.
 */
export function createFakeJobNested(overrides?: Partial<JobNested>): JobNested {
    return {
        createdAt: faker.date.past(),
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        progress: faker.number.int({ min: 0, max: 100 }),
        state: faker.helpers.arrayElement<JobState>([
            "cancelled",
            "failed",
            "pending",
            "running",
            "succeeded",
        ]),
        user: {
            handle: faker.internet.username(),
            id: faker.number.int(),
        },
        workflow: faker.helpers.arrayElement<Workflow>([
            "build_index",
            "create_sample",
            "create_subtraction",
            "nuvs",
            "pathoscope",
        ]),
        ...overrides,
    };
}

/**
 * Sets up a mocked API route for fetching a list of jobs
 *
 * @param jobs - The documents for jobs (server shape)
 * @param found_count - The number of jobs found
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetJobs(
    jobs: ReturnType<typeof createFakeServerJobMinimal>[],
    found_count?: number,
) {
    return nock("http://localhost")
        .get("/api/jobs/v2")
        .query(true)
        .reply(200, {
            items: jobs,
            counts: {},
            found_count: found_count ?? jobs.length,
            page: 1,
            page_count: 1,
            per_page: 25,
            total_count: jobs.length,
        });
}
