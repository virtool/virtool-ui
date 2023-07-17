import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../../../tests/setupTests";
import { byteSize } from "../../../../utils/utils";
import { File } from "../File";

describe("<SubtractionFile />", () => {
    let props;

    beforeEach(() => {
        props = {
            file: {
                download_url: "/api/subtractions/xl8faqqz/files/subtraction.fa.gz",
                id: 1,
                name: "foo",
                size: 36461731,
                subtraction: "xl8faqqz",
                type: "fasta",
            },
        };
    });

    it("should render", () => {
        const { getByText } = renderWithProviders(<File {...props} />);

        expect(getByText(props.file.name)).toBeInTheDocument();
        expect(getByText(byteSize(props.file.size))).toBeInTheDocument();
    });
});
