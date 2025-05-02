import { AdministratorRoles } from "@administration/types";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { renderWithProviders } from "@tests/setup";
import React from "react";
import { describe, expect, it } from "vitest";
import AccountProfile from "../AccountProfile";

describe("<AccountProfile />", () => {
    it("should render when administrator", async () => {
        const account = createFakeAccount({
            administrator_role: AdministratorRoles.FULL,
        });

        mockApiGetAccount(account);
        renderWithProviders(<AccountProfile />);

        expect(await screen.findByText(account.handle)).toBeInTheDocument();
        expect(screen.getByText("full Administrator")).toBeInTheDocument();
    });

    it("should render when not administrator", async () => {
        const account = createFakeAccount({ administrator_role: null });

        mockApiGetAccount(account);
        renderWithProviders(<AccountProfile />);

        expect(await screen.findByText(account.handle)).toBeInTheDocument();
    });

    it("should render with initial email", async () => {
        const account = createFakeAccount({
            administrator_role: AdministratorRoles.FULL,
            email: "virtool.devs@gmail.com",
        });

        mockApiGetAccount(account);
        renderWithProviders(<AccountProfile />);

        expect(await screen.findByText("Email Address")).toBeInTheDocument();

        expect(screen.getByLabelText("Email Address")).toHaveValue(
            "virtool.devs@gmail.com",
        );
    });

    it("should handle email changes", async () => {
        const account = createFakeAccount({
            administrator_role: AdministratorRoles.FULL,
        });

        mockApiGetAccount(account);
        renderWithProviders(<AccountProfile />);

        await screen.findByText("Email Address");
        const input = screen.getByLabelText("Email Address");
        expect(input).toHaveValue("");

        const button = screen.getAllByRole("button", { name: "Change" })[1];

        await userEvent.type(input, "invalid");
        await userEvent.click(button);

        expect(input).toHaveValue("invalid");
        expect(
            screen.getByText("Please provide a valid email address"),
        ).toBeInTheDocument();

        await userEvent.clear(input);
        await userEvent.type(input, "virtool.devs@gmail.com");
        await userEvent.click(button);
    });

    it("should handle password changes", async () => {
        const account = createFakeAccount({
            administrator_role: AdministratorRoles.FULL,
        });
        mockApiGetAccount(account);
        renderWithProviders(<AccountProfile />);

        expect(await screen.findByText("Password")).toBeInTheDocument();

        const button = screen.getAllByRole("button", { name: "Change" })[0];

        const oldPasswordInput = screen.getByLabelText("Old Password");
        const newPasswordInput = screen.getByLabelText("New Password");

        // Try without providing old password.
        await userEvent.type(newPasswordInput, "long_enough_password");
        await userEvent.click(button);

        expect(
            screen.getByText("Please provide your old password"),
        ).toBeInTheDocument();

        await userEvent.clear(newPasswordInput);
        await userEvent.type(oldPasswordInput, "expected_password");
        await userEvent.type(newPasswordInput, "short");

        expect(screen.getByLabelText("New Password")).toHaveValue("short");

        await userEvent.click(button);

        expect(
            screen.getByText(
                "Password does not meet minimum length requirement (8)",
            ),
        ).toBeInTheDocument();
    });
});
