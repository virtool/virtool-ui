import { configureStore } from "@reduxjs/toolkit";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { attachResizeObserver, renderWithProviders } from "../../../tests/setupTests";
import { LOGIN } from "../../app/actionTypes";
import { Login, mapDispatchToProps, mapStateToProps } from "../Login";

function createAppStore(state) {
    return () =>
        configureStore({
            reducer: state => state,
            preloadedState: state,
        });
}

describe("<Login />", () => {
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
        renderWithProviders(<Login {...props} />, createAppStore(null));

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

describe("mapStateToProps()", () => {
    it("should return props given state", () => {
        const state = {
            app: {},
        };
        const result = mapStateToProps(state);
        expect(result).toEqual({});
    });
});

describe("mapDispatchToProps()", () => {
    it("should return props with valid onLogin()", () => {
        const dispatch = vi.fn();
        const props = mapDispatchToProps(dispatch);

        props.onLogin("bob", "foobar", false);

        expect(dispatch).toHaveBeenCalledWith({
            type: LOGIN.REQUESTED,
            payload: { username: "bob", password: "foobar", remember: false },
        });
    });
});
