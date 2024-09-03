import Settings from "@/administration/components/Settings";
import { AdministratorRoles } from "@administration/types";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import nock from "nock";
import React from "react";
import { describe, expect, it } from "vitest";
import { renderWithMemoryRouter } from "../../../../tests/setupTests";

describe("<CreateUser />", () => {
    it("creates user once form is submitted", async () => {
        const usernameInput = "Username";
        const passwordInput = "Password";
        const accountScope = mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));

        const scope = nock("http://localhost")
            .post("/api/users", { handle: usernameInput, password: passwordInput, forceReset: false })
            .reply(201, {
                handle: usernameInput,
                password: passwordInput,
                forceReset: false,
            });

        renderWithMemoryRouter(<Settings />, ["/users"]);
        await waitFor(() => accountScope.done());

        await userEvent.click(await screen.findByRole("button"));

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
        mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        renderWithMemoryRouter(<Settings />, ["/users"]);
        await userEvent.click(await screen.findByRole("button"));

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.getByText("Please specify a username")).toBeInTheDocument();
        expect(screen.getByText("Password does not meet minimum length requirement (8)")).toBeInTheDocument();
    });
});
