import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RestoredAlert } from "../Alert";

describe("<Alert />", () => {
    let props;
    beforeEach(() => {
        props = {
            onClose: vi.fn(),
            resetForm: vi.fn(),
            saveTime: 1652289121840
        };
    });

    it("Should render", () => {
        renderWithProviders(<RestoredAlert {...props} />);
        expect(screen.getByText("Resumed editing draft sample.")).toBeInTheDocument();
        expect(screen.getByLabelText("undo restore")).toBeInTheDocument();
        expect(screen.getByLabelText("close")).toBeInTheDocument();
    });

    it("Should call onClose when close icon clicked", () => {
        renderWithProviders(<RestoredAlert {...props} />);
        userEvent.click(screen.getByLabelText("close"));
        expect(props.onClose).toHaveBeenCalled();
    });

    it("Should call resetForm when undo Icon clicked", () => {
        renderWithProviders(<RestoredAlert {...props} />);
        userEvent.click(screen.getByLabelText("undo restore"));
        expect(props.resetForm).toHaveBeenCalled();
        expect(props.onClose).toHaveBeenCalled();
    });
});
