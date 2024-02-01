import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../../tests/setupTests";
import { AnalysisItemRightIcon } from "../RightIcon";

describe("<RightIcon />", () => {
    it("should render remove icon when [ready=true] and [canModify=true]", async () => {
        const onRemove = vi.fn();

        const { rerender } = renderWithProviders(
            <AnalysisItemRightIcon
                canModify={true}
                ready={true}
                onRemove={onRemove}
            />,
        );

        const button = screen.getByRole("button");

        expect(button).toHaveClass("fas fa-trash");

        await userEvent.click(button);

        // Should call onRemove when clicked.
        expect(onRemove).toHaveBeenCalled();

        rerender(
            <AnalysisItemRightIcon
                canModify={false}
                ready={true}
                onRemove={onRemove}
            />,
        );

        // Should not be shown if the user can't modify the analysis.
        expect(screen.queryByRole("button")).not.toBeInTheDocument();

        rerender(
            <AnalysisItemRightIcon
                canModify={true}
                ready={false}
                onRemove={onRemove}
            />,
        );

        expect(screen.queryByRole("button")).not.toBeInTheDocument();
        expect(screen.getByLabelText("loading")).toBeInTheDocument();
    });
});
