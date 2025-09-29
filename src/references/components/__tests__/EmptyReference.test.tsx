import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiCreateReference } from "@tests/fake/references";
import { renderWithProviders } from "@tests/setup";
import { describe, expect, it } from "vitest";
import EmptyReference from "../EmptyReference";

describe("<EmptyReference />", () => {
    it("should display error and block submission when name is empty", async () => {
        renderWithProviders(<EmptyReference />);

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.getByText("Required Field")).toBeInTheDocument();
    });

    it("should submit when name length is non-zero", async () => {
        const scope = mockApiCreateReference("Test Reference", "", "");

        renderWithProviders(<EmptyReference />);

        await userEvent.type(
            screen.getByRole("textbox", { name: "Name" }),
            "Test Reference",
        );
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        scope.done();
    });

    it("should submit all filled fields", async () => {
        const name = "Test Reference";
        const organism = "Virus";
        const description = "A collection of pathogenic virus genomes.";

        const scope = mockApiCreateReference(name, description, organism);
        renderWithProviders(<EmptyReference />);

        await userEvent.type(
            screen.getByRole("textbox", { name: "Name" }),
            name,
        );
        await userEvent.type(
            screen.getByRole("textbox", { name: "Organism" }),
            organism,
        );
        await userEvent.type(
            screen.getByRole("textbox", { name: "Description" }),
            description,
        );
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        scope.done();
    });
});
