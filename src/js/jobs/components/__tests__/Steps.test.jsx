import { screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../../tests/setupTests";
import { JobSteps, mapStateToProps } from "../JobSteps";

describe("<JobSteps />", () => {
    it("should render", () => {
        const props = {
            status: [
                { state: "waiting", timestamp: Date.now() },
                { state: "running", timestamp: Date.now() },
            ],
        };
        renderWithProviders(<JobSteps {...props} />);
        expect(screen.getByText("Waiting")).toBeInTheDocument();
        expect(screen.getByText("Waiting for resources to become available.")).toBeInTheDocument();
        expect(screen.getByText("Running")).toBeInTheDocument();
    });
});

describe("mapStateToProps", () => {
    it("should map state to props correctly", () => {
        const status = [{ state: "waiting" }, { state: "running" }];

        const props = mapStateToProps({
            jobs: {
                detail: {
                    status,
                },
            },
        });

        expect(props).toEqual({
            status,
        });
    });
});
