import { screen } from "@testing-library/react";
import { createBrowserHistory } from "history";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeReferenceMinimal } from "../../../../../tests/fake/references";
import { renderWithRouter } from "../../../../../tests/setupTests";
import { ReferenceItem } from "../ReferenceItem";

describe("<ReferenceItem />", () => {
    let props;
    let history;

    beforeEach(() => {
        props = {
            reference: {},
            task: {},
        };
        history = createBrowserHistory();
    });

    it("should render when [organism='virus'] and [progress=32]", async () => {
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
        renderWithRouter(<ReferenceItem {...props} />, {}, history);

        expect(screen.getByText(/virus/)).toBeInTheDocument();
        expect(screen.getByRole("progressbar")).toHaveValue(32);
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
        renderWithRouter(<ReferenceItem {...props} />, {}, history);

        expect(screen.getByText(/unknown/)).toBeInTheDocument();
    });

    it("should render when [progress=100]", () => {
        props.reference = createFakeReferenceMinimal({
            task: {
                complete: false,
                created_at: null,
                error: null,
                id: 1,
                progress: 100,
                step: "test step",
                type: "remote_reference",
            },
            organism: null,
        });
        renderWithRouter(<ReferenceItem {...props} />, {}, history);

        expect(screen.queryByRole("progressbar")).toBeNull();
    });
});
