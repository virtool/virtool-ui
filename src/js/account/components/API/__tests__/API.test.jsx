import { AdministratorRoles } from "@administration/types";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { connectRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import React from "react";
import { combineReducers } from "redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { attachResizeObserver, createGenericReducer, renderWithRouter } from "../../../../../tests/setupTests";
import { APIKeys } from "../API";
function createReducer(state, history) {
    return combineReducers({
        account: createGenericReducer(state.account),
        router: connectRouter(history),
    });
}

describe("<API />", () => {
    let props;
    let state;
    let history;

    beforeEach(() => {
        attachResizeObserver();
        props = {
            keys: [
                {
                    id: "1234",
                    name: "testName1",
                    created_at: "2022-12-22T21:37:49.429000Z",
                    permissions: { cancel_job: true, create_ref: true, upload_file: false },
                },
            ],
            onGet: vi.fn(),
        };
        state = {
            account: {
                permissions: {
                    cancel_job: true,
                    create_ref: true,
                    upload_file: false,
                },
                newKey: null,
                administrator_role: null,
            },
        };

        history = createBrowserHistory();
        history.location.state = {
            createAPIKey: false,
        };
    });

    it("should render correctly when keys === null", () => {
        props.keys = null;

        renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

        expect(screen.getByLabelText("loading")).toBeInTheDocument();
        expect(screen.queryByText("Manage API keys for accessing the")).not.toBeInTheDocument();
    });

    it("should render correctly when apiKey exists", () => {
        renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

        expect(screen.getByText("Manage API keys for accessing the")).toBeInTheDocument();
        expect(screen.getByText("Virtool API")).toBeInTheDocument();
        expect(screen.getByText("Create")).toBeInTheDocument();

        expect(screen.getByText("testName1")).toBeInTheDocument();
    });

    it("should render correctly when no apiKeys exist", () => {
        props.keys = [];

        renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

        expect(screen.getByText("Manage API keys for accessing the")).toBeInTheDocument();
        expect(screen.getByText("Virtool API")).toBeInTheDocument();
        expect(screen.getByText("No API keys found.")).toBeInTheDocument();

        expect(screen.queryByText("testName1")).not.toBeInTheDocument();
    });

    describe("<CreateAPIKey", () => {
        beforeEach(() => {
            history.location.state = {
                createAPIKey: true,
            };
        });
        it("should render correctly when newKey = empty", async () => {
            renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

            await userEvent.click(screen.getByText("Create"));

            expect(screen.getByText("Create API Key")).toBeInTheDocument();

            expect(screen.getByText("Name")).toBeInTheDocument();
            expect(screen.getByText("Permissions")).toBeInTheDocument();
            expect(screen.getByText("cancel_job")).toBeInTheDocument();
            expect(screen.getByText("create_ref")).toBeInTheDocument();

            expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
        });

        it("should render correctly when newKey is set", async () => {
            state.account.newKey = "123abc";

            renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

            expect(screen.getByText("Here is your key.")).toBeInTheDocument();
            expect(screen.getByText(/Make note of it now. For security purposes/)).toBeInTheDocument();

            expect(screen.getByDisplayValue("123abc")).toBeInTheDocument();
            expect(screen.queryByText("Copied")).not.toBeInTheDocument();
        });

        it("should fail to submit and display errors when no name provided", async () => {
            renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

            await userEvent.click(screen.getByText("Create"));

            expect(screen.queryByText("Provide a name for the key")).not.toBeInTheDocument();

            await userEvent.click(screen.getByRole("button", { name: "Save" }));

            expect(screen.getByText("Provide a name for the key")).toBeInTheDocument();
        });

        describe("APIKeyAdministratorInfo", () => {
            it("should render correctly when newKey is empty and state.administratorRole = AdministratorRoles.FULL", () => {
                state.account.administrator_role = AdministratorRoles.FULL;

                renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

                expect(screen.getByText(/You are an administrator/)).toBeInTheDocument();
                expect(
                    screen.getByText(/If your administrator role is reduced or removed, this API/),
                ).toBeInTheDocument();
            });

            it("should render correctly when newKey is empty and state.administratorRole = null", () => {
                renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

                expect(screen.queryByText(/You are an administrator/)).not.toBeInTheDocument();
                expect(
                    screen.queryByText(/If your administrator role is reduced or removed, this API/),
                ).not.toBeInTheDocument();
            });
        });
    });

    describe("APIKey", () => {
        it("should render correctly when collapsed", () => {
            renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

            expect(screen.getByText("testName1")).toBeInTheDocument();
            expect(screen.getByText(/Created/)).toBeInTheDocument();
            expect(screen.getByText("2 permissions")).toBeInTheDocument();
        });

        it("should render correctly when expanded", async () => {
            renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

            await userEvent.click(screen.getByText("testName1"));

            expect(screen.getByText("testName1")).toBeInTheDocument();
            expect(screen.getByText(/Created/)).toBeInTheDocument();
            expect(screen.getByText("2 permissions")).toBeInTheDocument();

            expect(screen.getByText("cancel_job")).toBeInTheDocument();
            expect(screen.getByText("upload_file")).toBeInTheDocument();

            expect(screen.getByText("Remove")).toBeInTheDocument();
            expect(screen.getByText("Update")).toBeInTheDocument();
        });

        it("should collapse view when close button clicked", async () => {
            renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

            await userEvent.click(screen.getByText("testName1"));

            expect(screen.getByText("cancel_job")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();

            await userEvent.click(screen.getByRole("button", { name: "close" }));

            expect(screen.queryByText("cancel_job")).not.toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "Remove" })).not.toBeInTheDocument();
        });
    });

    describe("APIPermissions", () => {
        it("should render permissions correctly and check and uncheck permissions when clicked, administrator_role == full", async () => {
            state.account.administrator_role = AdministratorRoles.FULL;

            renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

            await userEvent.click(screen.getByText("testName1"));

            expect(screen.getByText("cancel_job")).toBeInTheDocument();
            expect(screen.getByText("create_ref")).toBeInTheDocument();

            const cancel_job = screen.getAllByRole("checkbox", { name: "checkbox" })[0];
            const upload_file = screen.getAllByRole("checkbox", { name: "checkbox" })[2];

            expect(cancel_job).toBeChecked();
            expect(upload_file).not.toBeChecked();

            await userEvent.click(cancel_job);
            await userEvent.click(upload_file);

            expect(cancel_job).not.toBeChecked();
            expect(upload_file).toBeChecked();
        });

        it("should not check and uncheck permissions when administrator_role = base", async () => {
            state.account.administrator_role = AdministratorRoles.BASE;

            renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

            await userEvent.click(screen.getByText("testName1"));

            const cancel_job = screen.getAllByRole("checkbox", { name: "checkbox" })[0];
            const create_ref = screen.getAllByRole("checkbox", { name: "checkbox" })[1];
            const upload_file = screen.getAllByRole("checkbox", { name: "checkbox" })[2];

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
            renderWithRouter(<APIKeys {...props} />, state, history, createReducer);

            await userEvent.click(screen.getByText("testName1"));

            const cancel_job = screen.getAllByRole("checkbox", { name: "checkbox" })[0];
            const upload_file = screen.getAllByRole("checkbox", { name: "checkbox" })[2];

            expect(cancel_job).toBeChecked();
            expect(upload_file).not.toBeChecked();

            await userEvent.click(cancel_job);
            await userEvent.click(upload_file);

            expect(cancel_job).not.toBeChecked();
            expect(upload_file).not.toBeChecked();
        });
    });
});
