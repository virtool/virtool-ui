import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../tests/setupTests";
import { FirstUser, mapDispatchToProps } from "../FirstUser";

describe("<FirstUser />", () => {
    let props;
    let errorMessages;

    beforeEach(() => {
        errorMessages = {
            errors: {
                generalError: "General Error",
                usernameErrors: ["Password Error 1", "Password Error 2"],
                passwordErrors: ["Username Error 1", "Username Error 2"],
            },
        };
        props = {
            onSubmit: vi.fn(),
            ...errorMessages,
        };
    });

    it("should call onSubmit when form is submitted", async () => {
        props = {
            onSubmit: vi.fn(),
            ...errorMessages,
        };

        const usernameInput = "Username";
        const passwordInput = "Password";

        renderWithProviders(<FirstUser {...props} />);

        const usernameField = screen.getByRole("textbox", /username/i);
        const passwordField = screen.getByLabelText("Password");

        expect(usernameField).toHaveValue("");
        expect(passwordField).toHaveValue("");

        await userEvent.type(usernameField, usernameInput);
        expect(usernameField).toHaveValue(usernameInput);

        await userEvent.type(passwordField, passwordInput);
        expect(passwordField).toHaveValue(passwordInput);

        await userEvent.click(screen.getByRole("button", { name: /Create User/i }));

        expect(props.onSubmit).toHaveBeenCalledWith("Username", "Password");
    });
});

describe("mapDispatchToProps", () => {
    it("should return onSubmit() on props", () => {
        const dispatch = vi.fn();
        const props = mapDispatchToProps(dispatch);

        props.onSubmit("foo", "bar");

        expect(dispatch).toHaveBeenCalledWith({
            payload: { handle: "foo", password: "bar" },
            type: "CREATE_FIRST_USER_REQUESTED",
        });
    });
});
