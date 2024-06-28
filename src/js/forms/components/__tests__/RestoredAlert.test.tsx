import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../../tests/setupTests";
import { RestoredAlert } from "../RestoredAlert";

describe("<Alert />", () => {
    let props;
    beforeEach(() => {
        props = {
            hasRestored: true,
            resetForm: vi.fn(),
            name: "resource",
        };
    });

    it("Should render when hasRestored is true", () => {
        renderWithProviders(<RestoredAlert {...props} />);
        expect(screen.queryByText(/resumed editing draft resource/i));
    });

    it("Should not render when hasRestored is false", () => {
        props.hasRestored = false;
        renderWithProviders(<RestoredAlert {...props} />);
        expect(screen.queryByText(/resumed editing draft resource/i)).not.toBeInTheDocument();
    });

    it("Should call onClose when close icon clicked", async () => {
        renderWithProviders(<RestoredAlert {...props} />);
        await userEvent.click(screen.getByLabelText("close"));
        expect(screen.queryByText(/resumed editing draft resource/i)).not.toBeInTheDocument();
    });

    it("Should call resetForm when undo Icon clicked", async () => {
        renderWithProviders(<RestoredAlert {...props} />);
        await userEvent.click(screen.getByLabelText("undo restore"));
        expect(props.resetForm).toHaveBeenCalled();
        expect(screen.queryByText(/resumed editing draft resource/i)).not.toBeInTheDocument();
    });
});
