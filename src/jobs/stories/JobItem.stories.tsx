import type { Meta } from "@storybook/react";
import React from "react";
import JobItem from "../components/JobItem";
import { JobState, workflows } from "../types";

const meta: Meta<typeof JobItem> = {
    title: "jobs/Item",
    component: JobItem,
};

const user = {
    id: "foo",
    handle: "Foo Bar",
};

export default meta;

const timeElapsed = Date.now();
const today = new Date(timeElapsed);

export function Waiting() {
    return (
        <JobItem
            id="foo"
            created_at={today.toDateString()}
            progress={0}
            user={user}
            workflow={workflows.nuvs}
            state={JobState.waiting}
        />
    );
}

export function Complete() {
    return (
        <JobItem
            id="foo"
            created_at={today.toDateString()}
            progress={23}
            user={user}
            workflow={workflows.nuvs}
            state={JobState.complete}
        />
    );
}

export function Running() {
    return (
        <JobItem
            id="foo"
            created_at={today.toDateString()}
            progress={23}
            user={user}
            workflow={workflows.nuvs}
            state={JobState.running}
        />
    );
}

export function Timeout() {
    return (
        <JobItem
            id="foo"
            created_at={today.toDateString()}
            progress={23}
            user={user}
            workflow={workflows.nuvs}
            state={JobState.timeout}
        />
    );
}
