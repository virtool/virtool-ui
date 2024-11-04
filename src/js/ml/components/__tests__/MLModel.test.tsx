import { screen } from "@testing-library/react";
import { renderWithRouter } from "@tests/setup";
import React from "react";
import { describe, it } from "vitest";
import { createFakeMLModelMinimal, mockApiGetModels } from "../../../../tests/fake/ml";
import ML from "../ML";

describe("<MLModels/>", () => {
    const path = "/ml";

    it("should render", async () => {
        const created_at = new Date();
        created_at.setFullYear(created_at.getFullYear() - 1);

        const mlModel = createFakeMLModelMinimal({
            created_at: created_at.toISOString(),
        });
        const model_scope = mockApiGetModels([mlModel]);

        renderWithRouter(<ML />, path);

        expect(await screen.findByText(mlModel.name)).toBeInTheDocument();
        expect(await screen.findByRole("link", { name: `${mlModel.latest_release.name}` })).toHaveAttribute(
            "href",
            mlModel.latest_release.github_url,
        );
        expect(await screen.findByText("1 year ago")).toBeInTheDocument();

        model_scope.done();
    });

    it("should render NoneFound when no models exist", async () => {
        const model_scope = mockApiGetModels([]);
        renderWithRouter(<ML />, path);

        expect(await screen.findByText("No machine learning models found.")).toBeInTheDocument();
        model_scope.done();
    });
});
