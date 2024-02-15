import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../../../../tests/setupTests";
import RemoveIsolate from "../RemoveIsolate";

describe("<RemoveIsolate />", () => {
    let props;

    beforeEach(() => {
        props = {
            id: "foo",
            name: "Foo",
            onHide: vi.fn(),
            otuId: "baz",
            show: true,
        };
    });

    it("should render with [show=true]", () => {
        renderWithProviders(<RemoveIsolate {...props} />);
    });

    it("should render with [show=false]", () => {
        props.show = false;
        renderWithProviders(<RemoveIsolate {...props} />);
    });

    it("should call onConfirm() when onConfirm() on <RemoveModal /> is called", () => {
        renderWithProviders(<RemoveIsolate {...props} />);
    });

    it("should call onHide() when onHide() on <RemoveModal /> is called", () => {
        renderWithProviders(<RemoveIsolate {...props} />);

        expect(props.onHide).toHaveBeenCalled();
    });
});
