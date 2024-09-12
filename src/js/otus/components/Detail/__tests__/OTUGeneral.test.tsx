import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeOTUIsolate } from "../../../../../tests/fake/otus";
import OTUGeneral from "../OTUGeneral";

describe("<OTUGeneral />", () => {
    let props;
    let isolate;

    beforeEach(() => {
        isolate = createFakeOTUIsolate();

        props = {
            issues: {
                empty_otu: false,
                empty_isolate: [isolate.id],
                empty_sequence: false,
                isolate_inconsistency: false,
            },
            isolates: [isolate],
        };
    });

    it("should render with issues", () => {
        renderWithProviders(<OTUGeneral {...props} />);

        expect(
            screen.getByText(
                "There are some issues that must be resolved before this OTU can be included in the next index build",
            ),
        ).toBeInTheDocument();
        expect(screen.getByText("There are no sequences associated with the following isolates:")).toBeInTheDocument();
        expect(screen.getByText(`${isolate.source_type} ${isolate.source_name}`, { exact: false })).toBeInTheDocument();
    });

    it("should render without issues", () => {
        props.issues = null;
        renderWithProviders(<OTUGeneral {...props} />);

        expect(
            screen.queryByText(
                "There are some issues that must be resolved before this OTU can be included in the next index build",
            ),
        ).toBeNull();
    });
});
