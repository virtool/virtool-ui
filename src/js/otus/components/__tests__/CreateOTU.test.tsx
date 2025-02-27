import References from "@references/components/References";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeSettings, mockApiGetSettings } from "@tests/fake/admin";
import {
    createFakeReference,
    mockApiGetReferenceDetail,
} from "@tests/fake/references";
import { renderWithRouter } from "@tests/setup";
import { formatPath } from "@utils/hooks";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import {
    createFakeOTUMinimal,
    mockApiCreateOTU,
    mockApiGetOTUs,
} from "../../../../tests/fake/otus";

describe("<OTUForm />", () => {
    let path;
    let reference;

    beforeEach(() => {
        reference = createFakeReference();
        mockApiGetReferenceDetail(reference);
        mockApiGetOTUs([createFakeOTUMinimal()], reference.id);
        mockApiGetSettings(createFakeSettings());

        path = formatPath(`/refs/${reference.id}/otus`, {
            openCreateOTU: true,
        });
    });

    it("should render", async () => {
        renderWithRouter(<References />, path);

        expect(await screen.findByText("Create OTU")).toBeInTheDocument();
        expect(screen.getByLabelText("Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Abbreviation")).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render error once submitted with no name", async () => {
        renderWithRouter(<References />, path);

        await userEvent.click(await screen.findByRole("button"));
        expect(screen.getByText("Name required")).toBeInTheDocument();
    });

    it("should create OTU without abbreviation", async () => {
        const scope = mockApiCreateOTU(reference.id, "TestName", "");
        renderWithRouter(<References />, path);

        await userEvent.type(await screen.findByLabelText("Name"), "TestName");
        await userEvent.click(screen.getByRole("button"));

        scope.done();
    });

    it("should create OTU with abbreviation", async () => {
        const scope = mockApiCreateOTU(
            reference.id,
            "TestName",
            "TestAbbreviation",
        );
        renderWithRouter(<References />, path);

        await userEvent.type(await screen.findByLabelText("Name"), "TestName");
        await userEvent.type(
            screen.getByLabelText("Abbreviation"),
            "TestAbbreviation",
        );
        await userEvent.click(screen.getByRole("button"));

        scope.done();
    });
});
