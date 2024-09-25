import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup";
import React from "react";
import { describe, expect, it } from "vitest";
import JobError from "../JobError";

describe("<JobError />", () => {
    let error;

    it("should render", () => {
        error = {
            type: "TestErrorWithStackTrace",
            traceback: ["line one", "line two", "line three"],
            details: "test error details",
        };

        const { rerender } = renderWithProviders(<JobError error={error} />);

        expect(screen.getByText("TestErrorWithStackTrace")).toBeInTheDocument();
        expect(screen.getByText("line one")).toBeInTheDocument();
        expect(screen.getByText("line two")).toBeInTheDocument();
        expect(screen.getByText("line three")).toBeInTheDocument();
        expect(screen.getByText(": test error details")).toBeInTheDocument();

        rerender(<JobError error={null} />);

        expect(screen.queryByText("TestErrorWithStackTrace")).not.toBeInTheDocument();
    });
});
