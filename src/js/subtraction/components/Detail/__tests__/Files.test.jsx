import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../../../tests/setupTests";
import SubtractionFiles from "../Files";

describe("<SubtractionFiles />", () => {
    let props;

    beforeEach(() => {
        props = {
            files: [
                {
                    download_url: "/api/subtractions/xl8faqqz/files/subtraction.fa.gz",
                    id: 1,
                    name: "foo",
                    size: 36461731,
                    subtraction: "xl8faqqz",
                    type: "fasta",
                },
                {
                    download_url: "/api/subtractions/k66fpdyy/files/subtraction.3.bt2",
                    id: 2,
                    name: "bar",
                    size: 3257,
                    subtraction: "k66fpdyy",
                    type: "bowtie2",
                },
            ],
        };
    });

    it("should render NoneFound when no files are supplied", () => {
        props.files = [];
        renderWithProviders(<SubtractionFiles {...props} />);

        expect(screen.getByText("No subtraction files found")).toBeInTheDocument();
    });

    it("should render", () => {
        renderWithProviders(<SubtractionFiles {...props} />);

        expect(screen.getByText("Files")).toBeInTheDocument();
        expect(screen.getByText("Data files available to workflows using this subtraction.")).toBeInTheDocument();
    });
});
