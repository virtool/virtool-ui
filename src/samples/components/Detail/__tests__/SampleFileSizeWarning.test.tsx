import { screen } from "@testing-library/react";
import { createFakeSampleRead } from "@tests/fake/samples";
import { renderWithRouter } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import SampleFileSizeWarning from "../SampleFileSizeWarning";

describe("<SampleFileSizeWarning />", () => {
    let props;

    beforeEach(() => {
        props = {
            sampleId: "test",
            reads: [],
        };
    });

    it("should render", () => {
        props.reads = [createFakeSampleRead({ size: 5 })];
        renderWithRouter(<SampleFileSizeWarning {...props} />);

        expect(
            screen.getByText(
                "The read files in this sample are smaller than expected.",
            ),
        ).toBeInTheDocument();
        expect(screen.getByText("Check the file sizes")).toBeInTheDocument();
        expect(
            screen.getByText("and ensure they are correct."),
        ).toBeInTheDocument();
        expect(
            screen.queryByText(
                "Check the file sizes and ensure they are correct.",
            ),
        ).toBeNull();
    });

    it("should render when [show=false]", () => {
        props.reads = [createFakeSampleRead({ size: 10000000 })];
        renderWithRouter(<SampleFileSizeWarning {...props} />);

        expect(
            screen.queryByText(
                "The read files in this sample are smaller than expected.",
            ),
        ).toBeNull();
    });

    it("should render link when [showLink=true]", () => {
        props.reads = [createFakeSampleRead({ size: 5 })];
        renderWithRouter(<SampleFileSizeWarning {...props} />);

        expect(
            screen.getByText(
                "The read files in this sample are smaller than expected.",
            ),
        ).toBeInTheDocument();
        expect(screen.getByText("Check the file sizes")).toBeInTheDocument();
        expect(
            screen.queryByText(
                "Check the file sizes and ensure they are correct.",
            ),
        ).toBeNull();
    });

    it("should render link when [showLink=false]", () => {
        props.reads = [createFakeSampleRead({ size: 5 })];
        renderWithRouter(
            <SampleFileSizeWarning {...props} />,
            "/samples/test/files",
        );

        expect(
            screen.getByText(
                "The read files in this sample are smaller than expected.",
            ),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "Check the file sizes and ensure they are correct.",
            ),
        ).toBeInTheDocument();
        expect(screen.queryByText("Check the file sizes")).toBeNull();
    });
});
