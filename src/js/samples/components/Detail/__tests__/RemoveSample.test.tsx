import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { mockApiRemoveSample } from "../../../../../tests/fake/samples";
import { renderWithRouter } from "../../../../../tests/setupTests";
import RemoveSample from "../RemoveSample";

describe("<RemoveSample />", () => {
    let props;
    let history;

    beforeEach(() => {
        props = {
            id: "foo",
            name: "test",
        };
        history = createBrowserHistory();
    });

    it("renders when [show=true]", () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { removeSample: true } }]}>
                <RemoveSample {...props} />
            </MemoryRouter>,
            {},
            history,
        );

        expect(screen.getByText("Remove Sample")).toBeInTheDocument();
        expect(screen.getByText("test")).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders when [show=false]", () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { removeSample: false } }]}>
                <RemoveSample {...props} />
            </MemoryRouter>,
            {},
            history,
        );

        expect(screen.queryByText("Remove Sample")).toBeNull();
        expect(screen.queryByText("test")).toBeNull();
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("should handle submit when onConfirm() on RemoveDialog is called", async () => {
        const scope = mockApiRemoveSample(props.id);
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { removeSample: true } }]}>
                <RemoveSample {...props} />
            </MemoryRouter>,
            {},
            history,
        );

        await userEvent.click(screen.getByRole("button"));

        scope.done();
    });
});
