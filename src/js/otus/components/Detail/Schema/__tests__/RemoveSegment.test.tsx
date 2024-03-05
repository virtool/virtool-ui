import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { times } from "lodash";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeOTUSegment } from "../../../../../../tests/fake/otus";
import { renderWithProviders } from "../../../../../../tests/setupTests";
import RemoveSegment from "../RemoveSegment";

describe("<RemoveSegment />", () => {
    let props;
    let schema;

    beforeEach(() => {
        schema = times(2, createFakeOTUSegment);
        props = {
            activeName: schema[0].name,
            show: true,
            onHide: vi.fn(),
            onSubmit: vi.fn(),
            schema: schema,
        };
    });

    it("should render when [show=true]", () => {
        renderWithProviders(<RemoveSegment {...props} />);

        expect(screen.getByText("Remove Segment")).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to remove/)).toBeInTheDocument();
        expect(screen.getByText(`${schema[0].name}`)).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render when [show=false]", () => {
        props.show = false;
        renderWithProviders(<RemoveSegment {...props} />);

        expect(screen.queryByText("Remove Segment")).toBeNull();
        expect(screen.queryByText(/Are you sure you want to remove/)).toBeNull();
        expect(screen.queryByText(`${schema[0].name}`)).toBeNull();
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("should call onSubmit() when onConfirm() called on <RemoveDialog />", async () => {
        renderWithProviders(<RemoveSegment {...props} />);

        await userEvent.click(screen.getByRole("button"));

        expect(props.onSubmit).toHaveBeenCalledWith([schema[1]]);
    });

    it("should call onHide() when onHide() called on <RemoveDialog />", () => {
        renderWithProviders(<RemoveSegment {...props} />);

        fireEvent.keyDown(document, { key: "Escape" });

        expect(props.onHide).toHaveBeenCalled();
    });
});
