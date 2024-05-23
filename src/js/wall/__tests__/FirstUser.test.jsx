import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import React from "react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../tests/setupTests";
import FirstUser from "../FirstUser";

describe("<FirstUser />", () => {
    it("creates first user once form is submitted", async () => {
        const usernameInput = "Username";
        const passwordInput = "Password";
        const scope = nock("http://localhost")
            .post("/api/users/first", {
                handle: usernameInput,
                password: passwordInput,
            })
            .reply(201, {
                handle: usernameInput,
                password: passwordInput,
            });

        renderWithProviders(<FirstUser />);

        const usernameField = screen.getByRole("textbox", /username/i);
        const passwordField = screen.getByRole("textbox", /password/i);

        expect(usernameField).toHaveValue("");
        expect(passwordField).toHaveValue("");

        await userEvent.type(usernameField, usernameInput);
        expect(usernameField).toHaveValue(usernameInput);

        await userEvent.type(passwordField, passwordInput);
        expect(passwordField).toHaveValue(passwordInput);

        await userEvent.click(screen.getByRole("button", { name: /Create User/i }));

        scope.isDone();
    });
});
