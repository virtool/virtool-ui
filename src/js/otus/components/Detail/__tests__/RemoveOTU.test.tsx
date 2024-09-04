import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithMemoryRouter } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { mockApiRemoveOTU } from "../../../../../tests/fake/otus";
import RemoveOTU from "../RemoveOTU";

describe("<RemoveOTU />", () => {
    let props;

    beforeEach(() => {
        props = {
            id: "foo",
            name: "Foo",
            refId: "baz",
        };
    });

    it("should render when [show=true]", () => {
        renderWithMemoryRouter(<RemoveOTU {...props} />, [{ state: { removeOTU: true } }]);

        expect(screen.getByText("Remove OTU")).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to remove/)).toBeInTheDocument();
        expect(screen.getByText(/Foo?/)).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render when [show=false]", () => {
        renderWithMemoryRouter(<RemoveOTU {...props} />, [{ state: { removeOTU: false } }]);

        expect(screen.queryByText("Remove OTU")).toBeNull();
        expect(screen.queryByText(/Are you sure you want to remove/)).toBeNull();
        expect(screen.queryByText(/Foo?/)).toBeNull();
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("should handle submit when onConfirm() on RemoveDialog is called", async () => {
        const scope = mockApiRemoveOTU(props.id);
        renderWithMemoryRouter(<RemoveOTU {...props} />, [{ state: { removeOTU: true } }]);

        await userEvent.click(screen.getByRole("button"));

        scope.done();
    });
});
