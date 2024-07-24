import { configureStore } from "@reduxjs/toolkit";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeAccount, mockAPIGetAccount } from "../../../../tests/fake/account";
import { createFakeFile, mockApiListFiles } from "../../../../tests/fake/files";
import { renderWithProviders } from "../../../../tests/setupTests";
import { AdministratorRoles } from "../../../administration/types";
import { UPLOAD } from "../../../app/actionTypes";
import { FileManager } from "../Manager";

function createAppStore(state) {
    return () =>
        configureStore({
            reducer: state => state,
            preloadedState: state,
        });
}

describe("<FileManager>", () => {
    let props;
    let state;
    beforeEach(() => {
        props = {
            found_count: 6,
            page: 1,
            page_count: 1,
            total_count: 1,
            items: [1],
            fileType: "test_file_type",
            message: "",
            tip: "",
            validationRegex: "",
            onLoadNextPage: vi.fn(),
        };
        state = { account: { administrator_role: AdministratorRoles.FULL, permissions: { upload_file: false } } };
    });

    it("should render", async () => {
        const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
        mockAPIGetAccount(account);

        const file = createFakeFile({ name: "subtraction.fq.gz" });
        mockApiListFiles([file], true);

        renderWithProviders(
            <MemoryRouter initialEntries={[{ pathname: "/samples/files", search: "?page=1" }]}>
                <FileManager {...props} />
            </MemoryRouter>,

            createAppStore(state)
        );
        expect(await screen.findByText("Drag file here to upload.")).toBeInTheDocument();
        expect(screen.getByText("subtraction.fq.gz")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Browse Files" })).toBeInTheDocument();
    });

    it("should remove upload bar if canUpload is false", async () => {
        state.account.administrator_role = null;

        const account = createFakeAccount({ administrator_role: null });
        mockAPIGetAccount(account);

        const file = createFakeFile({ name: "subtraction.fq.gz" });
        mockApiListFiles([file], true);

        renderWithProviders(
            <MemoryRouter initialEntries={[{ pathname: "/samples/files", search: "?page=1" }]}>
                <FileManager {...props} />
            </MemoryRouter>,

            createAppStore(state)
        );
        expect(await screen.findByText("You do not have permission to upload files.")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Upload" })).not.toBeInTheDocument();
    });

    it("should change message if passed", async () => {
        const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
        mockAPIGetAccount(account);

        const file = createFakeFile({ name: "subtraction.fq.gz" });
        mockApiListFiles([file], true);
        props.message = "test_message";
        renderWithProviders(
            <MemoryRouter initialEntries={[{ pathname: "/samples/files", search: "?page=1" }]}>
                <FileManager {...props} />
            </MemoryRouter>,

            createAppStore(state)
        );
        expect(await screen.findByText("test_message")).toBeInTheDocument();
    });

    it("should filter files according to passed regex", async () => {
        const account = createFakeAccount({ administrator_role: null, permissions: { upload_file: true } });
        mockAPIGetAccount(account);

        const file = createFakeFile({ name: "subtraction.fq.gz" });
        mockApiListFiles([file], true);

        props.validationRegex = /.(?:fa|fasta)(?:.gz|.gzip)?$/;
        const mockUpload = vi.fn();
        function reducer(state, action) {
            if (action.type === UPLOAD.REQUESTED) {
                mockUpload(action.payload.fileType, action.payload.file);
            }
            return state;
        }
        renderWithProviders(
            <MemoryRouter initialEntries={[{ pathname: "/samples/files", search: "?page=1" }]}>
                <FileManager {...props} />
            </MemoryRouter>,

            () =>
                configureStore({
                    reducer: reducer,
                    preloadedState: state,
                })
        );
        const invalidFile = new File(["test"], "test_invalid_file.gz", { type: "application/gzip" });
        const validFile = new File(["test"], "test_valid_file.fa.gz", { type: "application/gzip" });

        await userEvent.upload(await screen.findByLabelText("Upload file"), [invalidFile, validFile]);
        await waitFor(() => {
            expect(mockUpload).toHaveBeenCalledTimes(1);
            expect(mockUpload).toHaveBeenCalledWith(props.fileType, validFile);
        });
    });
});
