import { AdministratorRoleName } from "@administration/types";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { createFakeHMMSearchResults, mockApiGetHmms } from "@tests/fake/hmm";
import {
    createFakeIndexMinimal,
    mockApiListIndexes,
} from "@tests/fake/indexes";
import { createFakeLabelNested, mockApiGetLabels } from "@tests/fake/labels";
import { createFakeMLModelMinimal, mockApiGetModels } from "@tests/fake/ml";
import {
    createFakeSampleMinimal,
    mockApiGetSamples,
} from "@tests/fake/samples";
import {
    createFakeShortlistSubtraction,
    mockApiGetShortlistSubtractions,
} from "@tests/fake/subtractions";
import { renderWithRouter } from "@tests/setup";
import React from "react";
import { describe, expect, it } from "vitest";
import SamplesList from "../SamplesList";

describe("<SamplesList />", () => {
    let samples;
    const path = "/samples";

    beforeEach(() => {
        samples = [createFakeSampleMinimal(), createFakeSampleMinimal()];
        mockApiGetSamples(samples);
        mockApiGetHmms(createFakeHMMSearchResults());
        mockApiListIndexes([createFakeIndexMinimal()]);
        mockApiGetLabels([createFakeLabelNested()]);
        mockApiGetModels([createFakeMLModelMinimal()]);
        mockApiGetShortlistSubtractions(
            [createFakeShortlistSubtraction()],
            true,
        );
    });

    it("should render correctly", async () => {
        renderWithRouter(<SamplesList />, path);
        expect(await screen.findByText("Samples")).toBeInTheDocument();

        expect(screen.getByText(samples[0].name)).toBeInTheDocument();
        expect(screen.getByText("Labels")).toBeInTheDocument();
    });

    it("should call onChange when search input changes in toolbar", async () => {
        renderWithRouter(<SamplesList />, path);
        expect(await screen.findByText("Samples")).toBeInTheDocument();

        const inputElement = screen.getByPlaceholderText("Sample name");
        expect(inputElement).toHaveValue("");

        await userEvent.type(inputElement, "Foo");
        expect(inputElement).toHaveValue("Foo");
    });

    it("should render create button when [canModify=true]", async () => {
        mockApiGetAccount(
            createFakeAccount({
                administrator_role: AdministratorRoleName.FULL,
            }),
        );
        renderWithRouter(<SamplesList />, path);

        expect(
            await screen.findByRole("link", { name: "Create" }),
        ).toBeInTheDocument();
    });

    it("should not render create button when [canModify=false]", () => {
        mockApiGetAccount(createFakeAccount({ administrator_role: null }));
        renderWithRouter(<SamplesList />, path);

        expect(
            screen.queryByRole("link", { name: "Create" }),
        ).not.toBeInTheDocument();
    });
});
