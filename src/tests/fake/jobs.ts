import { faker } from "@faker-js/faker";
import { merge } from "lodash";
import nock from "nock";
import { JobMinimal, JobState, workflows } from "../../jobs/types";
import { UserNested } from "../../users/types";
import { createFakeUserNested } from "./user";

const jobStates = [
    "complete",
    "cancelled",
    "error",
    "preparing",
    "running",
    "terminated",
    "timeout",
    "waiting",
];

type CreateJobNestedProps = {
    id?: string;
};

export function createFakeJobNested(props?: CreateJobNestedProps) {
    const defaultJobNested = {
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
    };

    return merge(defaultJobNested, props);
}

type CreateJobMinimalProps = {
    archived?: boolean;
    created_at?: string;
    progress?: number;
    stage?: string;
    state?: JobState;
    user?: UserNested;
    workflow?: string;
};

export function createFakeJobMinimal(
    props?: CreateJobMinimalProps,
): JobMinimal {
    const defaultJobMinimal = {
        ...createFakeJobNested(),
        archived: false,
        created_at: faker.date.past().toISOString(),
        progress: faker.number.int({ min: 0, max: 100 }),
        stage: "waiting",
        state: faker.helpers.arrayElement(jobStates) as JobState,
        user: createFakeUserNested(),
        workflow: workflows.pathoscope_bowtie,
    };

    return merge(defaultJobMinimal, props);
}

/**
 * Sets up a mocked API route for fetching a list of jobs
 *
 * @param jobs - The documents for jobs
 * @param found_count - The number of jobs found
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetJobs(jobs: JobMinimal[], found_count?: number) {
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
