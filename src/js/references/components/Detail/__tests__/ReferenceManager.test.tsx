import References from "@references/components/References";
import { screen } from "@testing-library/react";
import { createFakeSettings, mockApiGetSettings } from "@tests/fake/admin";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import {
    createFakeReference,
    mockApiGetReferenceDetail,
} from "../../../../../tests/fake/references";
import { renderWithRouter } from "../../../../../tests/setup";

describe("<ReferenceManager />", () => {
    let reference;
    let path;

    beforeEach(() => {
        reference = createFakeReference();
        mockApiGetReferenceDetail(reference);
        mockApiGetSettings(createFakeSettings());
        path = `/refs/${reference.id}/manage`;
    });

    it("should render properly", async () => {
        renderWithRouter(<References />, path);

        expect(await screen.findByText("General")).toBeInTheDocument();
        expect(screen.getByText("Description")).toBeInTheDocument();
        expect(screen.getByText("Organism")).toBeInTheDocument();
        expect(screen.getByText("Data Type")).toBeInTheDocument();
        expect(screen.getByText("Latest Index Build")).toBeInTheDocument();
        expect(screen.getByText("No index builds found")).toBeInTheDocument();
        expect(screen.getByText("Contributors")).toBeInTheDocument();
        expect(screen.getByText("No contributors found")).toBeInTheDocument();
    });

    it("should render when [remotes_from=null]", async () => {
        renderWithRouter(<References />, path);

        expect(await screen.findByText("General")).toBeInTheDocument();
        expect(screen.queryByText("Remote Reference")).toBeNull();
    });

    it("should render when [cloned_from={ Bar: 'Bee' }]", async () => {
        renderWithRouter(<References />, path);

        expect(await screen.findByText("Clone Reference")).toBeInTheDocument();
        expect(screen.getByText("Source Reference"));
        expect(
            screen.getByText(reference.cloned_from.name),
        ).toBeInTheDocument();
    });
});
