import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiAddSequence } from "@tests/fake/otus";
import { renderWithMemoryRouter } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import AddBarcodeSequence from "../AddBarcodeSequence";

describe("<AddBarcodeSequence>", () => {
    let props;

    beforeEach(() => {
        props = {
            isolateId: "test_isolate_id",
            otuId: "test_otu_id",
            targets: [
                { description: "", length: 0, name: "test_target_name_1", required: false },
                { description: "", length: 0, name: "test_target_name_2", required: false },
            ],
        };
    });

    it("should render all fields", () => {
        renderWithMemoryRouter(<AddBarcodeSequence {...props} />, "?openAddSequence=true");

        expect(screen.getByText("Target")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Accession (ID)" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Host" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Definition" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Sequence 0" })).toBeInTheDocument();
    });

    it("should submit correct data when all fields changed", async () => {
        const scope = mockApiAddSequence(
            "test_otu_id",
            "test_isolate_id",
            "user_typed_accession",
            "user_typed_host",
            "user_typed_definition",
            "ATGRYK",
            undefined,
            "test_target_name_2",
        );
        renderWithMemoryRouter(<AddBarcodeSequence {...props} />, "?openAddSequence=true");

        await userEvent.click(screen.getByRole("combobox"));
        await userEvent.click(screen.getByText("test_target_name_2"));
        await userEvent.type(screen.getByRole("textbox", { name: "Accession (ID)" }), "user_typed_accession");
        await userEvent.type(screen.getByRole("textbox", { name: "Host" }), "user_typed_host");
        await userEvent.type(screen.getByRole("textbox", { name: "Definition" }), "user_typed_definition");
        await userEvent.type(screen.getByRole("textbox", { name: "Sequence 0" }), "ATGRYK");

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        scope.done();
    });

    it("should display errors when accession, definition, or sequence not defined", async () => {
        renderWithMemoryRouter(<AddBarcodeSequence {...props} />, "?openAddSequence=true");

        await userEvent.click(screen.getByRole("button", { name: "undo restore" }));
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.getAllByText("Required Field").length).toBe(3);
    });

    it("should display specific error when sequence contains chars !== ATCGNRYKM", async () => {
        renderWithMemoryRouter(<AddBarcodeSequence {...props} />, "?openAddSequence=true");

        await userEvent.type(screen.getByRole("textbox", { name: /Sequence/ }), "atbcq");
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.getByText("Sequence should only contain the characters: ATCGNRYKM")).toBeInTheDocument();
    });

    it("should resume editing once form opened after submitting", async () => {
        const scope = mockApiAddSequence(
            "test_otu_id",
            "test_isolate_id",
            "user_typed_accession",
            "user_typed_host",
            "user_typed_definition",
            "ATGRYK",
            undefined,
            "test_target_name_2",
        );
        renderWithMemoryRouter(<AddBarcodeSequence {...props} />, "?openAddSequence=true");

        await userEvent.click(screen.getByRole("button", { name: "undo restore" }));
        await userEvent.click(screen.getByRole("combobox"));
        await userEvent.click(screen.getByText("test_target_name_2"));
        await userEvent.type(screen.getByRole("textbox", { name: "Accession (ID)" }), "user_typed_accession");
        await userEvent.type(screen.getByRole("textbox", { name: "Host" }), "user_typed_host");
        await userEvent.type(screen.getByRole("textbox", { name: "Definition" }), "user_typed_definition");
        await userEvent.type(screen.getByRole("textbox", { name: "Sequence 0" }), "ATGRYK");

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        scope.done();

        renderWithMemoryRouter(<AddBarcodeSequence {...props} />, "?openAddSequence=true");
        expect(screen.getByText("Resumed editing draft sequence.")).toBeInTheDocument();
    });
});
