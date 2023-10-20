import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import React from "react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../../tests/setupTests";
import CreateUser from "../CreateUser";

describe("<CreateUser />", () => {
    it("creates user once form is submitted", async () => {
        const usernameInput = "Username";
        const passwordInput = "Password";
        const scope = nock("http://localhost")
            .post("/api/users", { handle: usernameInput, password: passwordInput, forceReset: false })
            .reply(201, {
                handle: usernameInput,
                password: passwordInput,
                forceReset: false,
            });
        renderWithProviders(<CreateUser />);

        await userEvent.click(screen.getByRole("button"));

        const usernameField = screen.getByLabelText("Username");
        await userEvent.type(usernameField, usernameInput);
        expect(usernameField).toHaveValue(usernameInput);

        const passwordField = screen.getByLabelText("Password");
        await userEvent.type(passwordField, passwordInput);
        expect(passwordField).toHaveValue(passwordInput);

        await userEvent.click(screen.getByRole("button", { name: "Save" }));
        scope.isDone();
    });

    it("should render correct username error message", async () => {
        renderWithProviders(<CreateUser />);
        await userEvent.click(screen.getByRole("button"));

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.getByText("Please specify a username.")).toBeInTheDocument();
    });
});
