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
import { renderWithRouter } from "@tests/setup";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import APIKeys from "../APIKeys";
import { formatPath } from "@utils/hooks";

describe("<APIKeys />", () => {
    let apiKeys;
    let basePath;

    beforeEach(() => {
        apiKeys = [createFakeApiKey()];
        basePath = "/account/api";
    });

    afterEach(() => nock.cleanAll());

    it("should render correctly when keys === null", () => {
        renderWithRouter(<APIKeys />, basePath);

        expect(screen.getByLabelText("loading")).toBeInTheDocument();
        expect(
            screen.queryByText("Manage API keys for accessing the"),
        ).not.toBeInTheDocument();
    });

    it("should render correctly when apiKey exists", async () => {
        mockApiGetAPIKeys(apiKeys);
        renderWithRouter(<APIKeys />, basePath);

        expect(
            await screen.findByText("Manage API keys for accessing the"),
        ).toBeInTheDocument();
        expect(screen.getByText("Virtool API")).toBeInTheDocument();
        expect(screen.getByText("Create")).toBeInTheDocument();
        expect(screen.getByText(apiKeys[0].name)).toBeInTheDocument();
    });

    it("should render correctly when no apiKeys exist", async () => {
        mockApiGetAPIKeys([]);
        renderWithRouter(<APIKeys />, basePath);

        expect(
            await screen.findByText("Manage API keys for accessing the"),
        ).toBeInTheDocument();
        expect(screen.getByText("Virtool API")).toBeInTheDocument();
        expect(screen.getByText("No API keys found.")).toBeInTheDocument();
    });

    describe("<CreateAPIKey />", () => {
        let basePath;
        let searchParams;
        beforeEach(() => {
            mockApiGetAccount(
                createFakeAccount({
                    administrator_role: AdministratorRoles.FULL,
                }),
            );
            mockApiGetAPIKeys(apiKeys);
            basePath = "/account/api";
            searchParams = { openCreateKey: true };
        });

        it("should render correctly when newKey = empty", async () => {
            renderWithRouter(<APIKeys />, basePath);

            await userEvent.click(
                await screen.findByRole("link", { name: "Create" }),
            );

            expect(
                await screen.findByText("Create API Key"),
            ).toBeInTheDocument();
            expect(screen.getByText("Name")).toBeInTheDocument();
            expect(screen.getByText("Permissions")).toBeInTheDocument();

            expect(await screen.findByText("cancel_job")).toBeInTheDocument();
            expect(screen.getByText("create_ref")).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "Save" }),
            ).toBeInTheDocument();
        });

        it("should render correctly when newKey is set", async () => {
            const scope = mockApiCreateAPIKey(
                "test",
                createFakePermissions({ remove_job: true }),
            );
            renderWithRouter(<APIKeys />, formatPath(basePath, searchParams));

            expect(
                await screen.findByText("Create API Key"),
            ).toBeInTheDocument();
            await userEvent.type(screen.getByLabelText("Name"), "test");
            await userEvent.click(screen.getByText("remove_job"));
            await userEvent.click(screen.getByText("Save"));

            expect(
                await screen.findByText("Here is your key."),
            ).toBeInTheDocument();
            expect(
                screen.getByText(/Make note of it now. For security purposes/),
            ).toBeInTheDocument();
            expect(screen.getByDisplayValue("testKey")).toBeInTheDocument();
            expect(screen.queryByText("Copied")).not.toBeInTheDocument();

            scope.done();
        });

        it("should fail to submit and display errors when no name provided", async () => {
            renderWithRouter(<APIKeys />, formatPath(basePath, searchParams));

            expect(
                await screen.findByText("Create API Key"),
            ).toBeInTheDocument();
            await userEvent.click(screen.getByRole("button", { name: "Save" }));
            expect(
                screen.getByText("Provide a name for the key"),
            ).toBeInTheDocument();
        });

        describe("<APIKeyAdministratorInfo />", () => {
            it("should render correctly when newKey is empty and state.administratorRole = AdministratorRoles.FULL", async () => {
                mockApiGetAccount(
                    createFakeAccount({
                        administrator_role: AdministratorRoles.FULL,
                    }),
                );
                renderWithRouter(
                    <APIKeys />,
                    formatPath(basePath, searchParams),
                );

                expect(
                    await screen.findByText(/You are an administrator/),
                ).toBeInTheDocument();
                expect(
                    screen.getByText(
                        /If your administrator role is reduced or removed, this API/,
                    ),
                ).toBeInTheDocument();
            });

            it("should render correctly when newKey is empty and state.administratorRole = null", () => {
                mockApiGetAccount(
                    createFakeAccount({ administrator_role: null }),
                );
                renderWithRouter(
                    <APIKeys />,
                    formatPath(basePath, searchParams),
                );

                expect(
                    screen.queryByText(/You are an administrator/),
                ).not.toBeInTheDocument();
                expect(
                    screen.queryByText(
                        /If your administrator role is reduced or removed, this API/,
                    ),
                ).not.toBeInTheDocument();
            });
        });
    });

    describe("<APIKey />", () => {
        let basePath;
        beforeEach(() => {
            mockApiGetAccount(
                createFakeAccount({
                    administrator_role: AdministratorRoles.FULL,
                }),
            );
            mockApiGetAPIKeys(apiKeys);
            basePath = "/account/api";
        });

        it("should render correctly when collapsed", async () => {
            renderWithRouter(<APIKeys />, basePath);

            expect(
                await screen.findByText(apiKeys[0].name),
            ).toBeInTheDocument();
            expect(screen.getByText(/Created/)).toBeInTheDocument();
            expect(screen.getByText("2 permissions")).toBeInTheDocument();
        });

        it("should render correctly when expanded", async () => {
            renderWithRouter(<APIKeys />, basePath);

            expect(
                await screen.findByText(apiKeys[0].name),
            ).toBeInTheDocument();
            await userEvent.click(screen.getByText(apiKeys[0].name));

            expect(screen.getByText(/Created/)).toBeInTheDocument();
            expect(screen.getByText("2 permissions")).toBeInTheDocument();

            expect(await screen.findByText("create_ref")).toBeInTheDocument();
            expect(screen.getByText("create_sample")).toBeInTheDocument();

            expect(screen.getByText("Delete")).toBeInTheDocument();
            expect(screen.getByText("Update")).toBeInTheDocument();
        });

        it("should collapse view when close button clicked", async () => {
            renderWithRouter(<APIKeys />, basePath);

            expect(
                await screen.findByText(apiKeys[0].name),
            ).toBeInTheDocument();
            await userEvent.click(screen.getByText(apiKeys[0].name));

            expect(await screen.findByText("cancel_job")).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "Delete" }),
            ).toBeInTheDocument();

            await userEvent.click(
                screen.getByRole("button", { name: "close" }),
            );

            expect(screen.queryByText("cancel_job")).not.toBeInTheDocument();
            expect(
                screen.queryByRole("button", { name: "Delete" }),
            ).not.toBeInTheDocument();
        });
    });

    describe("<APIPermissions />", () => {
        let basePath;
        beforeEach(() => {
            mockApiGetAPIKeys(apiKeys);
            basePath = "/account/api";
        });

        it("should render permissions correctly and check and uncheck permissions when clicked, administrator_role == full", async () => {
            mockApiGetAccount(
                createFakeAccount({
                    administrator_role: AdministratorRoles.FULL,
                }),
            );
            renderWithRouter(<APIKeys />, basePath);

            expect(
                await screen.findByText(apiKeys[0].name),
            ).toBeInTheDocument();
            await userEvent.click(screen.getByText(apiKeys[0].name));
            expect(await screen.findByText("cancel_job")).toBeInTheDocument();

            const create_ref = screen.getByRole("checkbox", {
                name: "create_ref",
            });
            const upload_file = screen.getByRole("checkbox", {
                name: "upload_file",
            });

            expect(create_ref).toBeChecked();
            expect(upload_file).not.toBeChecked();

            await userEvent.click(create_ref);
            await userEvent.click(upload_file);

            expect(create_ref).not.toBeChecked();
            expect(upload_file).toBeChecked();
        });

        it("should not check and uncheck permissions when administrator_role = base", async () => {
            mockApiGetAccount(
                createFakeAccount({
                    administrator_role: AdministratorRoles.BASE,
                }),
            );
            renderWithRouter(<APIKeys />, basePath);

            expect(
                await screen.findByText(apiKeys[0].name),
            ).toBeInTheDocument();
            await userEvent.click(screen.getByText(apiKeys[0].name));
            expect(await screen.findByText("cancel_job")).toBeInTheDocument();

            const cancel_job = screen.getByRole("checkbox", {
                name: "cancel_job",
            });
            const create_ref = screen.getByRole("checkbox", {
                name: "create_ref",
            });
            const upload_file = screen.getByRole("checkbox", {
                name: "upload_file",
            });

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
            renderWithRouter(<APIKeys />, basePath);

            expect(
                await screen.findByText(apiKeys[0].name),
            ).toBeInTheDocument();
            await userEvent.click(screen.getByText(apiKeys[0].name));
            expect(await screen.findByText("cancel_job")).toBeInTheDocument();

            const cancel_job = screen.getByRole("checkbox", {
                name: "cancel_job",
            });
            const upload_file = screen.getByRole("checkbox", {
                name: "upload_file",
            });

            expect(cancel_job).toBeChecked();
            expect(upload_file).not.toBeChecked();

            await userEvent.click(cancel_job);
            await userEvent.click(upload_file);

            expect(cancel_job).toBeChecked();
            expect(upload_file).not.toBeChecked();
        });
    });
});
