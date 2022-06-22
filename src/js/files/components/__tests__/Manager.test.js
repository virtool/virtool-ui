import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createStore } from "redux";
import { FileManager, mapDispatchToProps, mapStateToProps } from "../Manager";

const createAppStore = state => {
    return () => createStore(state => state, state);
};

describe("<FileManager>", () => {
    let props;
    let state;
    beforeEach(() => {
        props = {
            found_count: 6,
            page: 1,
            page_count: 1,
            total_count: 1,
            canUpload: true,
            documents: [1],
            storedFileType: "test_file_type",
            fileType: "test_file_type",
            message: "",
            tip: "",
            validationRegex: "",
            onDrop: jest.fn(),
            onLoadNextPage: jest.fn()
        };
        state = {
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
    });

    it("should render", () => {
        renderWithProviders(<FileManager {...props} />, createAppStore(state));
        expect(screen.getByText("Drag file here to upload.")).toBeInTheDocument();
        expect(screen.getByText("subtraction.fq.gz")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Browse Files" })).toBeInTheDocument();
    });

    it("should remove upload bar if canUpload is false", () => {
        props.canUpload = false;
        renderWithProviders(<FileManager {...props} />, createAppStore(state));
        expect(screen.getByText("You do not have permission to upload files.")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Upload" })).not.toBeInTheDocument();
    });

    it("should change message if passed", () => {
        props.message = "test_message";
        renderWithProviders(<FileManager {...props} />, createAppStore(state));
        expect(screen.getByText("test_message")).toBeInTheDocument();
    });

    it("should filter files according to passed regex", async () => {
        props.validationRegex = /.(?:fa|fasta)(?:.gz|.gzip)?$/;
        renderWithProviders(<FileManager {...props} />, createAppStore(state));
        const invalidFile = new File(["test"], "test_invalid_file.gz", { type: "application/gzip" });
        const validFile = new File(["test"], "test_valid_file.fa.gz", { type: "application/gzip" });
        await userEvent.upload(screen.getByLabelText("Upload file"), [invalidFile, validFile]);
        await waitFor(() => {
            expect(props.onDrop).toHaveBeenCalledWith(props.fileType, [validFile]);
        });
    });
});

describe("mapStateToProps()", () => {
    let state;

    beforeEach(() => {
        state = {
            files: {
                found_count: 6,
                page: 1,
                page_count: 1,
                total_count: 1,
                fileType: "test_fileType",
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
    });

    it("should return correct values", () => {
        const expected = {
            found_count: 6,
            page: 1,
            page_count: 1,
            total_count: 1,
            storedFileType: "test_fileType",
            documents: [1],
            canUpload: true
        };
        expect(mapStateToProps(state)).toEqual(expected);
    });
});

describe("mapDispatchToProps", () => {
    let dispatch;
    beforeEach(() => {
        dispatch = jest.fn();
    });

    it("should return onDrop", () => {
        const { onDrop } = mapDispatchToProps(dispatch);
        const file = new File(["test"], "test_file.fa.gz", { type: "application/gzip" });
        onDrop("test_fileType", [file]);
        expect(dispatch).toHaveBeenCalledWith({
            type: "UPLOAD_REQUESTED",
            payload: { context: {}, file, fileType: "test_fileType", localId: expect.stringMatching(/.{8}/) }
        });
    });
    it("should return onLoadNextPage", () => {
        const { onLoadNextPage } = mapDispatchToProps(dispatch);
        const payload = { fileType: "test_fileType", term: "test", page: 2 };
        const { fileType, term, page } = payload;
        onLoadNextPage(fileType, term, page);
        expect(dispatch).toHaveBeenCalledWith({
            type: "FIND_FILES_REQUESTED",
            payload
        });
    });
});
