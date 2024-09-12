import { AdministratorRoles } from "@administration/types";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    createFakeAccount,
    createFakeApiKey,
    mockApiCreateAPIKey,
    mockApiGetAccount,
    mockApiGetAPIKeys,
} from "@tests/fake/account";
import { createFakePermissions } from "@tests/fake/permissions";
import { renderWithMemoryRouter, renderWithProviders } from "@tests/setupTests";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import APIKeys from "../APIKeys";

describe("<APIKeys />", () => {
    let apiKeys;

    beforeEach(() => {
        apiKeys = [createFakeApiKey()];
    });

    afterEach(() => nock.cleanAll());

    it("should render correctly when keys === null", () => {
        renderWithMemoryRouter(<APIKeys />);

        expect(screen.getByLabelText("loading")).toBeInTheDocument();
        expect(screen.queryByText("Manage API keys for accessing the")).not.toBeInTheDocument();
    });

    it("should render correctly when apiKey exists", async () => {
        mockApiGetAPIKeys(apiKeys);
        renderWithMemoryRouter(<APIKeys />);

        expect(await screen.findByText("Manage API keys for accessing the")).toBeInTheDocument();
        expect(screen.getByText("Virtool API")).toBeInTheDocument();
        expect(screen.getByText("Create")).toBeInTheDocument();
        expect(screen.getByText(apiKeys[0].name)).toBeInTheDocument();
    });

    it("should render correctly when no apiKeys exist", async () => {
        mockApiGetAPIKeys([]);
        renderWithMemoryRouter(<APIKeys />);

        expect(await screen.findByText("Manage API keys for accessing the")).toBeInTheDocument();
        expect(screen.getByText("Virtool API")).toBeInTheDocument();
        expect(screen.getByText("No API keys found.")).toBeInTheDocument();
    });

    describe("<CreateAPIKey />", () => {
        beforeEach(() => {
            mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
            mockApiGetAPIKeys(apiKeys);
        });

        it("should render correctly when newKey = empty", async () => {
            const { hook, history } = memoryLocation({ path: "/", record: true });
            renderWithProviders(
                <Router hook={hook}>
                    <APIKeys />
                </Router>
            );

            await userEvent.click(await screen.findByRole("link", { name: "Create" }));
            await new Promise(r => setTimeout(r, 1000));

            expect(await screen.findByText("Create API Key")).toBeInTheDocument();
            expect(screen.getByText("Name")).toBeInTheDocument();
            expect(screen.getByText("Permissions")).toBeInTheDocument();

            expect(await screen.findByText("cancel_job")).toBeInTheDocument();
            expect(screen.getByText("create_ref")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
        });

        it("should render correctly when newKey is set", async () => {
            const scope = mockApiCreateAPIKey("test", createFakePermissions({ remove_job: true }));
            renderWithMemoryRouter(<APIKeys />, [{ state: { createAPIKey: true } }]);

            expect(await screen.findByText("Create API Key")).toBeInTheDocument();
            await userEvent.type(screen.getByLabelText("Name"), "test");
            await userEvent.click(screen.getByText("remove_job"));
            await userEvent.click(screen.getByText("Save"));

            expect(await screen.findByText("Here is your key.")).toBeInTheDocument();
            expect(screen.getByText(/Make note of it now. For security purposes/)).toBeInTheDocument();
            expect(screen.getByDisplayValue("testKey")).toBeInTheDocument();
            expect(screen.queryByText("Copied")).not.toBeInTheDocument();

            scope.done();
        });

        it("should fail to submit and display errors when no name provided", async () => {
            renderWithMemoryRouter(<APIKeys />, [{ state: { createAPIKey: true } }]);

            expect(await screen.findByText("Create API Key")).toBeInTheDocument();
            await userEvent.click(screen.getByRole("button", { name: "Save" }));
            expect(screen.getByText("Provide a name for the key")).toBeInTheDocument();
        });

        describe("<APIKeyAdministratorInfo />", () => {
            it("should render correctly when newKey is empty and state.administratorRole = AdministratorRoles.FULL", async () => {
                mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
                renderWithMemoryRouter(<APIKeys />, [{ state: { createAPIKey: true } }]);

                expect(await screen.findByText(/You are an administrator/)).toBeInTheDocument();
                expect(
                    screen.getByText(/If your administrator role is reduced or removed, this API/)
                ).toBeInTheDocument();
            });

            it("should render correctly when newKey is empty and state.administratorRole = null", () => {
                mockApiGetAccount(createFakeAccount({ administrator_role: null }));
                renderWithMemoryRouter(<APIKeys />, [{ state: { createAPIKey: true } }]);

                expect(screen.queryByText(/You are an administrator/)).not.toBeInTheDocument();
                expect(
                    screen.queryByText(/If your administrator role is reduced or removed, this API/)
                ).not.toBeInTheDocument();
            });
        });
    });

    describe("<APIKey />", () => {
        beforeEach(() => {
            mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
            mockApiGetAPIKeys(apiKeys);
        });

        it("should render correctly when collapsed", async () => {
            renderWithMemoryRouter(<APIKeys />);

            expect(await screen.findByText(apiKeys[0].name)).toBeInTheDocument();
            expect(screen.getByText(/Created/)).toBeInTheDocument();
            expect(screen.getByText("2 permissions")).toBeInTheDocument();
        });

        it("should render correctly when expanded", async () => {
            renderWithMemoryRouter(<APIKeys />);

            expect(await screen.findByText(apiKeys[0].name)).toBeInTheDocument();
            await userEvent.click(screen.getByText(apiKeys[0].name));

            expect(screen.getByText(/Created/)).toBeInTheDocument();
            expect(screen.getByText("2 permissions")).toBeInTheDocument();

            expect(await screen.findByText("create_ref")).toBeInTheDocument();
            expect(screen.getByText("create_sample")).toBeInTheDocument();

            expect(screen.getByText("Delete")).toBeInTheDocument();
            expect(screen.getByText("Update")).toBeInTheDocument();
        });

        it("should collapse view when close button clicked", async () => {
            renderWithMemoryRouter(<APIKeys />);

            expect(await screen.findByText(apiKeys[0].name)).toBeInTheDocument();
            await userEvent.click(screen.getByText(apiKeys[0].name));

            expect(await screen.findByText("cancel_job")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();

            await userEvent.click(screen.getByRole("button", { name: "close" }));

            expect(screen.queryByText("cancel_job")).not.toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
        });
    });

    describe("<APIPermissions />", () => {
        beforeEach(() => {
            mockApiGetAPIKeys(apiKeys);
        });

        it("should render permissions correctly and check and uncheck permissions when clicked, administrator_role == full", async () => {
            mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
            renderWithMemoryRouter(<APIKeys />);

            expect(await screen.findByText(apiKeys[0].name)).toBeInTheDocument();
            await userEvent.click(screen.getByText(apiKeys[0].name));
            expect(await screen.findByText("cancel_job")).toBeInTheDocument();

            const create_ref = screen.getByRole("checkbox", { name: "create_ref" });
            const upload_file = screen.getByRole("checkbox", { name: "upload_file" });

            expect(create_ref).toBeChecked();
            expect(upload_file).not.toBeChecked();

            await userEvent.click(create_ref);
            await userEvent.click(upload_file);

            expect(create_ref).not.toBeChecked();
            expect(upload_file).toBeChecked();
        });

        it("should not check and uncheck permissions when administrator_role = base", async () => {
            mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.BASE }));
            renderWithMemoryRouter(<APIKeys />);

            expect(await screen.findByText(apiKeys[0].name)).toBeInTheDocument();
            await userEvent.click(screen.getByText(apiKeys[0].name));
            expect(await screen.findByText("cancel_job")).toBeInTheDocument();

            const cancel_job = screen.getByRole("checkbox", { name: "cancel_job" });
            const create_ref = screen.getByRole("checkbox", { name: "create_ref" });
            const upload_file = screen.getByRole("checkbox", { name: "upload_file" });

            expect(cancel_job).toBeChecked();
            expect(create_ref).toBeChecked();
            expect(upload_file).not.toBeChecked();

            await userEvent.click(cancel_job);
            await userEvent.click(create_ref);
            await userEvent.click(upload_file);

            expect(cancel_job).not.toBeChecked();
            expect(create_ref).not.toBeChecked();
            expect(upload_file).not.toBeChecked();
        });

        it("should not check and uncheck permissions when administrator_role = null", async () => {
            mockApiGetAccount(createFakeAccount({ administrator_role: null }));
            renderWithMemoryRouter(<APIKeys />);

            expect(await screen.findByText(apiKeys[0].name)).toBeInTheDocument();
            await userEvent.click(screen.getByText(apiKeys[0].name));
            expect(await screen.findByText("cancel_job")).toBeInTheDocument();

            const cancel_job = screen.getByRole("checkbox", { name: "cancel_job" });
            const upload_file = screen.getByRole("checkbox", { name: "upload_file" });

            expect(cancel_job).toBeChecked();
            expect(upload_file).not.toBeChecked();

            await userEvent.click(cancel_job);
            await userEvent.click(upload_file);

            expect(cancel_job).toBeChecked();
            expect(upload_file).not.toBeChecked();
        });
    });
});
