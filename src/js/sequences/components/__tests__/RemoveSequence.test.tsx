import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeOTUSequence, mockApiRemoveSequence } from "../../../../tests/fake/otus";
import RemoveSequence from "../RemoveSequence";

describe("<RemoveSequence />", () => {
    let props;

    beforeEach(() => {
        props = {
            otuId: "foo",
            isolateId: "bar",
            isolateName: "baz",
            sequences: [createFakeOTUSequence()],
        };
    });

    it("should render when [show=true]", () => {
        renderWithRouter(<RemoveSequence {...props} />, `?removeSequence=${props.sequences[0].id}`);

        expect(screen.getByText("Remove Sequence")).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to remove the sequence/)).toBeInTheDocument();
        expect(screen.getByText(`${props.sequences[0].accession}`)).toBeInTheDocument();
        expect(screen.getByText(/baz?/)).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render when [show=false]", () => {
        renderWithRouter(<RemoveSequence {...props} />, "");

        expect(screen.queryByText("Remove Sequence")).toBeNull();
        expect(screen.queryByText(/Are you sure you want to remove the sequence from/)).toBeNull();
        expect(screen.queryByText(`${props.sequences[0].accession}`)).toBeNull();
        expect(screen.queryByText(/baz?/)).toBeNull();
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("should handle submit when onConfirm() on RemoveDialog is called", async () => {
        const scope = mockApiRemoveSequence(props.otuId, props.isolateId, props.sequences[0].id);
        renderWithRouter(<RemoveSequence {...props} />, `?removeSequence=${props.sequences[0].id}`);

        await userEvent.click(screen.getByRole("button"));

        scope.done();
    });
});
