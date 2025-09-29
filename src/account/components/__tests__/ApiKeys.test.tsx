import { AdministratorRoleName } from "@administration/types";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    createFakeAccount,
    createFakeApiKey,
    mockApiCreateApiKey,
    mockApiGetAccount,
    mockApiGetApiKeys,
} from "@tests/fake/account";
import { createFakePermissions } from "@tests/fake/permissions";
import { renderWithRouter } from "@tests/setup";
import nock from "nock";
import { describe, expect, it } from "vitest";
import ApiKeys from "../ApiKeys";

describe("<ApiKeys />", () => {
    const basePath = "/account/api";

    afterEach(() => nock.cleanAll());

    it("should render correctly when keys === null", () => {
        renderWithRouter(<ApiKeys />, basePath);

        expect(screen.getByLabelText("loading")).toBeInTheDocument();
        expect(
            screen.queryByText("Manage API keys for accessing the"),
        ).not.toBeInTheDocument();
    });

    it("should render and function when loaded", async () => {
        userEvent.setup();

        mockApiGetAccount(
            createFakeAccount({
                administrator_role: AdministratorRoleName.FULL,
            }),
        );
        mockApiGetApiKeys([]);

        const scope = mockApiCreateApiKey(
            "test",
            createFakePermissions({ remove_job: true }),
        );

        renderWithRouter(<ApiKeys />, "/account/api");

        await screen.findByRole("heading", {
            name: /Manage API keys for accessing the/,
        });

        expect(screen.getByText("No API keys found.")).toBeInTheDocument();

        await userEvent.click(screen.getByRole("link", { name: "Create" }));

        const dialog = screen.getByRole("dialog", { name: "Create API Key" });
        const input = within(dialog).getByLabelText("Name");

        // Check that submission without a name fails.
        await userEvent.click(screen.getByRole("button", { name: "Save" }));
        expect(
            await screen.findByText("Provide a name for the key"),
        ).toBeInTheDocument();

        await userEvent.type(input, "Key A");
        expect(input).toHaveValue("Key A");

        const checkbox = screen.getByRole("checkbox", {
            name: "remove_job",
        });
        await userEvent.click(checkbox);
        expect(checkbox).toBeChecked();

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        mockApiGetApiKeys([
            createFakeApiKey({
                name: "Key A",
                permissions: createFakePermissions({ remove_job: true }),
            }),
        ]);

        // Test that the secret key is displayed in the dialog after creation.
        expect(
            await screen.findByText("Here is your key."),
        ).toBeInTheDocument();
        expect(screen.getByText(/Make note of it now/)).toBeInTheDocument();
        expect(screen.getByDisplayValue("testKey")).toBeInTheDocument();

        await userEvent.keyboard("{Escape}");

        // Test that the new key is displayed in the list.
        expect(screen.getByText("Key A")).toBeInTheDocument();
        expect(screen.getByText(/Created/)).toBeInTheDocument();
        expect(screen.getByText("1 permission")).toBeInTheDocument();

        scope.done();
    });

    it("should show administrator notice when appropriate", async () => {
        mockApiGetAccount(
            createFakeAccount({
                administrator_role: AdministratorRoleName.FULL,
            }),
        );
        mockApiGetApiKeys([]);

        renderWithRouter(<ApiKeys />, basePath);

        await userEvent.click(
            await screen.findByRole("link", { name: "Create" }),
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

    it("should be able to edit keys", async () => {
        const key = createFakeApiKey();

        mockApiGetAccount(
            createFakeAccount({
                permissions: {
                    cancel_job: true,
                    create_ref: true,
                    create_sample: false,
                    modify_hmm: false,
                    modify_subtraction: false,
                    remove_file: false,
                    remove_job: false,
                    upload_file: true,
                },
            }),
        );
        mockApiGetApiKeys([key]);

        renderWithRouter(<ApiKeys />, "/account/api");

        await userEvent.click(
            await screen.findByRole("button", { name: "Edit" }),
        );

        const dialog = await screen.findByRole("dialog", {
            name: "Edit API Key",
        });

        const createRefCheckbox = await within(dialog).findByRole("checkbox", {
            name: "create_ref",
        });
        const uploadFileCheckbox = await within(dialog).findByRole("checkbox", {
            name: "upload_file",
        });

        expect(createRefCheckbox).toBeChecked();
        expect(uploadFileCheckbox).not.toBeChecked();

        await userEvent.click(createRefCheckbox);
        await userEvent.click(uploadFileCheckbox);

        screen.debug(dialog);

        expect(uploadFileCheckbox).toBeChecked();
    });
});
