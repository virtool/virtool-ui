import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithMemoryRouter } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeSubtraction, mockApiRemoveSubtraction } from "../../../../../tests/fake/subtractions";
import RemoveSubtraction from "../RemoveSubtraction";

describe("<RemoveSubtraction />", () => {
    const subtraction = createFakeSubtraction();
    let props;

    beforeEach(() => {
        props = {
            subtraction,
            show: true,
            onHide: vi.fn(),
        };
    });

    it("should render when [show=false]", () => {
        props.show = false;
        renderWithMemoryRouter(<RemoveSubtraction {...props} />);

        expect(screen.queryByText("Remove Subtraction")).toBeNull();
    });

    it("should render when [show=true]", () => {
        renderWithMemoryRouter(<RemoveSubtraction {...props} />);

        expect(screen.getByText("Remove Subtraction")).toBeInTheDocument();
    });

    it("should call onConfirm() when onConfirm() on <RemoveModal /> is called", async () => {
        const scope = mockApiRemoveSubtraction(subtraction.id);
        renderWithMemoryRouter(<RemoveSubtraction {...props} />);

        await userEvent.click(screen.getByRole("button", { name: "Confirm" }));

        scope.done();
    });

    it("should call onHide() when onHide() on <RemoveModal /> is called", async () => {
        renderWithMemoryRouter(<RemoveSubtraction {...props} />);

        fireEvent.keyDown(document, { key: "Escape" });
        expect(props.onHide).toHaveBeenCalled();
    });
});
