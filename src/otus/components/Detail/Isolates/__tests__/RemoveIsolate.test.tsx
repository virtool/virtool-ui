import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiRemoveIsolate } from "@tests/fake/otus";
import { renderWithProviders } from "@tests/setup";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

        expect(screen.getByText("Remove Isolate")).toBeInTheDocument();
        expect(
            screen.getByText(/Are you sure you want to remove/),
        ).toBeInTheDocument();
        expect(screen.getByText(/Foo?/)).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render with [show=false]", () => {
        props.show = false;
        renderWithProviders(<RemoveIsolate {...props} />);

        expect(screen.queryByText("Remove Isolate")).toBeNull();
        expect(
            screen.queryByText(/Are you sure you want to remove/),
        ).toBeNull();
        expect(screen.queryByText(/Foo?/)).toBeNull();
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("should handle submit when onConfirm() on <RemoveDialog /> is called", async () => {
        const scope = mockApiRemoveIsolate(props.otuId, props.id);
        renderWithProviders(<RemoveIsolate {...props} />);

        await userEvent.click(screen.getByRole("button"));
        await waitFor(() => expect(props.onHide).toHaveBeenCalled());

        scope.done();
    });
});
