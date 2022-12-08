import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "../../../app/theme";
import { ImportReference, mapDispatchToProps, mapStateToProps } from "../Import";

const rerenderWithProviders = (rerender, ui) => {
    const wrappedUi = <ThemeProvider theme={theme}>{ui}</ThemeProvider>;
    return rerender(wrappedUi);
};

describe("<EmptyReference />", () => {
    let props;

    let initialValues;

    beforeEach(() => {
        props = {
            onSubmit: vi.fn(),
            onDrop: vi.fn(),
            file: null
        };
        initialValues = {
            name: "",
            description: "",
            dataType: "genome",
            organism: "",
            mode: "empty"
        };
    });

    it("should render", () => {
        renderWithProviders(<ImportReference {...props} />);

        expect(
            screen.getByText("Create a reference from a file previously exported from another Virtool reference.")
        ).toBeInTheDocument();
        expect(screen.getByText("Drag file here to upload")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(initialValues.name);
        expect(screen.getByText("Description")).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Description" })).toHaveValue(initialValues.description);
    });

    it("should accept Uploaded File", async () => {
        renderWithProviders(<ImportReference {...props} />);
        const file = new File(["test"], "test_file.gz", { type: "application/gzip" });
        await userEvent.upload(screen.getByLabelText("Upload file"), file);
        expect(props.onDrop).toHaveBeenCalledWith(expect.stringMatching(/^.{8}$/), file, "reference");
    });

    it("should render 'Uploading...' in upload bar when upload is incomplete", () => {
        props.file = { name: null, progress: 50, ready: false };
        renderWithProviders(<ImportReference {...props} />);
        expect(screen.getByText("Uploading...")).toBeInTheDocument();
    });

    it("should render file name in upload bar when upload is complete", () => {
        props.file = { id: 63, name: "test_reference_upload", progress: 100, ready: true };
        renderWithProviders(<ImportReference {...props} />);
        expect(screen.getByText("test_reference_upload")).toBeInTheDocument();
    });

    it("Should display error and block submission when no file has been uploaded", async () => {
        renderWithProviders(<ImportReference {...props} />);
        userEvent.click(screen.getByRole("button", { name: "Import" }));
        await waitFor(() => expect(screen.getByText("A reference file must be uploaded")).toBeInTheDocument());
        expect(props.onSubmit).not.toHaveBeenCalled();
    });

    it("Should display error and block submission when name textbox is empty", async () => {
        renderWithProviders(<ImportReference {...props} />);
        userEvent.click(screen.getByRole("button", { name: "Import" }));
        await waitFor(() => expect(screen.getByText("Required Field")).toBeInTheDocument());
        expect(props.onSubmit).not.toHaveBeenCalled();
    });

    it("should call onSubmit with correct values when a reference is uploaded and name textbox is populated", async () => {
        const { rerender } = renderWithProviders(<ImportReference {...props} />);
        const file = new File(["test"], "test_file.gz", { type: "application/gzip" });
        await userEvent.upload(screen.getByLabelText("Upload file"), file);
        expect(props.onDrop).toHaveBeenCalledWith(expect.stringMatching(/^.{8}$/), file, "reference");

        props.file = { id: 1, name: "test_reference_upload", progress: 100, ready: true };

        const name = "test_name";
        const description = "test_description";

        rerenderWithProviders(rerender, <ImportReference {...props} />);
        await userEvent.type(screen.getByRole("textbox", { name: "Name" }), name);
        await userEvent.type(screen.getByRole("textbox", { name: "Description" }), description);
        userEvent.click(screen.getByRole("button", { name: "Import" }));
        await waitFor(() =>
            expect(props.onSubmit).toHaveBeenCalledWith(name, description, `${props.file.id}-${props.file.name}`)
        );
    });
});

describe("mapDispatchToProps()", () => {
    const dispatch = vi.fn();
    const props = mapDispatchToProps(dispatch);
    it("should return onSubmit in props", () => {
        props.onSubmit("test_name", "test_description", "test_fileId");
        expect(dispatch).toHaveBeenCalledWith({
            payload: { name: "test_name", description: "test_description", fileId: "test_fileId" },
            type: "IMPORT_REFERENCE_REQUESTED"
        });
    });
    it("should return onDrop in props", () => {
        props.onDrop("test_localId", "test_file", "test_fileType");
        expect(dispatch).toHaveBeenCalledWith({
            payload: { localId: "test_localId", file: "test_file", fileType: "test_fileType", context: {} },
            type: "UPLOAD_REQUESTED"
        });
    });
});

describe("mapStateToProps()", () => {
    it("should return file from state", () => {
        const state = {
            references: { importFile: { id: 1, name: "test_reference_upload", progress: 100, ready: true } }
        };
        const { file } = mapStateToProps(state);
        expect(file).toEqual({ id: 1, name: "test_reference_upload", progress: 100, ready: true });
    });
});
