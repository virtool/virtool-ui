import { screen } from "@testing-library/react";
import { renderWithMemoryRouter } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeReference, mockApiGetReferenceDetail } from "../../../../../tests/fake/references";
import ReferenceManager from "../ReferenceManager";

describe("<ReferenceManager />", () => {
    let props;
    let reference;

    beforeEach(() => {
        reference = createFakeReference();
        mockApiGetReferenceDetail(reference);
        props = {
            match: { params: { refId: reference.id } },
        };
    });

    it("should render properly", async () => {
        renderWithMemoryRouter(<ReferenceManager {...props} />);

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
        renderWithMemoryRouter(<ReferenceManager {...props} />);

        expect(await screen.findByText("General")).toBeInTheDocument();
        expect(screen.queryByText("Remote Reference")).toBeNull();
    });

    it("should render when [cloned_from={ Bar: 'Bee' }]", async () => {
        renderWithMemoryRouter(<ReferenceManager {...props} />);

        expect(await screen.findByText("Clone Reference")).toBeInTheDocument();
        expect(screen.getByText("Source Reference"));
        expect(screen.getByText(reference.cloned_from.name)).toBeInTheDocument();
    });
});
