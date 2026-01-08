import JobSteps from "@jobs/components/JobSteps";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup";
import { describe, expect, it } from "vitest";

describe("<JobSteps />", () => {
    it("should render", () => {
        renderWithProviders(
            <JobSteps
                state="running"
                steps={[
                    {
                        id: "download_files",
                        name: "Download files",
                        description: "Downloading reference files",
                        startedAt: new Date("2024-04-12T21:50:19.108000Z"),
                    },
                    {
                        id: "build_index",
                        name: "Build index",
                        description: "Building search index",
                        startedAt: new Date("2024-04-12T21:51:19.108000Z"),
                    },
                ]}
            />,
        );

        expect(screen.getByText("Download files")).toBeInTheDocument();
        expect(
            screen.getByText("Downloading reference files"),
        ).toBeInTheDocument();
        expect(screen.getByText("Build index")).toBeInTheDocument();
        expect(screen.getByText("Building search index")).toBeInTheDocument();
    });
});
