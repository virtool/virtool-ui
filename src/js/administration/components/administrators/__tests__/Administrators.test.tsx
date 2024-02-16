import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import React from "react";
import { createFakeAccount, mockAPIGetAccount } from "../../../../../tests/fake/account";
import { mockGetAdministratorRoles, mockSetAdministratorRoleAPI } from "../../../../../tests/fake/admin";
import { createFakeUser, createFakeUsers, mockApiFindUsers } from "../../../../../tests/fake/user";
import { renderWithProviders } from "../../../../../tests/setupTests";

import { AdministratorRoles } from "../../../types";
import { ManageAdministrators } from "../Administrators";

describe("<Administrators>", () => {
    it("should render", async () => {
        const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
        mockAPIGetAccount(account);

        const users = createFakeUsers(2);
        users[0].administrator_role = AdministratorRoles.FULL;
        users[1].administrator_role = AdministratorRoles.BASE;
        mockApiFindUsers(users);

        mockGetAdministratorRoles();

        renderWithProviders(<ManageAdministrators />);

        expect(await screen.findByRole("textbox", { name: "search" })).toBeInTheDocument();

        expect(screen.getByText(users[0].handle)).toBeInTheDocument();
        const user_1 = screen.getByText(users[0].handle).closest("div");
        expect(within(user_1).getByRole("button", { name: "Remove administrator role" })).toBeInTheDocument();
        expect(within(user_1).getByText(`${AdministratorRoles.FULL} Administrator`)).toBeInTheDocument();

        const user_2 = screen.getByText(users[1].handle).closest("div");
        expect(within(user_2).getByRole("button", { name: "Remove administrator role" })).toBeInTheDocument();
        expect(within(user_2).getByText(`${AdministratorRoles.BASE} Administrator`)).toBeInTheDocument();

        nock.cleanAll();
    });

    it("should change user role when dropdown is changed", async () => {
        const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
        mockAPIGetAccount(account);

        const user = createFakeUser({ administrator_role: AdministratorRoles.FULL });
        mockApiFindUsers([user]);

        mockGetAdministratorRoles();

        const set_role_scope = mockSetAdministratorRoleAPI({ user, new_role: AdministratorRoles.BASE });

        renderWithProviders(<ManageAdministrators />);

        await userEvent.click(await screen.findByRole("combobox"));
        await userEvent.click(await screen.findByRole("option", { name: `${AdministratorRoles.BASE} Administrator` }));

        await waitFor(() => set_role_scope.done());
        nock.cleanAll();
    });

    it("should remove admin role when trash icon clicked", async () => {
        const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
        mockAPIGetAccount(account);

        const user = createFakeUser({ administrator_role: AdministratorRoles.FULL });
        mockApiFindUsers([user]);

        mockGetAdministratorRoles();

        const set_role_scope = mockSetAdministratorRoleAPI({ user, new_role: null });

        renderWithProviders(<ManageAdministrators />);

        await userEvent.click(await screen.findByRole("button", { name: "Remove administrator role" }));

        set_role_scope.done();

        nock.cleanAll();
    });
});
