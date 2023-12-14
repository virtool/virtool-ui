import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, it, vi } from "vitest";
import { createFakeHMMSearchResults } from "../../../../../tests/fake/hmm";
import { createFakeIndexMinimal } from "../../../../../tests/fake/indexes";
import { createFakeSubtractionMinimal } from "../../../../../tests/fake/subtractions";
import { renderWithProviders } from "../../../../../tests/setupTests";
import { CreateAnalysis } from "../CreateAnalysis";

describe("getCompatibleWorkflows()", () => {
    let props;

    beforeEach(() => {
        props = {
            accountId: "test-account",
            compatibleIndexes: [createFakeIndexMinimal()],
            dataType: "genome",
            defaultSubtractions: [],
            hmms: createFakeHMMSearchResults(),
            sampleId: "test-sample",
            show: true,
            subtractionOptions: [createFakeSubtractionMinimal()],
            onAnalyze: vi.fn(),
            onHide: vi.fn(),
            onShortlistSubtractions: vi.fn(),
        };
    });

    it("should render", () => {
        renderWithProviders(<CreateAnalysis {...props} />);
        expect(screen.getByText("Analyze")).toBeInTheDocument();

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
        renderWithProviders(<CreateAnalysis {...props} />);
        expect(screen.getByText("Analyze")).toBeInTheDocument();

        await userEvent.click(await screen.findByRole("button", { name: "Start" }));
        expect(await screen.findByText("A reference must be selected")).toBeInTheDocument();
        expect(await screen.findByText("A workflow must be selected")).toBeInTheDocument();
    });

    it.each([
        ["Pathoscope", "pathoscope_bowtie"],
        ["NuVs", "nuvs"],
        ["Iimi", "iimi"],
    ])("should submit correct data for ", async (name, id) => {
        renderWithProviders(<CreateAnalysis {...props} />);

        await userEvent.click(screen.getByText(name));
        await userEvent.click(screen.getByText(props.subtractionOptions[0].name));
        await userEvent.click(screen.getByText(props.compatibleIndexes[0].reference.name));
        await userEvent.click(await screen.findByRole("button", { name: "Start" }));

        await waitFor(() =>
            expect(props.onAnalyze).toHaveBeenCalledWith(
                props.sampleId,
                [props.compatibleIndexes[0].reference.id],
                [props.subtractionOptions[0].id],
                props.accountId,
                id,
            ),
        );
    });
});
