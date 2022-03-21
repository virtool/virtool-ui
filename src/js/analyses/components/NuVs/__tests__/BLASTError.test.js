import { BLASTError } from "../BLASTError";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<BLASTError />", () => {
    let props;
    beforeEach(() => {
        props = {
            error: "Failure. BLAST did not work.",
            onBlast: jest.fn()
        };
    });

    it("should render error", () => {
        renderWithProviders(<BLASTError {...props} />);
        expect(screen.getByText("Error during BLAST request.")).toBeInTheDocument();
        expect(screen.getByText("Failure. BLAST did not work.")).toBeInTheDocument();
    });

    it("should call onBlast when retry button clicked", () => {
        renderWithProviders(<BLASTError {...props} />);
        userEvent.click(screen.getByText("Retry"));
        expect(props.onBlast).toHaveBeenCalled();
    });
});
