import { formatPath } from "@/hooks";
import { Workflows } from "@analyses/types";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiCreateAnalysis } from "@tests/fake/analyses";
import { createFakeHMMSearchResults } from "@tests/fake/hmm";
import {
    createFakeIndexMinimal,
    mockApiListIndexes,
} from "@tests/fake/indexes";
import { createFakeMLModel, mockApiGetModels } from "@tests/fake/ml";
import { createFakeSample, mockApiGetSampleDetail } from "@tests/fake/samples";
import {
    createFakeShortlistSubtraction,
    mockApiGetShortlistSubtractions,
} from "@tests/fake/subtractions";
import { renderWithRouter } from "@tests/setup";
import nock from "nock";
import React from "react";
import { describe, it } from "vitest";
import CreateAnalysis from "../CreateAnalysis";

describe("getCompatibleWorkflows()", () => {
    let sample;
    let subtractionShortlist;
    let indexMinimal;
    let props;
    let basePath;
    let searchParams;

    beforeEach(() => {
        sample = createFakeSample();
        subtractionShortlist = createFakeShortlistSubtraction();
        indexMinimal = createFakeIndexMinimal();
        props = {
            hmms: createFakeHMMSearchResults(),
            sampleId: sample.id,
        };
        mockApiGetSampleDetail(sample);
        mockApiGetShortlistSubtractions([subtractionShortlist], true);
        mockApiListIndexes([indexMinimal]);
        basePath = `/samples/${sample.id}/analyses`;
        searchParams = { createAnalysisType: Workflows.pathoscope_bowtie };
    });

    afterEach(() => nock.cleanAll());

    it("should render", async () => {
        const mlModel = createFakeMLModel();
        mockApiGetModels([mlModel]);

        renderWithRouter(
            <CreateAnalysis {...props} />,
            formatPath(basePath, searchParams),
        );

        expect(await screen.findByText("Analyze")).toBeInTheDocument();

        expect(screen.getByText("Workflow")).toBeInTheDocument();
        expect(screen.getByText("Pathoscope")).toBeInTheDocument();
        expect(screen.getByText("NuVs")).toBeInTheDocument();
        expect(screen.getByText("Iimi")).toBeInTheDocument();

        expect(screen.getByText("Subtractions")).toBeInTheDocument();
        expect(screen.getByText(subtractionShortlist.name)).toBeInTheDocument();

        expect(screen.getByText("References")).toBeInTheDocument();
        expect(
            screen.getByText(indexMinimal.reference.name),
        ).toBeInTheDocument();
    });

    it("should render error messages when appropriate", async () => {
        const mlModel = createFakeMLModel();
        mockApiGetModels([mlModel]);

        renderWithRouter(
            <CreateAnalysis {...props} />,
            formatPath(basePath, searchParams),
        );
        expect(await screen.findByText("Analyze")).toBeInTheDocument();

        await userEvent.click(
            await screen.findByRole("button", { name: "Start" }),
        );
        expect(
            await screen.findByText("A reference must be selected"),
        ).toBeInTheDocument();
    });

    it.each([
        ["Pathoscope", "pathoscope_bowtie"],
        ["NuVs", "nuvs"],
    ])("should submit correct data for ", async (name, id) => {
        const mlModel = createFakeMLModel();
        mockApiGetModels([mlModel]);
        const createAnalysisScope = mockApiCreateAnalysis(props.sampleId, {
            subtractions: [sample.subtractions[0].id, subtractionShortlist.id],
            ref_id: indexMinimal.reference.id,
            workflow: id,
        });

        renderWithRouter(
            <CreateAnalysis {...props} />,
            formatPath(basePath, { createAnalysisType: id }),
        );

        await userEvent.click(await screen.findByText(name));
        await userEvent.click(screen.getByText(subtractionShortlist.name));
        await userEvent.click(await screen.findByRole("combobox"));
        await userEvent.click(
            await screen.findByRole("option", {
                name: indexMinimal.reference.name,
            }),
        );
        await userEvent.click(
            await screen.findByRole("button", { name: "Start" }),
        );

        await waitFor(() => {
            createAnalysisScope.done();
        });
    });

    it("should submit correct data for Iimi", async () => {
        const mlModel = createFakeMLModel();
        mockApiGetModels([mlModel]);
        const createAnalysisScope = mockApiCreateAnalysis(props.sampleId, {
            ml: mlModel.latest_release.id.toString(),
            ref_id: indexMinimal.reference.id,
            workflow: "iimi",
        });

        renderWithRouter(
            <CreateAnalysis {...props} />,
            formatPath(basePath, { createAnalysisType: "iimi" }),
        );

        const comboboxes = await screen.findAllByRole("combobox");

        await userEvent.click(await screen.findByText("Iimi"));
        await userEvent.click(comboboxes[0]);
        await userEvent.click(
            await screen.findByRole("option", { name: mlModel.name }),
        );
        await userEvent.click(comboboxes[1]);
        await userEvent.click(
            await screen.findByRole("option", {
                name: indexMinimal.reference.name,
            }),
        );
        await userEvent.click(
            await screen.findByRole("button", { name: "Start" }),
        );

        await waitFor(() => {
            createAnalysisScope.done();
        });
    });
});
