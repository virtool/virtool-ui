import { AdministratorRoleName } from "@administration/types";
import { formatPath } from "@app/hooks";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { createFakeFile, mockApiListFiles } from "@tests/fake/files";
import { renderWithRouter } from "@tests/setup";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UploadType } from "../../types";
import { upload } from "../../uploader";
import { FileManager, FileManagerProps } from "../FileManager";

describe("<FileManager>", () => {
    let props: FileManagerProps;
    let path;

    afterEach(() => {
        vi.restoreAllMocks();
    });

    beforeEach(() => {
        props = {
            accept: {
                "application/gzip": [
                    ".fasta.gz",
                    ".fa.gz",
                    ".fastq.gz",
                    ".fq.gz",
                ],
            },
            fileType: UploadType.reads,
            message: "",
        };
        path = formatPath("/samples/uploads", { page: 1 });
    });

    it("should upload with validation based on passed regex", async () => {
        mockApiGetAccount(
            createFakeAccount({
                administrator_role: null,
                permissions: {
                    cancel_job: false,
                    create_ref: false,
                    create_sample: false,
                    modify_hmm: false,
                    modify_subtraction: false,
                    remove_file: false,
                    remove_job: false,
                    upload_file: true,
                },
            }),
        );
        mockApiListFiles([createFakeFile({ name: "subtraction.fq.gz" })], true);

        vi.mock("@uploads/uploader");

        renderWithRouter(
            <FileManager {...props} regex={/.(?:fa|fasta)(?:.gz|.gzip)?$/} />,
            path,
        );

        expect(
            await screen.findByText("Drag file here to upload"),
        ).toBeInTheDocument();
        expect(screen.getByText("subtraction.fq.gz")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Browse Files" }),
        ).toBeInTheDocument();

        const invalidFile = new File(["test"], "test_invalid_file.gz", {
            type: "application/gzip",
        });
        const validFile = new File(["test"], "test_valid_file.fa.gz", {
            type: "application/gzip",
        });

        await userEvent.upload(await screen.findByLabelText("Upload file"), [
            invalidFile,
            validFile,
        ]);

        await waitFor(() => {
            expect(upload).toHaveBeenCalledTimes(1);
            expect(upload).toHaveBeenCalledWith(validFile, props.fileType);
        });
    });

    it("should hide upload bar if user lacks permission", async () => {
        mockApiGetAccount(createFakeAccount({ administrator_role: null }));
        mockApiListFiles([createFakeFile({ name: "subtraction.fq.gz" })], true);

        renderWithRouter(<FileManager {...props} />, path);

        expect(
            await screen.findByText(
                "You do not have permission to upload files.",
            ),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Upload" }),
        ).not.toBeInTheDocument();
    });

    it("should take custom message", async () => {
        mockApiGetAccount(
            createFakeAccount({
                administrator_role: AdministratorRoleName.FULL,
            }),
        );
        mockApiListFiles([createFakeFile({ name: "subtraction.fq.gz" })], true);

        renderWithRouter(
            <FileManager {...props} message="Test Message" />,
            path,
        );

        expect(await screen.findByText("Test Message")).toBeInTheDocument();
    });
});
