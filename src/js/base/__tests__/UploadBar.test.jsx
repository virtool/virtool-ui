import userEvent from "@testing-library/user-event";
import { UploadBar } from "../UploadBar";
import { screen, waitFor } from "@testing-library/react";

describe("<UploadBar />", () => {
    let props;
    beforeEach(() => {
        props = { message: "", onDrop: vi.fn(), validator: () => null };
    });

    it("should render RTL", () => {
        renderWithProviders(<UploadBar {...props} />);
        expect(screen.getByText("Drag file here to upload")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Browse Files" })).toBeInTheDocument();
    });

    it("should display optional message", () => {
        props.message = "test_message";
        renderWithProviders(<UploadBar {...props} />);
        expect(screen.getByText("test_message")).toBeInTheDocument();
    });

    it("should call onDrop with uploaded files", async () => {
        renderWithProviders(<UploadBar {...props} />);
        const file = new File(["test"], "test_file.fa.gz", { type: "application/gzip" });
        await userEvent.upload(screen.getByLabelText("Upload file"), file);
        await waitFor(() => {
            expect(props.onDrop).toHaveBeenCalledWith([file]);
        });
    });

    it("should filter files using passed validator", async () => {
        props.validator = file => {
            return /.(?:fa|fasta)(?:.gz|.gzip)?$/.test(file.name) ? null : { code: "Invalid file type" };
        };
        renderWithProviders(<UploadBar {...props} />);
        const invalidFile = new File(["test"], "test_invalid_file.gz", { type: "application/gzip" });
        const validFile = new File(["test"], "test_valid_file.fa.gz", { type: "application/gzip" });
        await userEvent.upload(screen.getByLabelText("Upload file"), [invalidFile, validFile]);
        await waitFor(() => {
            expect(props.onDrop).toHaveBeenCalledWith([validFile]);
        });
    });
});
