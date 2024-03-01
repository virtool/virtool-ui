import { screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../../../tests/setupTests";
import SampleFileSizeWarning from "../SampleFileSizeWarning";

describe("<SampleFileSizeWarning />", () => {
    let props;

    beforeEach(() => {
        props = {
            sampleId: "foo",
            show: true,
            showLink: true,
        };
    });

    it("should render", () => {
        renderWithProviders(
            <MemoryRouter>
                <SampleFileSizeWarning {...props} />
            </MemoryRouter>,
        );

        expect(screen.getByText("The read files in this sample are smaller than expected.")).toBeInTheDocument();
        expect(screen.getByText("Check the file sizes")).toBeInTheDocument();
        expect(screen.getByText("and ensure they are correct.")).toBeInTheDocument();
        expect(screen.queryByText("Check the file sizes and ensure they are correct.")).toBeNull();
    });

    it("should render when [show=false]", () => {
        props.show = false;
        renderWithProviders(
            <MemoryRouter>
                <SampleFileSizeWarning {...props} />
            </MemoryRouter>,
        );

        expect(screen.queryByText("The read files in this sample are smaller than expected.")).toBeNull();
    });

    it("should not render link when [showLink=false]", () => {
        props.showLink = false;
        renderWithProviders(
            <MemoryRouter>
                <SampleFileSizeWarning {...props} />
            </MemoryRouter>,
        );

        expect(screen.getByText("The read files in this sample are smaller than expected.")).toBeInTheDocument();
        expect(screen.getByText("Check the file sizes and ensure they are correct.")).toBeInTheDocument();
    });
});
