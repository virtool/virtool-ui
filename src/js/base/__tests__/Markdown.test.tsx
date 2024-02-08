import { screen } from "@testing-library/react";
import React from "react";
import { describe, it } from "vitest";
import { renderWithProviders } from "../../../tests/setupTests";
import { Markdown } from "../Markdown";

const markdown = `
# Heading 1
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
## Heading 2
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
`;

describe("<Markdown />", () => {
    it("should render markdown", () => {
        renderWithProviders(<Markdown markdown={markdown} />);

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Heading 1");
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Heading 2");
    });
});
