import { AdministratorRoles } from "@administration/types";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { createFakeAccount, mockAPIGetAccount } from "../../../../tests/fake/account";
import { createFakeHMMSearchResults, mockApiGetHmms } from "../../../../tests/fake/hmm";
import { createFakeIndexMinimal, mockApiListIndexes } from "../../../../tests/fake/indexes";
import { createFakeLabelNested, mockApiGetLabels } from "../../../../tests/fake/labels";
import { createFakeMLModelMinimal, mockApiGetModels } from "../../../../tests/fake/ml";
import { createFakeSampleMinimal, mockApiGetSamples } from "../../../../tests/fake/samples";
import { createFakeShortlistSubtraction, mockApiGetShortlistSubtractions } from "../../../../tests/fake/subtractions";
import { renderWithRouter } from "../../../../tests/setupTests";
import SamplesList from "../SamplesList";

describe("<SamplesList />", () => {
    let history;
    let samples;

    beforeEach(() => {
        history = createBrowserHistory();
        samples = [createFakeSampleMinimal(), createFakeSampleMinimal()];
        mockApiGetSamples(samples);
        mockApiGetHmms(createFakeHMMSearchResults());
        mockApiListIndexes([createFakeIndexMinimal()]);
        mockApiGetLabels([createFakeLabelNested()]);
        mockApiGetModels([createFakeMLModelMinimal()]);
        mockApiGetShortlistSubtractions([createFakeShortlistSubtraction()], true);
    });

    it("should render correctly", async () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ key: "test", pathname: "/samples" }]}>
                <SamplesList />
            </MemoryRouter>,
            {},
            history,
        );
        expect(await screen.findByText("Samples")).toBeInTheDocument();

        expect(screen.getByText(samples[0].name)).toBeInTheDocument();
        expect(screen.getByText("Labels")).toBeInTheDocument();
    });

    it("should call onChange when search input changes in toolbar", async () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ key: "test", pathname: "/samples" }]}>
                <SamplesList />
            </MemoryRouter>,
            {},
            history,
        );
        expect(await screen.findByText("Samples")).toBeInTheDocument();

        const inputElement = screen.getByPlaceholderText("Sample name");
        expect(inputElement).toHaveValue("");

        await userEvent.type(inputElement, "Foo");
        expect(inputElement).toHaveValue("Foo");
    });

    it("should render create button when [canModify=true]", async () => {
        mockAPIGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        renderWithRouter(<SamplesList />, {}, history);

        expect(await screen.findByRole("link", { name: "Create" })).toBeInTheDocument();
    });

    it("should not render create button when [canModify=false]", async () => {
        mockAPIGetAccount(createFakeAccount({ administrator_role: null }));

        renderWithRouter(<SamplesList />, {}, history);

        expect(screen.queryByRole("link", { name: "Create" })).not.toBeInTheDocument();
    });
});
