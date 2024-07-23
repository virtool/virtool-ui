import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../../../tests/setupTests";
import MemberItem from "../MemberItem";

describe("<MemberItem />", () => {
    let props;

    beforeEach(() => {
        props = {
            canModify: false,
            handle: "bob",
            onEdit: vi.fn(),
            onRemove: vi.fn(),
        };
    });

    it("should render", () => {
        renderWithProviders(<MemberItem {...props} />);
        expect(screen.getByText("bob")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Remove" })).not.toBeInTheDocument();
    });

    it("should show modification button when [canModify=true]", () => {
        props.canModify = true;
        renderWithProviders(<MemberItem {...props} />);
        expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
    });

    it("should call onEdit when edit icon is clicked", async () => {
        props.canModify = true;
        renderWithProviders(<MemberItem {...props} />);

        await userEvent.click(screen.getByRole("button", { name: "Edit" }));
        expect(props.onEdit).toHaveBeenCalledWith(props.id);
    });

    it("should call onRemove when trash icon is clicked", async () => {
        props.canModify = true;
        renderWithProviders(<MemberItem {...props} />);

        await userEvent.click(screen.getByRole("button", { name: "Remove" }));
        expect(props.onRemove).toHaveBeenCalledWith(props.id);
    });
});
