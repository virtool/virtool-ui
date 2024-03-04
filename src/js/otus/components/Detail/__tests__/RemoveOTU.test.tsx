import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { mockApiRemoveOTU } from "../../../../../tests/fake/otus";
import { renderWithRouter } from "../../../../../tests/setupTests";
import RemoveOTU from "../RemoveOTU";

describe("<RemoveOTU />", () => {
    let props;
    let history;

    beforeEach(() => {
        props = {
            id: "foo",
            name: "Foo",
            refId: "baz",
        };
        history = createBrowserHistory();
    });

    it("should render when [show=true]", () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { removeOTU: true } }]}>
                <RemoveOTU {...props} />)
            </MemoryRouter>,
            {},
            history,
        );

        expect(screen.getByText("Remove OTU")).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to remove/)).toBeInTheDocument();
        expect(screen.getByText(/Foo?/)).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render when [show=false]", () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { removeOTU: false } }]}>
                <RemoveOTU {...props} />)
            </MemoryRouter>,
            {},
            history,
        );

        expect(screen.queryByText("Remove OTU")).toBeNull();
        expect(screen.queryByText(/Are you sure you want to remove/)).toBeNull();
        expect(screen.queryByText(/Foo?/)).toBeNull();
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("should handle submit when onConfirm() on RemoveDialog is called", async () => {
        const scope = mockApiRemoveOTU(props.id);
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { removeOTU: true } }]}>
                <RemoveOTU {...props} />
            </MemoryRouter>,
            {},
            history,
        );

        await userEvent.click(screen.getByRole("button"));

        scope.done();
    });
});
