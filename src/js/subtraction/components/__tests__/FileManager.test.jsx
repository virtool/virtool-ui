import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { forEach } from "lodash-es";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import { createFakeAccount, mockGetAccountAPI } from "../../../../tests/fake/account";
import { createFakeFile, mockListFilesAPI } from "../../../../tests/fake/files";
import { AdministratorRoles } from "../../../administration/types";
import { UPLOAD } from "../../../app/actionTypes";
import { SubtractionFileManager } from "../FileManager";

const createAppStore = (state, reducer) => {
    return () => createStore(reducer ? reducer : state => state, state);
};

const createFiles = fileNames => {
    return fileNames.map(fileName => new File(["test"], fileName, { type: "application/gzip" }));
};

describe("<SubtractionFileManager />", () => {
    const state = {
        files: {
            items: [
                {
                    id: 1,
                    name: "subtraction.fq.gz",
                    name_on_disk: "1-subtraction.fq.gz",
                    ready: true,
                    removed: false,
                    removed_at: null,
                    reserved: false,
                    size: 1024,
                    type: "subtraction",
                    uploaded_at: "2022-04-13T20:22:25.000000Z",
                    user: { handle: "test_handle", id: "n91xt5wq", administrator: true },
                },
            ],
        },
        account: { administrator_role: AdministratorRoles.FULL },
    };

    it("should render", async () => {
        const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
        mockGetAccountAPI(account);

        const file = createFakeFile({ name: "subtraction.fq.gz" });
        mockListFilesAPI([file]);
        renderWithProviders(
            <MemoryRouter initialEntries={[{ pathname: "/samples/files", search: "?page=1" }]}>
                <SubtractionFileManager />
            </MemoryRouter>,
            createAppStore(state),
        );
        expect(await screen.findByText("Drag FASTA files here to upload")).toBeInTheDocument();
        expect(screen.getByText("Accepts files ending in fa, fasta, fa.gz, or fasta.gz.")).toBeInTheDocument();
    });

    it("should reject files not ending in fa, fasta, fa.gz, or fasta.gz.", async () => {
        const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
        mockGetAccountAPI(account);

        const file = createFakeFile({ name: "subtraction.fq.gz" });
        mockListFilesAPI([file]);

        const mockUploadRequested = vi.fn();
        const reducer = (state, action) => {
            if (action.type === UPLOAD.REQUESTED) mockUploadRequested(action.payload.file);
            return state;
        };

        renderWithProviders(
            <MemoryRouter initialEntries={[{ pathname: "/samples/files", search: "?page=1" }]}>
                <SubtractionFileManager />
            </MemoryRouter>,
            createAppStore(state, reducer),
        );

        const validFiles = createFiles(["test.fa", "test.fa.gz", "test.fasta", "test.fasta.gz"]);
        const invalidFiles = createFiles([
            "test.txt",
            "testfa",
            "testfa.gz",
            "test.fagz",
            "testfasta",
            "testfasta.gz",
            "test.fastagz",
        ]);

        await userEvent.upload(await screen.findByLabelText("Upload file"), [...validFiles, ...invalidFiles]);

        await waitFor(() => {
            expect(mockUploadRequested).toHaveBeenCalledTimes(4);
            forEach(validFiles, file => expect(mockUploadRequested).toHaveBeenCalledWith(file));
        });
    });
});
