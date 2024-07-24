import { screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../../../tests/setupTests";
import OTUIssues from "../OTUIssues";

describe("<OTUIssues />", () => {
    let props;

    it("renders correctly without issues", () => {
        props = {
            issues: {
                empty_otu: false,
                isolate_inconsistency: false,
                empty_isolate: false,
                empty_sequence: false,
            },
            isolates: [],
        };
        renderWithProviders(<OTUIssues {...props} />);

        expect(
            screen.getByText(
                "There are some issues that must be resolved before this OTU can be included in the next index build"
            )
        ).toBeInTheDocument();
    });

    it("renders correctly with issues", () => {
        props = {
            issues: {
                empty_otu: true,
                isolate_inconsistency: true,
                empty_isolate: ["test-isolate"],
                empty_sequence: [
                    {
                        _id: "test-sequence",
                        isolate_id: "test-isolate",
                    },
                ],
            },
            isolates: [
                {
                    id: "test-isolate",
                    source_type: "isolate",
                    source_name: "test",
                },
            ],
        };
        renderWithProviders(<OTUIssues {...props} />);

        expect(
            screen.getByText(
                "There are some issues that must be resolved before this OTU can be included in the next index build"
            )
        ).toBeInTheDocument();
        expect(screen.getByText("There are no isolates associated with this OTU")).toBeInTheDocument();
        expect(
            screen.getByText("Some isolates have different numbers of sequences than other isolates")
        ).toBeInTheDocument();
        expect(screen.getByText("There are no sequences associated with the following isolates:")).toBeInTheDocument();

        expect(screen.getByText("test-sequence")).toBeInTheDocument();
        expect(screen.getByText("in isolate")).toBeInTheDocument();

        const isolateName = screen.getAllByText("Isolate test");
        expect(isolateName.length).toBe(2);
    });
});
