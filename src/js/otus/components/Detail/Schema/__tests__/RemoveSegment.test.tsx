import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeOTU, mockApiEditOTU } from "../../../../../../tests/fake/otus";
import { renderWithMemoryRouter } from "../../../../../../tests/setupTests";
import RemoveSegment from "../RemoveSegment";

describe("<RemoveSegment />", () => {
    let props;
    let otu;

    beforeEach(() => {
        otu = createFakeOTU();
        props = {
            abbreviation: otu.abbreviation,
            name: otu.name,
            otuId: otu.id,
            schema: otu.schema,
        };
    });

    it("should render when [show=true]", () => {
        renderWithMemoryRouter(<RemoveSegment {...props} />, `?removeSegmentName=${props.schema[0].name}`);

        expect(screen.getByText("Remove Segment")).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to remove/)).toBeInTheDocument();
        expect(screen.getByText(`${props.schema[0].name}`)).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render when [show=false]", () => {
        renderWithMemoryRouter(<RemoveSegment {...props} />, "");

        expect(screen.queryByText("Remove Segment")).toBeNull();
        expect(screen.queryByText(/Are you sure you want to remove/)).toBeNull();
        expect(screen.queryByText(`${props.schema[0].name}`)).toBeNull();
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("should call onSubmit() when onConfirm() called on <RemoveDialog />", async () => {
        const scope = mockApiEditOTU(otu, {
            abbreviation: otu.abbreviation,
            name: otu.name,
            otuId: otu.d,
            schema: [props.schema[1]],
        });
        renderWithMemoryRouter(<RemoveSegment {...props} />, `?removeSegmentName=${props.schema[0].name}`);

        await userEvent.click(screen.getByRole("button"));

        scope.done();
    });

    it("should call onHide() when onHide() called on <RemoveDialog />", async () => {
        renderWithMemoryRouter(<RemoveSegment {...props} />, `?removeSegmentName=${props.schema[0].name}`);

        fireEvent.keyDown(document, { key: "Escape" });

        await waitFor(() => expect(screen.queryByText("Remove Segment")).toBeNull());
    });
});
