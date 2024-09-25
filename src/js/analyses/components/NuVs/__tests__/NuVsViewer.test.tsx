import NuVsViewer from "@/analyses/components/NuVs/NuVsViewer";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeSample } from "@tests/fake/samples";
import { renderWithMemoryRouter } from "@tests/setup";
import nock from "nock";
import React from "react";
import { describe, expect, it } from "vitest";
import { createFakeFormattedNuVsAnalysis, mockApiBlastNuVs } from "../../../../../tests/fake/analyses";

describe("<NuVsViewer />", () => {
    let props;
    let sample;
    let nuvs;

    beforeEach(() => {
        sample = createFakeSample();
        nuvs = createFakeFormattedNuVsAnalysis();
        props = {
            detail: nuvs,
            sample: sample,
        };
    });

    afterEach(() => nock.cleanAll());

    describe("<NuVsDetail />", () => {
        it("should render correctly", () => {
            renderWithMemoryRouter(<NuVsViewer {...props} />);

            expect(screen.getByText("This sequence has no BLAST information attached to it.")).toBeInTheDocument();
            expect(screen.getByText("Families")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "BLAST at NCBI" })).toBeInTheDocument();
        });

        it("should render blast when clicked", async () => {
            const scope = mockApiBlastNuVs(nuvs.id, nuvs.results.hits[0].index);
            renderWithMemoryRouter(<NuVsViewer {...props} />);

            await userEvent.click(screen.getByRole("button", { name: "BLAST at NCBI" }));
            scope.done();
        });
    });

    describe("<NuVsExport />", () => {
        it("should render export dialog when exporting", async () => {
            renderWithMemoryRouter(<NuVsViewer {...props} />);

            await userEvent.click(screen.getByRole("button", { name: "Export" }));
            expect(screen.getByText("Export Analysis")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Download" })).toBeInTheDocument();
        });
    });
});
