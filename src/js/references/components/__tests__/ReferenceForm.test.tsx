import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ReferenceForm } from "../ReferenceForm";

describe("<ReferenceForm />", () => {
    let props;

    beforeEach(() => {
        props = { errors: { name: { message: "Required Field" } }, mode: "clone", register: vi.fn() };
    });

    it("should render", () => {
        renderWithProviders(<ReferenceForm {...props} />);

        expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Description" })).toBeInTheDocument();
        expect(screen.queryByRole("textbox", { name: "Organism" })).toBeNull();
    });

    it("should render Organism when [mode=edit]", () => {
        props.mode = "edit";
        renderWithProviders(<ReferenceForm {...props} />);

        expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Description" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Organism" })).toBeInTheDocument();
    });

    it("should render Organism when [mode=empty]", () => {
        props.mode = "empty";
        renderWithProviders(<ReferenceForm {...props} />);

        expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Description" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Organism" })).toBeInTheDocument();
    });

    it("should render changes when inputs change", async () => {
        props.mode = "edit";
        renderWithProviders(<ReferenceForm {...props} />);

        await userEvent.clear(screen.getByRole("textbox", { name: "Name" }));
        await userEvent.type(screen.getByRole("textbox", { name: "Name" }), "newNameInput");
        expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("newNameInput");

        await userEvent.clear(screen.getByRole("textbox", { name: "Organism" }));
        await userEvent.type(screen.getByRole("textbox", { name: "Organism" }), "newOrganismInput");
        expect(screen.getByRole("textbox", { name: "Organism" })).toHaveValue("newOrganismInput");

        await userEvent.clear(screen.getByRole("textbox", { name: "Description" }));
        await userEvent.type(screen.getByRole("textbox", { name: "Description" }), "newDescriptionInput");
        expect(screen.getByRole("textbox", { name: "Description" })).toHaveValue("newDescriptionInput");
    });
});
