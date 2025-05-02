import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ReferenceRight } from "../ReferenceRight";

describe("<ReferenceRight />", () => {
    let props;

    beforeEach(() => {
        props = {
            right: "build",
            enabled: true,
            onToggle: vi.fn(),
        };
    });

    it("should render", () => {
        renderWithProviders(<ReferenceRight {...props} />);

        expect(screen.getByText("build")).toBeInTheDocument();
        expect(
            screen.getByText("Can build new indexes for the reference."),
        ).toBeInTheDocument();
        expect(screen.getByRole("checkbox")).toHaveAttribute(
            "data-state",
            "checked",
        );
    });

    it("should render when right is modify_otu", () => {
        props.right = "modify_otu";
        renderWithProviders(<ReferenceRight {...props} />);

        expect(screen.getByText("modify_otu")).toBeInTheDocument();
    });

    it("should render when right is not enabled", () => {
        props.enabled = false;
        renderWithProviders(<ReferenceRight {...props} />);

        expect(screen.getByRole("checkbox")).toHaveAttribute(
            "data-state",
            "unchecked",
        );
    });

    it.each([true, false])(
        "should have onToggle called on Checkbox click when [enabled=%p]",
        async (enabled) => {
            props.enabled = enabled;
            renderWithProviders(<ReferenceRight {...props} />);

            await userEvent.click(screen.getByRole("checkbox"));
            expect(props.onToggle).toHaveBeenCalledWith(props.right, !enabled);
        },
    );
});
