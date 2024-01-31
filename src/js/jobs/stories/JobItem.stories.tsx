import React from "react";
import JobItem from "../components/Item/JobItem";

export default {
    title: "jobs/Item",
    component: JobItem,
};

const user = {
    id: "foo",
    handle: "Foo Bar",
};

export function Cancellable() {
    return (
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
}

export function Waiting() {
    return (
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
}

export function Complete() {
    return (
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
}

export function Running() {
    return (
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
}

export function Timeout() {
    return (
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
}
