import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, vi } from "vitest";
import { mockApiCreateAnalysis } from "../../../../../tests/fake/analyses";
import { createFakeHMMSearchResults } from "../../../../../tests/fake/hmm";
import { createFakeIndexMinimal } from "../../../../../tests/fake/indexes";
import { createFakeMLModel, mockApiGetModels } from "../../../../../tests/fake/ml";
import { createFakeSubtractionMinimal } from "../../../../../tests/fake/subtractions";
import { renderWithProviders } from "../../../../../tests/setupTests";
import { Workflows } from "../../../types";
import { CreateAnalysis } from "../CreateAnalysis";

describe("getCompatibleWorkflows()", () => {
    let props;

    beforeEach(() => {
        props = {
            compatibleIndexes: [createFakeIndexMinimal()],
            dataType: "genome",
            defaultSubtractions: [],
            hmms: createFakeHMMSearchResults(),
            sampleId: "test-sample",
            subtractionOptions: [createFakeSubtractionMinimal()],
            onShortlistSubtractions: vi.fn(),
        };
    });

    it("should render", async () => {
        const mlModel = createFakeMLModel();
        mockApiGetModels([mlModel]);

        renderWithProviders(
            <MemoryRouter initialEntries={[{ state: { createAnalysis: Workflows.pathoscope_bowtie } }]}>
                <CreateAnalysis {...props} />
            </MemoryRouter>,
        );

        expect(await screen.findByText("Analyze")).toBeInTheDocument();

        expect(screen.getByText("Workflow")).toBeInTheDocument();
        expect(screen.getByText("Pathoscope")).toBeInTheDocument();
        expect(screen.getByText("NuVs")).toBeInTheDocument();
        expect(screen.getByText("Iimi")).toBeInTheDocument();

        expect(screen.getByText("Subtractions")).toBeInTheDocument();
        expect(screen.getByText(props.subtractionOptions[0].name)).toBeInTheDocument();

        expect(screen.getByText("References")).toBeInTheDocument();
        expect(screen.getByText(props.compatibleIndexes[0].reference.name)).toBeInTheDocument();
    });

    it("should render error messages when appropriate", async () => {
        const mlModel = createFakeMLModel();
        mockApiGetModels([mlModel]);

        renderWithProviders(
            <MemoryRouter initialEntries={[{ state: { createAnalysis: Workflows.pathoscope_bowtie } }]}>
                <CreateAnalysis {...props} />
            </MemoryRouter>,
        );
        expect(await screen.findByText("Analyze")).toBeInTheDocument();

        await userEvent.click(await screen.findByRole("button", { name: "Start" }));
        expect(await screen.findByText("A reference must be selected")).toBeInTheDocument();
    });

    it.each([
        ["Pathoscope", "pathoscope_bowtie"],
        ["NuVs", "nuvs"],
    ])("should submit correct data for ", async (name, id) => {
        const mlModel = createFakeMLModel();
        mockApiGetModels([mlModel]);

        const createAnalysisScope = mockApiCreateAnalysis(props.sampleId, {
            subtractions: [props.subtractionOptions[0].id],
            ref_id: props.compatibleIndexes[0].reference.id,
            workflow: id,
        });

        renderWithProviders(
            <MemoryRouter initialEntries={[{ state: { createAnalysis: Workflows.pathoscope_bowtie } }]}>
                <CreateAnalysis {...props} />
            </MemoryRouter>,
        );

        await userEvent.click(await screen.findByText(name));
        await userEvent.click(screen.getByText(props.subtractionOptions[0].name));
        await userEvent.click(screen.getByText(props.compatibleIndexes[0].reference.name));
        await userEvent.click(await screen.findByRole("button", { name: "Start" }));

        await waitFor(() => {
            createAnalysisScope.done();
        });
    });

    it("should submit correct data for Iimi", async () => {
        const mlModel = createFakeMLModel();
        mockApiGetModels([mlModel]);
        console.log(mlModel);
        const createAnalysisScope = mockApiCreateAnalysis(props.sampleId, {
            ml: mlModel.latest_release.id.toString(),
            ref_id: props.compatibleIndexes[0].reference.id,
            workflow: "iimi",
        });

        renderWithProviders(
            <MemoryRouter initialEntries={[{ state: { createAnalysis: Workflows.iimi } }]}>
                <CreateAnalysis {...props} />
            </MemoryRouter>,
        );

        await userEvent.click(await screen.findByText("Iimi"));
        await userEvent.click(await screen.findByRole("combobox"));
        await userEvent.click(await screen.findByRole("option", { name: mlModel.name }));
        await userEvent.click(screen.getByText(props.compatibleIndexes[0].reference.name));
        await userEvent.click(await screen.findByRole("button", { name: "Start" }));

        await waitFor(() => {
            createAnalysisScope.done();
        });
    });
});
