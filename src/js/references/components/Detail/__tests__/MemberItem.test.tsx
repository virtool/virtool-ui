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
    });

    it("should render with [canModify=true]", () => {
        props.canModify = true;
        renderWithProviders(<MemberItem {...props} />);

        expect(screen.getByRole("button", { name: "edit" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "remove" })).toBeInTheDocument();
    });

    it("should call onEdit when edit icon is clicked", async () => {
        props.canModify = true;
        renderWithProviders(<MemberItem {...props} />);

        await userEvent.click(screen.getByRole("button", { name: "edit" }));
        expect(props.onEdit).toHaveBeenCalledWith(props.id);
    });

    it("should call onRemove when trash icon is clicked", async () => {
        props.canModify = true;
        renderWithProviders(<MemberItem {...props} />);

        await userEvent.click(screen.getByRole("button", { name: "remove" }));
        expect(props.onRemove).toHaveBeenCalledWith(props.id);
    });
});
