import type { Meta } from "@storybook/react-vite";
import JobItem from "../components/JobItem";

const meta: Meta<typeof JobItem> = {
    title: "jobs/Item",
    component: JobItem,
};

export default meta;

const user = {
    id: 1,
    handle: "Foo Bar",
};

const createdAt = new Date();

export function Pending() {
    return (
        <JobItem
            id="foo"
            createdAt={createdAt}
            progress={0}
            user={user}
            workflow="nuvs"
            state="pending"
        />
    );
}

export function Succeeded() {
    return (
        <JobItem
            id="foo"
            createdAt={createdAt}
            progress={100}
            user={user}
            workflow="nuvs"
            state="succeeded"
        />
    );
}

export function Running() {
    return (
        <JobItem
            id="foo"
            createdAt={createdAt}
            progress={23}
            user={user}
            workflow="nuvs"
            state="running"
        />
    );
}

export function Failed() {
    return (
        <JobItem
            id="foo"
            createdAt={createdAt}
            progress={23}
            user={user}
            workflow="nuvs"
            state="failed"
        />
    );
}
