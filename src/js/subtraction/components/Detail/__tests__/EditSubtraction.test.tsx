import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeSubtraction } from "../../../../../tests/fake/subtractions";
import { renderWithProviders } from "../../../../../tests/setupTests";
import { EditSubtraction, mapDispatchToProps } from "../EditSubtraction";

describe("<EditSubtraction />", () => {
    const subtraction = createFakeSubtraction();
    let props;

    beforeEach(() => {
        props = {
            subtraction,
            show: true,
            onHide: vi.fn(),
            onUpdate: vi.fn(),
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

        const nameInput = screen.getByRole("textbox", { name: "name" });
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveValue(subtraction.name);

        await userEvent.clear(nameInput);
        expect(nameInput).toHaveValue("");

        await userEvent.type(nameInput, "test");
        expect(nameInput).toHaveValue("test");
    });

    it("should render after nickname is changed", async () => {
        renderWithProviders(<EditSubtraction {...props} />);

        const nicknameInput = screen.getByRole("textbox", { name: "nickname" });
        expect(nicknameInput).toBeInTheDocument();
        expect(nicknameInput).toHaveValue(subtraction.nickname);

        await userEvent.clear(nicknameInput);
        expect(nicknameInput).toHaveValue("");

        await userEvent.type(nicknameInput, "test");
        expect(nicknameInput).toHaveValue("test");
    });

    it("should call onUpdate() when form is submitted", async () => {
        renderWithProviders(<EditSubtraction {...props} />);

        await userEvent.click(screen.getByText("Save"));

        expect(props.onUpdate).toHaveBeenCalledWith(subtraction.id, subtraction.name, subtraction.nickname);
        expect(props.onHide).toHaveBeenCalled();
    });

    it("should call onHide() when closed", async () => {
        renderWithProviders(<EditSubtraction {...props} />);

        await userEvent.click(screen.getByLabelText("close"));

        await waitFor(() => expect(props.onHide).toHaveBeenCalled());
    });
});

describe("mapDispatchToProps()", () => {
    it("should return updateSubtraction in props", () => {
        const dispatch = vi.fn();
        const props = mapDispatchToProps(dispatch);
        props.onUpdate("foo", "Foo", "Bar");
        expect(dispatch).toHaveBeenCalledWith({
            payload: { subtractionId: "foo", name: "Foo", nickname: "Bar" },
            type: "UPDATE_SUBTRACTION_REQUESTED",
        });
    });
});
