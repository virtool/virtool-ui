import { faker } from "@faker-js/faker";
import {
    JobMinimal,
    JobState,
    ServerJobMinimal,
    ServerJobState,
    Workflow,
} from "@jobs/types";
import nock from "nock";
import { createFakeUserNested } from "./user";

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
        stage: "waiting",
        state: faker.helpers.arrayElement<ServerJobState>([
            "cancelled",
            "complete",
            "error",
            "running",
            "waiting",
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
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        createdAt: faker.date.past(),
        progress: faker.number.int({ min: 0, max: 100 }),
        step: "waiting",
        state: faker.helpers.arrayElement<JobState>([
            "cancelled",
            "failed",
            "pending",
            "running",
            "succeeded",
        ]),
        user: {
            id: faker.number.int(),
            handle: faker.internet.username(),
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
    return nock("http://localhost").get("/api/jobs").query(true).reply(200, {
        documents: jobs,
        counts: null,
        found_count,
        page: 1,
        page_count: 1,
        per_page: 25,
        ready_count: jobs.length,
        total_count: jobs.length,
    });
}
