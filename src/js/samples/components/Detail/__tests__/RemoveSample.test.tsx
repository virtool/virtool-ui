import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiRemoveSample } from "@tests/fake/samples";
import { renderWithRouter } from "@tests/setup";
import { formatPath } from "@utils/hooks";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import RemoveSample from "../RemoveSample";

describe("<RemoveSample />", () => {
    let props;
    let path;
    let searchParams;

    beforeEach(() => {
        props = {
            id: "foo",
            name: "test",
        };
        path = `/samples/${props.id}/general`;
        searchParams = { openRemoveSample: true };
    });

    it("renders when [show=true]", () => {
        renderWithRouter(
            <RemoveSample {...props} />,
            formatPath(path, searchParams),
        );

        expect(screen.getByText("Remove Sample")).toBeInTheDocument();
        expect(screen.getByText("test")).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders when [show=false]", () => {
        renderWithRouter(<RemoveSample {...props} />, path);

        expect(screen.queryByText("Remove Sample")).toBeNull();
        expect(screen.queryByText("test")).toBeNull();
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("should handle submit when onConfirm() on RemoveDialog is called", async () => {
        const scope = mockApiRemoveSample(props.id);
        renderWithRouter(
            <RemoveSample {...props} />,
            formatPath(path, searchParams),
        );

        await userEvent.click(screen.getByRole("button"));

        scope.done();
    });
});
