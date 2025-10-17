import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import nock from "nock";
import { afterEach, describe, expect, it, vi } from "vitest";
import LoginForm from "../LoginForm";

describe("<LoginForm />", () => {
    afterEach(() => nock.cleanAll());

    it("should call mutate() with correct values when submitted", async () => {
        const handle = "test_Username";
        const password = "Password";
        const setResetCode = vi.fn();

        const scope = nock("http://localhost")
            .post("/api/account/login", { handle, password, remember: true })
            .reply(200);

        renderWithProviders(<LoginForm setResetCode={setResetCode} />);

        const usernameField = screen.getByLabelText("Username");
        await userEvent.type(usernameField, handle);
        expect(usernameField).toHaveValue(handle);

        const passwordField = screen.getByLabelText("Password");
        await userEvent.type(passwordField, password);
        expect(passwordField).toHaveValue(password);

        expect(screen.getByLabelText("Remember Me")).toHaveAttribute(
            "data-state",
            "unchecked",
        );
        await userEvent.click(screen.getByLabelText("Remember Me"));
        expect(screen.getByLabelText("Remember Me")).toHaveAttribute(
            "data-state",
            "checked",
        );

        await userEvent.click(screen.getByRole("button", { name: "Login" }));

        scope.done();
    });

    it("should display error message on login failure", async () => {
        const handle = "test_Username";
        const password = "Password";
        const errorMessage = "An error occurred during login";
        const setResetCode = vi.fn();

        const scope = nock("http://localhost")
            .post("/api/account/login", { handle, password })
            .reply(400, { message: errorMessage });

        renderWithProviders(<LoginForm setResetCode={setResetCode} />);

        await userEvent.type(screen.getByLabelText("Username"), handle);
        await userEvent.type(screen.getByLabelText("Password"), password);
        await userEvent.click(screen.getByRole("button", { name: "Login" }));

        expect(await screen.findByText(errorMessage)).toBeInTheDocument();

        scope.done();
    });
});
