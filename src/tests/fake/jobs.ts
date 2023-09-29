import { faker } from "@faker-js/faker";
import { merge } from "lodash";
import { UserNested } from "../../js/users/types";
import { createFakeUserNested } from "./user";

const jobStates = ["complete", "cancelled", "error", "preparing", "running", "terminated", "timeout", "waiting"];

type CreateJobNestedProps = {
    id: string;
};
export function createFakeJobNested(props?: CreateJobNestedProps) {
    return { id: props.id || faker.random.alphaNumeric(8) };
}

type CreateJobMinimalProps = {
    archived?: boolean;
    created_at?: string;
    progress?: number;
    stage?: string;
    state?: string;
    user?: UserNested;
    workflow?: string;
};

export function createFakeJobMinimal(props?: CreateJobMinimalProps) {
    const defaultJobMinimal = {
        archived: false,
        created_at: faker.date.past().toISOString(),
        progress: faker.datatype.number(100),
        stage: "waiting",
        state: faker.helpers.arrayElement(jobStates),
        user: createFakeUserNested(),
        workflow: "pathoscope",
    };

    return merge(defaultJobMinimal, props);
}
