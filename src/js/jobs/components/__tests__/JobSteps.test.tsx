import { screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../../tests/setupTests";
import JobSteps from "../JobSteps";

describe("<JobSteps />", () => {
    it("should render", () => {
        const props = {
            status: [
                { state: "waiting", timestamp: Date.now(), progress: 40 },
                { state: "running", timestamp: Date.now(), progress: 40 },
            ],
        };
        renderWithProviders(<JobSteps {...props} />);
        expect(screen.getByText("Waiting")).toBeInTheDocument();
        expect(screen.getByText("Waiting for resources to become available.")).toBeInTheDocument();
        expect(screen.getByText("Running")).toBeInTheDocument();
    });
});
