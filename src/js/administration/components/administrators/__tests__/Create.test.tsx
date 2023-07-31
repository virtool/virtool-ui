import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import React from "react";
import { createFakeAccount, mockGetAccountAPI } from "../../../../../tests/fake/account";
import { mockGetAdministratorRoles, mockSetAdministratorRoleAPI } from "../../../../../tests/fake/admin";
import { createFakeUsers, mockApiGetUsers } from "../../../../../tests/fake/user";
import { renderWithProviders } from "../../../../../tests/setupTests";
import { AdministratorRoles } from "../../../types";
import { CreateAdministrator } from "../Create";

describe("<CreateAdministrator>", () => {
    it("should render form", async () => {
        const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
        mockGetAccountAPI(account);

        const users = createFakeUsers(2);
        mockApiGetUsers(users);

        mockGetAdministratorRoles();

        renderWithProviders(<CreateAdministrator />);

        await userEvent.click(await screen.findByRole("button"));

        expect(await screen.findByText("Grant Administrator Privileges")).toBeInTheDocument();

        expect(await screen.getByRole("button", { name: "User" })).toBeInTheDocument();
        expect(screen.getByText("Select user")).toBeInTheDocument();

        expect(screen.getByRole("combobox", { name: "Role" })).toBeInTheDocument();
        expect(screen.getByText("Select administrator role")).toBeInTheDocument();

        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();

        await nock.cleanAll();
    });

    it("should promote admin when correct", async () => {
        const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
        mockGetAccountAPI(account);

        const users = createFakeUsers(2);

        mockApiGetUsers(users);

        mockGetAdministratorRoles();

        const set_role_scope = mockSetAdministratorRoleAPI({ user: users[0], new_role: AdministratorRoles.FULL });

        renderWithProviders(<CreateAdministrator />);

        await userEvent.click(await screen.findByRole("button", { name: "create" }));

        //Check user dropdown
        await userEvent.click(await screen.findByRole("option", { name: users[0].handle }));
        const userTrigger = screen.getByRole("button", { name: "User" });
        expect(within(userTrigger).getByText(users[0].handle)).toBeInTheDocument();

        //Check role dropdown
        await userEvent.click(screen.getByRole("combobox", { name: "Role" }));
        await userEvent.click(screen.getByRole("option", { name: `${AdministratorRoles.FULL} Administrator` }));
        const roleTrigger = screen.getByRole("combobox", { name: "Role" });
        expect(within(roleTrigger).getByText(`${AdministratorRoles.FULL} Administrator`)).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: "Save" }));
        set_role_scope.done();

        await nock.cleanAll();
    });

    it("should filter users", async () => {
        const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
        mockGetAccountAPI(account);

        const users = createFakeUsers(2);

        mockApiGetUsers(users);

        mockGetAdministratorRoles();

        renderWithProviders(<CreateAdministrator />);

        await userEvent.click(await screen.findByRole("button", { name: "create" }));

        expect(await screen.findByRole("option", { name: users[0].handle })).toBeInTheDocument();
        expect(await screen.findByRole("option", { name: users[1].handle })).toBeInTheDocument();

        const get_users_scope = mockApiGetUsers([users[0]], {
            page: 1,
            per_page: 25,
            term: users[0].handle,
            administrator: false,
        });
        await userEvent.type(screen.getByRole("textbox"), users[0].handle);

        expect(await screen.findByRole("option", { name: users[0].handle })).toBeInTheDocument();
        await waitFor(() => expect(screen.queryByRole("option", { name: users[1].handle })).not.toBeInTheDocument());

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        findUsersScope.done();
        await nock.cleanAll();
    });
});
