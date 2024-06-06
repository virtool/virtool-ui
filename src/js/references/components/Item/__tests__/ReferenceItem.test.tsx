import { screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeReferenceMinimal } from "../../../../../tests/fake/references";
import { renderWithMemoryRouter } from "../../../../../tests/setupTests";
import { ReferenceItem } from "../ReferenceItem";

describe("<ReferenceItem />", () => {
    let props;

    beforeEach(() => {
        props = {
            reference: {},
            task: {},
        };
    });

    it("should render when [organism='virus'] and [progress=32]", () => {
        props.reference = createFakeReferenceMinimal({
            task: {
                complete: false,
                created_at: null,
                error: null,
                id: 1,
                progress: 32,
                step: "test step",
                type: "remote_reference",
            },
            organism: "virus",
        });
        renderWithMemoryRouter(<ReferenceItem {...props} />);

        expect(screen.getByText(/virus/)).toBeInTheDocument();
        expect(screen.getByRole("progressbar")).toHaveAttribute("data-value", "32");
    });

    it("should render when [organism=null]", () => {
        props.reference = createFakeReferenceMinimal({
            task: {
                complete: false,
                created_at: null,
                error: null,
                id: 1,
                progress: 32,
                step: "test step",
                type: "remote_reference",
            },
            organism: null,
        });
        renderWithMemoryRouter(<ReferenceItem {...props} />);

        expect(screen.getByText(/unknown/)).toBeInTheDocument();
    });

    it("should render when [progress=100]", () => {
        props.reference = createFakeReferenceMinimal({
            task: {
                complete: true,
                created_at: null,
                error: null,
                id: 1,
                progress: 100,
                step: "test step",
                type: "remote_reference",
            },
            organism: null,
        });
        renderWithMemoryRouter(<ReferenceItem {...props} />);

        expect(screen.queryByRole("progressbar")).toBeNull();
        expect(screen.getByLabelText("clone")).toBeInTheDocument();
    });
});
