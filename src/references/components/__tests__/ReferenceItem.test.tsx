import { screen } from "@testing-library/react";
import { createFakeReferenceMinimal } from "@tests/fake/references";
import { renderWithRouter } from "@tests/setup";
import { beforeEach, describe, expect, it } from "vitest";
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
        renderWithRouter(<ReferenceItem {...props} />);

        expect(screen.getByRole("progressbar")).toHaveAttribute(
            "data-value",
            "32",
        );
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
        renderWithRouter(<ReferenceItem {...props} />);

        expect(screen.queryByRole("progressbar")).toBeNull();
    });
});
