import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setupTests";
import nock from "nock";
import React from "react";
import { useDispatch } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginForm from "../LoginForm";

vi.mock("react-redux", () => ({
    useDispatch: vi.fn(),
}));

describe("<LoginForm />", () => {
    let mockDispatch;

    beforeEach(() => {
        mockDispatch = vi.fn();
        (useDispatch as jest.Mock).mockReturnValue(mockDispatch);

        window.virtool = {
            b2c: {
                use: false,
            },
        };
    });

    afterEach(() => nock.cleanAll());

    it("should call mutate() with correct values when submitted", async () => {
        const username = "test_Username";
        const password = "Password";
        const setResetCode = vi.fn();

        const scope = nock("http://localhost")
            .post("/api/account/login", { username, password, remember: true })
            .reply(200);

        renderWithProviders(<LoginForm setResetCode={setResetCode} />);

        const usernameField = screen.getByLabelText("Username");
        await userEvent.type(usernameField, username);
        expect(usernameField).toHaveValue(username);

        const passwordField = screen.getByLabelText("Password");
        await userEvent.type(passwordField, password);
        expect(passwordField).toHaveValue(password);

        expect(screen.getByLabelText("Remember Me")).toHaveAttribute("data-state", "unchecked");
        await userEvent.click(screen.getByLabelText("Remember Me"));
        expect(screen.getByLabelText("Remember Me")).toHaveAttribute("data-state", "checked");

        await userEvent.click(screen.getByRole("button", { name: "Login" }));

        scope.done();
    });

    it("should display error message on login failure", async () => {
        const username = "test_Username";
        const password = "Password";
        const errorMessage = "An error occurred during login";
        const setResetCode = vi.fn();

        const scope = nock("http://localhost")
            .post("/api/account/login", { username, password })
            .reply(400, { message: errorMessage });

        renderWithProviders(<LoginForm setResetCode={setResetCode} />);

        await userEvent.type(screen.getByLabelText("Username"), username);
        await userEvent.type(screen.getByLabelText("Password"), password);
        await userEvent.click(screen.getByRole("button", { name: "Login" }));

        expect(await screen.findByText(errorMessage)).toBeInTheDocument();

        scope.done();
    });
});
