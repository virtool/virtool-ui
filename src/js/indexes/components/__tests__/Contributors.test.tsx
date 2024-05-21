import { screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../../tests/setupTests";
import Contributors from "../Contributors";

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
