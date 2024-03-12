import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { mockApiRemoveSequence } from "../../../../tests/fake/otus";
import { renderWithRouter } from "../../../../tests/setupTests";
import RemoveSequence from "../RemoveSequence";

describe("<RemoveSequence />", () => {
    let props;
    let history;

    beforeEach(() => {
        props = {
            otuId: "foo",
            isolateId: "bar",
            isolateName: "baz",
        };
        history = createBrowserHistory();
    });

    it("should render when [show=true]", () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { removeSequence: "sequenceId" } }]}>
                <RemoveSequence {...props} />
            </MemoryRouter>,
            {},
            history,
        );

        expect(screen.getByText("Remove Sequence")).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to remove the sequence from/)).toBeInTheDocument();
        expect(screen.getByText(/baz?/)).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render when [show=false]", () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { removeSequence: "" } }]}>
                <RemoveSequence {...props} />)
            </MemoryRouter>,
            {},
            history,
        );

        expect(screen.queryByText("Remove Sequence")).toBeNull();
        expect(screen.queryByText(/Are you sure you want to remove the sequence from/)).toBeNull();
        expect(screen.queryByText(/baz?/)).toBeNull();
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("should handle submit when onConfirm() on RemoveDialog is called", async () => {
        const scope = mockApiRemoveSequence(props.otuId, props.isolateId, "sequenceId");
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { removeSequence: "sequenceId" } }]}>
                <RemoveSequence {...props} />
            </MemoryRouter>,
            {},
            history,
        );

        await userEvent.click(screen.getByRole("button"));

        scope.done();
    });
});
