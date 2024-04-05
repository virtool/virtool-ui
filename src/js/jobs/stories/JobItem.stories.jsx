import React from "react";
import { JobItem } from "../components/Item/JobItem";

export default {
    title: "jobs/LabelItem",
    component: JobItem,
};

const user = {
    id: "foo",
    handle: "Foo Bar",
};

export const Cancellable = () => (
    <JobItem
        id="foo"
        created_at={Date.now()}
        canCancel
        progress={23}
        onArchive={() => {}}
        user={user}
        workflow="nuvs"
        state="running"
    />
);

export const Waiting = () => (
    <JobItem
        id="foo"
        created_at={Date.now()}
        canCancel={false}
        progress={0}
        onArchive={() => {}}
        user={user}
        workflow="nuvs"
        state="waiting"
    />
);

export const Complete = () => (
    <JobItem
        id="foo"
        created_at={Date.now()}
        canCancel={false}
        progress={23}
        onArchive={() => {}}
        user={user}
        workflow="nuvs"
        state="complete"
    />
);

export const Running = () => (
    <JobItem
        id="foo"
        created_at={Date.now()}
        canCancel={false}
        progress={23}
        onArchive={() => {}}
        user={user}
        workflow="nuvs"
        state="running"
    />
);

export const Timeout = () => (
    <JobItem
        id="foo"
        created_at={Date.now()}
        canCancel={false}
        progress={23}
        onArchive={() => {}}
        user={user}
        workflow="nuvs"
        state="timeout"
    />
);
