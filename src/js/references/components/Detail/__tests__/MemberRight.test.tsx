import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemberRight } from "../MemberRight";

describe("<MemberRight />", () => {
    let props;

    beforeEach(() => {
        props = {
            right: "build",
            enabled: true,
            onToggle: vi.fn(),
        };
    });

    it("should render", () => {
        renderWithProviders(<MemberRight {...props} />);

        expect(screen.getByText("build")).toBeInTheDocument();
        expect(screen.getByText("Can build new indexes for the reference.")).toBeInTheDocument();
        expect(screen.getByRole("checkbox")).toHaveAttribute("data-state", "checked");
    });

    it("should render when right is modify_otu", () => {
        props.right = "modify_otu";
        renderWithProviders(<MemberRight {...props} />);

        expect(screen.getByText("modify_otu")).toBeInTheDocument();
    });

    it("should render when right is not enabled", () => {
        props.enabled = false;
        renderWithProviders(<MemberRight {...props} />);

        expect(screen.getByRole("checkbox")).toHaveAttribute("data-state", "unchecked");
    });

    it.each([true, false])("should have onToggle called on Checkbox click when [enabled=%p]", async enabled => {
        props.enabled = enabled;
        renderWithProviders(<MemberRight {...props} />);

        await userEvent.click(screen.getByRole("checkbox"));
        expect(props.onToggle).toHaveBeenCalledWith(props.right, !enabled);
    });
});
