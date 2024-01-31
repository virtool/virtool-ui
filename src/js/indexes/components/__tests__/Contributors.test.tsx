import React from "react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../../tests/setupTests";
import { Contributors, mapStateToProps } from "../Contributors";

describe("<Contributors />", () => {
    it("should render", () => {
        const props = {
            contributors: [
                { id: "987zyx", handle: "bill", count: 22 },
                { id: "123abc", handle: "bob", count: 5 },
                { id: "bnm123", handle: "linda", count: 12 },
            ],
        };

        renderWithProviders(<Contributors {...props} />);

        const bill = screen.getByText("bill");

        expect(bill).toBeInTheDocument();
        expect(bill).toHaveTextContent("22 changes");

        const bob = screen.getByText("bob");

        expect(bob).toBeInTheDocument();
        expect(bob).toHaveTextContent("5 changes");

        const linda = screen.getByText("linda");

        expect(linda).toBeInTheDocument();
        expect(linda).toHaveTextContent("12 changes");
    });
});

describe("mapStateToProps()", () => {
    it("should return props", () => {
        const contributors = [
            { id: "bob", count: 5 },
            { id: "fred", count: 12 },
        ];

        const result = mapStateToProps({
            indexes: {
                detail: {
                    contributors,
                },
            },
        });

        expect(result).toEqual({ contributors });
    });
});
