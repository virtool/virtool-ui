import userEvent from "@testing-library/user-event";
import { forEach } from "lodash-es";
import { createStore } from "redux";
import { SubtractionFileManager } from "../FileManager";
import { screen, waitFor } from "@testing-library/react";
import { UPLOAD } from "../../../app/actionTypes";

const createAppStore = (state, reducer) => {
    return () => createStore(reducer ? reducer : state => state, state);
};

const createFiles = fileNames => {
    return fileNames.map(fileName => new File(["test"], fileName, { type: "application/gzip" }));
};

describe("<SubtractionFileManager />", () => {
    const state = {
        files: {
            documents: [
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
                    user: { handle: "test_handle", id: "n91xt5wq", administrator: true }
                }
            ]
        },
        account: { administrator: true }
    };

    it("should render", () => {
        renderWithProviders(<SubtractionFileManager />, createAppStore(state));
        expect(screen.getByText("Drag FASTA files here to upload")).toBeInTheDocument();
        expect(screen.getByText("Accepts files ending in fa, fasta, fa.gz, or fasta.gz.")).toBeInTheDocument();
    });

    it("should reject files not ending in fa, fasta, fa.gz, or fasta.gz.", async () => {
        const mockUploadRequested = vi.fn();
        const reducer = (state, action) => {
            if (action.type === UPLOAD.REQUESTED) mockUploadRequested(action.payload.file);
            return state;
        };

        renderWithProviders(<SubtractionFileManager />, createAppStore(state, reducer));

        const validFiles = createFiles(["test.fa", "test.fa.gz", "test.fasta", "test.fasta.gz"]);
        const invalidFiles = createFiles([
            "test.txt",
            "testfa",
            "testfa.gz",
            "test.fagz",
            "testfasta",
            "testfasta.gz",
            "test.fastagz"
        ]);

        await userEvent.upload(screen.getByLabelText("Upload file"), [...validFiles, ...invalidFiles]);

        await waitFor(() => {
            expect(mockUploadRequested).toHaveBeenCalledTimes(4);
            forEach(validFiles, file => expect(mockUploadRequested).toHaveBeenCalledWith(file));
        });
    });
});
