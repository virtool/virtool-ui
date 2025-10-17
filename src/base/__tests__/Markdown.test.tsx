import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup";
import { describe, expect, it } from "vitest";
import Markdown from "../Markdown";

const markdown = `
# Heading 1
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
## Heading 2
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

### Table Example

| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Row 1    | Data 1   | Data 4   |
| Row 2    | Data 2   | Data 5   |
| Row 3    | Data 3   | Data 6   |
`;

describe("<Markdown />", () => {
    it("should render markdown", () => {
        renderWithProviders(<Markdown markdown={markdown} />);

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
            "Heading 1",
        );
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
            "Heading 2",
        );
        expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
            "Table Example",
        );
    });

    it("should render table", () => {
        renderWithProviders(<Markdown markdown={markdown} />);

        expect(screen.getByText("Header 1")).toBeInTheDocument();
        expect(screen.getByText("Header 2")).toBeInTheDocument();
        expect(screen.getByText("Header 3")).toBeInTheDocument();
        expect(screen.getByText("Row 1")).toBeInTheDocument();
        expect(screen.getByText("Row 2")).toBeInTheDocument();
        expect(screen.getByText("Row 3")).toBeInTheDocument();
        expect(screen.getByText("Data 1")).toBeInTheDocument();
        expect(screen.getByText("Data 2")).toBeInTheDocument();
        expect(screen.getByText("Data 3")).toBeInTheDocument();
        expect(screen.getByText("Data 4")).toBeInTheDocument();
        expect(screen.getByText("Data 5")).toBeInTheDocument();
        expect(screen.getByText("Data 6")).toBeInTheDocument();
    });
});
