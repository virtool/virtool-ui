import { configureStore } from "@reduxjs/toolkit";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { attachResizeObserver, renderWithProviders } from "../../../tests/setupTests";
import { LoginForm } from "../LoginForm";

function createAppStore(state) {
    return () =>
        configureStore({
            reducer: state => state,
            preloadedState: state,
        });
}

describe("<LoginForm />", () => {
    attachResizeObserver();
    let props;

    beforeEach(() => {
        props = {
            onLogin: vi.fn(),
        };
        window.virtool = {
            b2c: {
                use: false,
            },
        };
    });

    it("should call onLogin() with correct values when submitted", async () => {
        renderWithProviders(<LoginForm {...props} />, createAppStore(null));

        const usernameField = screen.getByLabelText("Username");
        await userEvent.type(usernameField, "test_Username");
        expect(usernameField).toHaveValue("test_Username");

        const passwordField = screen.getByLabelText("Password");
        await userEvent.type(passwordField, "Password");
        expect(passwordField).toHaveValue("Password");

        expect(screen.getByLabelText("Remember Me")).toHaveAttribute("data-state", "unchecked");
        await userEvent.click(screen.getByLabelText("Remember Me"));
        expect(screen.getByLabelText("Remember Me")).toHaveAttribute("data-state", "checked");

        await userEvent.click(screen.getByRole("button", { name: "Login" }));
        await waitFor(() => expect(props.onLogin).toHaveBeenCalledWith("test_Username", "Password", true));
    });
});
