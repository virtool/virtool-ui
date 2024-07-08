import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import React from "react";
import { useDispatch } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../tests/setupTests";
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

        const scope = nock("http://localhost")
            .post("/api/login", { username: username, password: password, remember: true })
            .reply(200);

        renderWithProviders(<LoginForm />);

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

        scope.isDone();
    });

    it("should display error message on login failure", async () => {
        const username = "test_Username";
        const password = "Password";
        const errorMessage = "An error occurred during login";

        const scope = nock("http://localhost")
            .post("/api/login", { username: username, password: password, remember: false })
            .reply(400);

        renderWithProviders(<LoginForm />);

        await userEvent.type(screen.getByLabelText("Username"), username);
        await userEvent.type(screen.getByLabelText("Password"), password);
        await userEvent.click(screen.getByRole("button", { name: "Login" }));

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });

        scope.isDone();
    });
});
