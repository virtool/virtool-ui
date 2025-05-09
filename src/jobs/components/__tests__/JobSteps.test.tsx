import JobSteps from "@jobs/components/JobSteps";
import { JobState } from "@jobs/types";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup";
import React from "react";
import { describe, expect, it } from "vitest";

describe("<JobSteps />", () => {
    it("should render", () => {
        const props = {
            status: [
                {
                    state: "waiting" as JobState,
                    timestamp: "2024-04-12T21:50:19.108000Z",
                    progress: 40,
                },
                {
                    state: "running" as JobState,
                    timestamp: "2024-04-12T21:50:19.108000Z",
                    progress: 40,
                },
            ],
        };

        renderWithProviders(<JobSteps {...props} />);

        expect(screen.getByText("Waiting")).toBeInTheDocument();
        expect(
            screen.getByText("Waiting for resources to become available."),
        ).toBeInTheDocument();
        expect(screen.getByText("Running")).toBeInTheDocument();
    });
});
