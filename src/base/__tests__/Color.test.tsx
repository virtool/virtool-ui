import Color from "../Color";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import React from "react";
import { describe, expect, it, vi } from "vitest";

describe("<Color />", () => {
    it("should call onChange when color clicked or input changed", async () => {
        const onChange = vi.fn();

        const { getByRole, getByTitle } = renderWithProviders(
            <Color id="color" value="#DDDDDD" onChange={onChange} />,
        );

        const textbox = getByRole("textbox");

        // Change the input text value
        expect(textbox).toHaveValue("#DDDDDD");

        // Click on a color square
        getByTitle("#C4B5FD").click();
        expect(onChange).toHaveBeenLastCalledWith("#C4B5FD");

        // Clear the text box to change input value
        await userEvent.clear(textbox);
        expect(onChange).toHaveBeenLastCalledWith("");

        // Type one letter in the textbox
        await userEvent.type(textbox, "A");
        expect(onChange).toHaveBeenLastCalledWith("#DDDDDDA");
    });
});
