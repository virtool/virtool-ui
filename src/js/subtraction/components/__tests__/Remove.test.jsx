import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeSubtraction } from "../../../../tests/fake/subtractions";
import { renderWithProviders } from "../../../../tests/setupTests";
import { PUSH_STATE, REMOVE_SUBTRACTION } from "../../../app/actionTypes";
import { routerLocationHasState } from "../../../utils/utils";
import { mapDispatchToProps, mapStateToProps, RemoveSubtraction } from "../Remove";

vi.mock("../../../utils/utils.js");

describe("<RemoveSubtraction />", () => {
    const subtraction = createFakeSubtraction();
    let props;

    beforeEach(() => {
        props = {
            show: true,
            subtraction: subtraction,
            onHide: vi.fn(),
            onConfirm: vi.fn(),
        };
    });

    it("should render when [show=true]", () => {
        renderWithProviders(<RemoveSubtraction {...props} />);

        expect(screen.getByText("Remove Subtraction")).toBeInTheDocument();
    });

    it("should render when [show=false]", () => {
        props.show = false;
        renderWithProviders(<RemoveSubtraction {...props} />);

        expect(screen.queryByText("Remove Subtraction")).toBeNull();
    });

    it("should call onConfirm() when onConfirm() on <RemoveModal /> is called", async () => {
        renderWithProviders(<RemoveSubtraction {...props} />);

        await userEvent.click(screen.getByRole("button", { name: "Confirm" }));
        expect(props.onConfirm).toHaveBeenCalledWith(subtraction.id);
    });

    it("should call onHide() when onHide() on <RemoveModal /> is called", async () => {
        renderWithProviders(<RemoveSubtraction {...props} />);

        await userEvent.click(screen.getByRole("button", { name: "close" }));
        expect(props.onHide).toHaveBeenCalled();
    });
});

describe("mapStateToProps()", () => {
    it.each([true, false])("should return props when routerLocationHasState() returns %p", show => {
        routerLocationHasState.mockReturnValue(show);
        const props = mapStateToProps();
        expect(props).toEqual({
            show,
        });
    });
});

describe("mapDispatchToProps", () => {
    let dispatch;
    let props;

    beforeEach(() => {
        dispatch = vi.fn();
        props = mapDispatchToProps(dispatch);
    });

    it("should return onHide() in props", () => {
        props.onHide();
        expect(dispatch).toHaveBeenCalledWith({
            type: PUSH_STATE,
            payload: { state: { removeSubtraction: false } },
        });
    });

    it("should return onConfirm() in props", () => {
        props.onConfirm("foo");
        expect(dispatch).toHaveBeenCalledWith({
            type: REMOVE_SUBTRACTION.REQUESTED,
            payload: { subtractionId: "foo" },
        });
    });
});
