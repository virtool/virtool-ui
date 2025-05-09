import { byteSize } from "@app/utils";
import "@testing-library/jest-dom/extend-expect";
import { renderWithProviders } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import {
    SubtractionFileItem,
    SubtractionFileItemProps,
} from "../SubtractionFileItem";

describe("<SubtractionFile />", () => {
    let props: SubtractionFileItemProps;

    beforeEach(() => {
        props = {
            downloadUrl: "/api/subtractions/xl8faqqz/uploads/subtraction.fa.gz",
            name: "foo",
            size: 36461731,
        };
    });

    it("should render", () => {
        const { getByText } = renderWithProviders(
            <SubtractionFileItem {...props} />,
        );

        expect(getByText(props.name)).toBeInTheDocument();
        expect(getByText(byteSize(props.size))).toBeInTheDocument();
    });
});
