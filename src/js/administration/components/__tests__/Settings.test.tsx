import { screen, waitFor } from "@testing-library/react";
import { createFakeAccount } from "@tests/fake/account";
import { renderWithMemoryRouter } from "@tests/setup";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeSettings, mockApiGetSettings } from "../../../../tests/fake/admin";
import { createFakeMessage, mockApiGetMessage } from "../../../../tests/fake/message";
import { AdministratorRoles } from "../../types";
import Settings from "../Settings";

describe("<Settings />", () => {
    let account;
    let scope;

    beforeEach(() => {
        account = createFakeAccount();
        mockApiGetMessage(createFakeMessage());
        mockApiGetSettings(createFakeSettings());
    });

    it("should render", async () => {
        account.administrator_role = AdministratorRoles.FULL;
        scope = nock("http://localhost").get("/api/account").reply(200, account);
        renderWithMemoryRouter(<Settings />, [{ pathname: "/administration/settings" }]);

        await waitFor(() => expect(screen.getByText("Instance Message")).toBeInTheDocument());
        expect(screen.getByText("Settings")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Message" })).toBeInTheDocument();

        expect(screen.getByText("JSON API")).toBeInTheDocument();

        scope.done();
    });

    it("should render all options for full administrators", async () => {
        account.administrator_role = AdministratorRoles.FULL;
        scope = nock("http://localhost").get("/api/account").reply(200, account);
        renderWithMemoryRouter(<Settings />, [{ pathname: "/administration/settings" }]);

        await waitFor(() => expect(screen.getByText("Users")).toBeInTheDocument());
        expect(screen.getByText("Settings")).toBeInTheDocument();
        expect(screen.getByText("Administrators")).toBeInTheDocument();
        expect(screen.getByText("Groups")).toBeInTheDocument();

        scope.done();
    });

    it("should render only groups and users for users administrators", async () => {
        account.administrator_role = AdministratorRoles.USERS;
        scope = nock("http://localhost").get("/api/account").reply(200, account);
        renderWithMemoryRouter(<Settings />, [{ pathname: "/administration/settings" }]);

        await waitFor(() => expect(screen.getByText("Users")).toBeInTheDocument());
        expect(screen.queryByText("Settings")).not.toBeInTheDocument();
        expect(screen.queryByText("Administrators")).not.toBeInTheDocument();
        expect(screen.getByText("Groups")).toBeInTheDocument();

        scope.done();
    });
});
