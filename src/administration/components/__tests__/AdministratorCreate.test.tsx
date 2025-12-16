import AdministratorCreate from "@administration/components/AdministratorCreate";
import { AdministratorRoleName } from "@administration/types";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import {
    mockGetAdministratorRoles,
    mockSetAdministratorRoleAPI,
} from "@tests/fake/administrator";
import { createFakeUsers, mockApiFindUsers } from "@tests/fake/user";
import { renderWithProviders } from "@tests/setup";
import nock from "nock";
import { describe, expect, it } from "vitest";

describe("<AdministratorCreate>", () => {
    it("should render form", async () => {
        const account = createFakeAccount({
            administrator_role: AdministratorRoleName.FULL,
        });
        mockApiGetAccount(account);

        const users = createFakeUsers(2);
        mockApiFindUsers(users);

        mockGetAdministratorRoles();

        renderWithProviders(<AdministratorCreate />);

        await userEvent.click(await screen.findByRole("button"));

        expect(
            await screen.findByText("Grant Administrator Privileges"),
        ).toBeInTheDocument();

        expect(
            await screen.getByRole("button", { name: "User" }),
        ).toBeInTheDocument();
        expect(screen.getByText("Select user")).toBeInTheDocument();

        expect(
            screen.getByRole("combobox", { name: "Role" }),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Select administrator role"),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Save" }),
        ).toBeInTheDocument();

        await nock.cleanAll();
    });

    it("should promote admin when correct", async () => {
        const account = createFakeAccount({
            administrator_role: AdministratorRoleName.FULL,
        });
        mockApiGetAccount(account);

        const users = createFakeUsers(2);

        mockApiFindUsers(users);
        mockGetAdministratorRoles();

        const set_role_scope = mockSetAdministratorRoleAPI({
            user: users[0],
            new_role: AdministratorRoleName.FULL,
        });

        renderWithProviders(<AdministratorCreate />);

        await userEvent.click(
            await screen.findByRole("button", { name: "Create" }),
        );

        //Check user dropdown
        await userEvent.click(screen.getByRole("button", { name: "User" }));
        await userEvent.click(
            await screen.findByRole("option", { name: users[0].handle }),
        );
        const userTrigger = screen.getByRole("button", { name: "User" });
        expect(
            within(userTrigger).getByText(users[0].handle),
        ).toBeInTheDocument();

        //Check role dropdown
        await userEvent.click(screen.getByRole("combobox", { name: "Role" }));
        await userEvent.click(
            screen.getByRole("option", {
                name: `${AdministratorRoleName.FULL} Administrator`,
            }),
        );
        const roleTrigger = screen.getByRole("combobox", { name: "Role" });
        expect(
            within(roleTrigger).getByText(
                `${AdministratorRoleName.FULL} Administrator`,
            ),
        ).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: "Save" }));
        set_role_scope.done();

        await nock.cleanAll();
    });

    it("should filter users", async () => {
        const account = createFakeAccount({
            administrator_role: AdministratorRoleName.FULL,
        });
        mockApiGetAccount(account);

        const users = createFakeUsers(2);

        mockApiFindUsers(users);

        mockGetAdministratorRoles();

        renderWithProviders(<AdministratorCreate />);

        await userEvent.click(
            await screen.findByRole("button", { name: "Create" }),
        );

        await userEvent.click(screen.getByRole("button", { name: "User" }));

        expect(
            await screen.findByRole("option", { name: users[0].handle }),
        ).toBeInTheDocument();
        expect(
            await screen.findByRole("option", { name: users[1].handle }),
        ).toBeInTheDocument();

        const findUsersScope = mockApiFindUsers([users[0]], {
            page: 1,
            per_page: 25,
            term: users[0].handle,
            administrator: false,
        });
        await userEvent.type(screen.getByRole("textbox"), users[0].handle);

        expect(
            await screen.findByRole("option", { name: users[0].handle }),
        ).toBeInTheDocument();
        await waitFor(() =>
            expect(
                screen.queryByRole("option", { name: users[1].handle }),
            ).not.toBeInTheDocument(),
        );

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        findUsersScope.done();
        await nock.cleanAll();
    });
});
