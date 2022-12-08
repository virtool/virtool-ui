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

    it("Should call onClose when close icon clicked", async () => {
        renderWithProviders(<RestoredAlert {...props} />);
        await userEvent.click(screen.getByLabelText("close"));
        expect(props.onClose).toHaveBeenCalled();
    });

    it("Should call resetForm when undo Icon clicked", async () => {
        renderWithProviders(<RestoredAlert {...props} />);
        await userEvent.click(screen.getByLabelText("undo restore"));
        expect(props.resetForm).toHaveBeenCalled();
        expect(props.onClose).toHaveBeenCalled();
    });
});
