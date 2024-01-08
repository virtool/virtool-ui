import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it } from "vitest";
import { mockApiCreateReference } from "../../../../tests/fake/references";
import { renderWithProviders } from "../../../../tests/setupTests";
import EmptyReference from "../EmptyReference";

describe("<EmptyReference />", () => {
    it("should display error and block submission when name textbox is empty", async () => {
        renderWithProviders(<EmptyReference />);

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.getByText("Required Field")).toBeInTheDocument();
    });

    it("handleSubmit should call onSubmit when [name.length!=0] and [dataType.length!=0]", async () => {
        const scope = mockApiCreateReference("test_name", "", "genome", "");
        renderWithProviders(<EmptyReference />);

        await userEvent.type(screen.getByRole("textbox", { name: "Name" }), "test_name");
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        scope.done();
    });

    it("handleSubmit should submit correct dataType when changed", async () => {
        const scope = mockApiCreateReference("test_name", "", "barcode", "");
        renderWithProviders(<EmptyReference />);

        await userEvent.type(screen.getByRole("textbox", { name: "Name" }), "test_name");
        await userEvent.click(screen.getByRole("button", { name: "Barcode Target sequences for barcode analysis" }));
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        scope.done();
    });

    it("handleSubmit should call onSubmit when [name.length!=0] and [dataType.length!=0]", async () => {
        const name = "test_name";
        const organism = "test_organism";
        const dataType = "genome";
        const description = "test_description";

        const scope = mockApiCreateReference(name, description, dataType, organism);
        renderWithProviders(<EmptyReference />);

        await userEvent.type(screen.getByRole("textbox", { name: "Name" }), name);
        await userEvent.type(screen.getByRole("textbox", { name: "Organism" }), organism);
        await userEvent.type(screen.getByRole("textbox", { name: "Description" }), description);
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        scope.done();
    });

    describe("<ReferenceForm />", () => {
        it("should render", async () => {
            renderWithProviders(<EmptyReference />);

            await userEvent.click(screen.getByRole("button", { name: "Save" }));

            expect(screen.getByText("Required Field")).toBeInTheDocument();
        });
    });
});
