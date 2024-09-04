import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiRemoveSample } from "@tests/fake/samples";
import { renderWithMemoryRouter } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import RemoveSample from "../RemoveSample";

describe("<RemoveSample />", () => {
    let props;

    beforeEach(() => {
        props = {
            id: "foo",
            name: "test",
        };
    });

    it("renders when [show=true]", () => {
        renderWithMemoryRouter(<RemoveSample {...props} />, [{ state: { removeSample: true } }]);

        expect(screen.getByText("Remove Sample")).toBeInTheDocument();
        expect(screen.getByText("test")).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders when [show=false]", () => {
        renderWithMemoryRouter(<RemoveSample {...props} />, [{ state: { removeSample: false } }]);

        expect(screen.queryByText("Remove Sample")).toBeNull();
        expect(screen.queryByText("test")).toBeNull();
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("should handle submit when onConfirm() on RemoveDialog is called", async () => {
        const scope = mockApiRemoveSample(props.id);
        renderWithMemoryRouter(<RemoveSample {...props} />, [{ state: { removeSample: true } }]);

        await userEvent.click(screen.getByRole("button"));

        scope.done();
    });
});
