import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeSubtraction, mockApiEditSubtraction } from "../../../../../tests/fake/subtractions";
import { renderWithProviders } from "../../../../../tests/setupTests";
import EditSubtraction from "../EditSubtraction";

describe("<EditSubtraction />", () => {
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
        renderWithProviders(<EditSubtraction {...props} />);

        expect(screen.queryByRole("textbox", { name: "name" })).toBeNull();
        expect(screen.queryByRole("textbox", { name: "nickname" })).toBeNull();
        expect(screen.queryByRole("button", { name: "close" })).toBeNull();
        expect(screen.queryByText("Save")).toBeNull();
    });

    it("should render after name is changed", async () => {
        renderWithProviders(<EditSubtraction {...props} />);

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveValue(subtraction.name);

        await userEvent.clear(nameInput);
        expect(nameInput).toHaveValue("");

        await userEvent.type(nameInput, "test");
        expect(nameInput).toHaveValue("test");
    });

    it("should render after nickname is changed", async () => {
        renderWithProviders(<EditSubtraction {...props} />);

        const nicknameInput = screen.getByLabelText("Nickname");
        expect(nicknameInput).toBeInTheDocument();
        expect(nicknameInput).toHaveValue(subtraction.nickname);

        await userEvent.clear(nicknameInput);
        expect(nicknameInput).toHaveValue("");

        await userEvent.type(nicknameInput, "test");
        expect(nicknameInput).toHaveValue("test");
    });

    it("should update subtraction when form is submitted", async () => {
        const scope = mockApiEditSubtraction(subtraction, "newName", "newNickname");
        renderWithProviders(<EditSubtraction {...props} />);

        const nameInput = screen.getByLabelText("Name");
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, "newName");

        const nicknameInput = screen.getByLabelText("Nickname");
        await userEvent.clear(nicknameInput);
        await userEvent.type(nicknameInput, "newNickname");

        await userEvent.click(screen.getByText("Save"));

        expect(props.onHide).toHaveBeenCalled();
        scope.done();
    });

    it("should call onHide() when closed", async () => {
        renderWithProviders(<EditSubtraction {...props} />);

        fireEvent.keyDown(document, { key: "Escape" });

        await waitFor(() => expect(props.onHide).toHaveBeenCalled());
    });
});
