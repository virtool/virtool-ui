import { screen } from "@testing-library/react";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeHMM, mockApiGetHmmDetail } from "../../../../tests/fake/hmm";
import { renderWithProviders } from "../../../../tests/setupTests";
import HMMDetail from "../HMMDetail";

describe("<HMMDetail />", () => {
    const hmmDetail = createFakeHMM();
    let props;

    beforeEach(() => {
        props = {
            match: {
                params: {
                    hmmId: hmmDetail.id,
                },
            },
        };
    });

    afterEach(() => nock.cleanAll());

    describe("<HMMDetail />", () => {
        it("should render correctly when query has an error", async () => {
            const scope = mockApiGetHmmDetail(hmmDetail, 404);
            renderWithProviders(<HMMDetail {...props} />);

            expect(await screen.findByText("404")).toBeInTheDocument();
            expect(screen.getByText("Not found")).toBeInTheDocument();

            scope.done();
        });

        it("should render loading when props.detail = null", () => {
            renderWithProviders(<HMMDetail {...props} />);

            expect(screen.getByLabelText("loading")).toBeInTheDocument();
            expect(screen.queryByText("General")).not.toBeInTheDocument();
            expect(screen.queryByText("Cluster")).not.toBeInTheDocument();
        });

        it("should render General table correctly", async () => {
            const scope = mockApiGetHmmDetail(hmmDetail);
            renderWithProviders(<HMMDetail {...props} />);

            expect(await screen.findByText("General")).toBeInTheDocument();

            expect(screen.getByText("Cluster")).toBeInTheDocument();
            expect(screen.getByText(hmmDetail.cluster)).toBeInTheDocument();

            expect(screen.getByText("Best Definitions")).toBeInTheDocument();

            expect(screen.getByText("Length")).toBeInTheDocument();
            expect(screen.getByText(hmmDetail.length)).toBeInTheDocument();

            expect(screen.getByText("Mean Entropy")).toBeInTheDocument();
            expect(
                screen.getByText(hmmDetail.mean_entropy),
            ).toBeInTheDocument();

            scope.done();
        });

        it("should render Cluster table correctly", async () => {
            const scope = mockApiGetHmmDetail(hmmDetail);
            renderWithProviders(<HMMDetail {...props} />);

            expect(await screen.findByText("General")).toBeInTheDocument();

            expect(screen.getByText("Cluster Members")).toBeInTheDocument();
            expect(
                screen.getByText(hmmDetail.entries.length),
            ).toBeInTheDocument();

            expect(screen.getByText("Accession")).toBeInTheDocument();
            expect(
                screen.getByText(hmmDetail.entries[0].accession),
            ).toBeInTheDocument();
            expect(
                screen.getByText(hmmDetail.entries[1].accession),
            ).toBeInTheDocument();

            expect(screen.getByText("Name")).toBeInTheDocument();
            expect(
                screen.getByText(hmmDetail.entries[0].name),
            ).toBeInTheDocument();
            expect(
                screen.getByText(hmmDetail.entries[1].name),
            ).toBeInTheDocument();

            expect(screen.getByText("Organism")).toBeInTheDocument();
            expect(
                screen.queryByText(hmmDetail.entries[0].organism),
            ).toBeInTheDocument();
            expect(
                screen.queryByText(hmmDetail.entries[1].organism),
            ).toBeInTheDocument();

            scope.done();
        });
    });

    describe("HMMTaxonomy", () => {
        it("should render Families correctly", async () => {
            const scope = mockApiGetHmmDetail(hmmDetail);
            renderWithProviders(<HMMDetail {...props} />);

            expect(await screen.findByText("Families")).toBeInTheDocument();

            expect(screen.getByText("Papillomaviridae")).toBeInTheDocument();
            expect(
                screen.getByText(hmmDetail.families.Papillomaviridae),
            ).toBeInTheDocument();
            expect(screen.getByText("None")).toBeInTheDocument();
            expect(
                screen.getByText(hmmDetail.families.None),
            ).toBeInTheDocument();

            scope.done();
        });

        it("should render Genera correctly", async () => {
            const scope = mockApiGetHmmDetail(hmmDetail);
            renderWithProviders(<HMMDetail {...props} />);

            expect(await screen.findByText("Genera")).toBeInTheDocument();

            expect(screen.getByText("Begomovirus")).toBeInTheDocument();
            expect(
                screen.getByText(hmmDetail.genera.Begomovirus),
            ).toBeInTheDocument();
            expect(screen.getByText("Curtovirus")).toBeInTheDocument();
            expect(
                screen.getByText(hmmDetail.genera.Curtovirus),
            ).toBeInTheDocument();

            scope.done();
        });
    });
});
