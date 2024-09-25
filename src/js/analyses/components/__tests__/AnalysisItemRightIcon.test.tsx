import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { AnalysisItemRightIcon } from "../AnalysisItemRightIcon";

describe("<AnalysisItemRightIcon />", () => {
    it("should render remove icon when [ready=true] and [canModify=true]", async () => {
        const onRemove = vi.fn();

        const { rerender } = renderWithProviders(<AnalysisItemRightIcon canModify={true} onRemove={onRemove} />);

        const button = screen.getByRole("button");

        expect(button).toHaveClass("fas fa-trash");

        await userEvent.click(button);

        // Should call onRemove when clicked.
        expect(onRemove).toHaveBeenCalled();

        rerender(<AnalysisItemRightIcon canModify={false} onRemove={onRemove} />);

        // Should not be shown if the user can't modify the analysis.
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
});
