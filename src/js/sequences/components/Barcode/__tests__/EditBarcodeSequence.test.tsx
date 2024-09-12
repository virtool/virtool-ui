import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithMemoryRouter } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeOTUSequence, mockApiEditSequence } from "../../../../../tests/fake/otus";
import EditBarcodeSequence from "../EditBarcodeSequence";

describe("<EditBarcodeSequence>", () => {
    let props;

    beforeEach(() => {
        props = {
            activeSequence: createFakeOTUSequence({ sequence: "ACYG" }),
            isolateId: "test_isolate_id",
            otuId: "test_otu_id",
            targets: [{ description: "", length: 0, name: "test_target_name_2", required: false }],
        };
    });

    it("should render all fields with current sequence data", () => {
        renderWithMemoryRouter(<EditBarcodeSequence {...props} />, [{ state: { editSequence: true } }]);

        expect(screen.getByText("Target")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Accession (ID)" })).toHaveValue(props.activeSequence.accession);
        expect(screen.getByRole("textbox", { name: "Host" })).toHaveValue(props.activeSequence.host);
        expect(screen.getByRole("textbox", { name: "Definition" })).toHaveValue(props.activeSequence.definition);
        expect(screen.getByRole("textbox", { name: "Sequence 4" })).toHaveValue(props.activeSequence.sequence);
    });

    it("should submit correct data when all fields changed", async () => {
        const scope = mockApiEditSequence(
            props.otuId,
            props.isolateId,
            props.activeSequence.id,
            "user_typed_accession",
            "user_typed_definition",
            "user_typed_host",
            "ACGRM",
            "test_target_name_2",
        );
        renderWithMemoryRouter(<EditBarcodeSequence {...props} />, [{ state: { editSequence: true } }]);

        await userEvent.click(screen.getByRole("combobox"));
        await userEvent.click(screen.getByRole("option", { name: /test_target_name_2/ }));
        await userEvent.type(screen.getByRole("textbox", { name: "Accession (ID)" }), "user_typed_accession");
        await userEvent.type(screen.getByRole("textbox", { name: "Host" }), "user_typed_host");
        await userEvent.type(screen.getByRole("textbox", { name: "Definition" }), "user_typed_definition");
        await userEvent.type(screen.getByRole("textbox", { name: "Sequence 4" }), "ACGRM");

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        scope.done();
    });
    it("should display errors when accession, definition, or sequence not defined", async () => {
        renderWithMemoryRouter(<EditBarcodeSequence {...props} />, [{ state: { editSequence: true } }]);

        await userEvent.clear(screen.getByRole("textbox", { name: "Accession (ID)" }));
        await userEvent.clear(screen.getByRole("textbox", { name: "Definition" }));
        await userEvent.clear(screen.getByRole("textbox", { name: "Sequence 4" }));
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.getAllByText("Required Field").length).toBe(3);
    });

    it("should display specific error when sequence contains chars !== ATCGNRYKM", async () => {
        renderWithMemoryRouter(<EditBarcodeSequence {...props} />, [{ state: { editSequence: true } }]);

        await userEvent.type(screen.getByRole("textbox", { name: "Sequence 4" }), "q");
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.getByText("Sequence should only contain the characters: ATCGNRYKM")).toBeInTheDocument();
    });

    it("should resume editing once form opened after submitting", async () => {
        const scope = mockApiEditSequence(
            props.otuId,
            props.isolateId,
            props.activeSequence.id,
            "user_typed_accession",
            "user_typed_definition",
            "user_typed_host",
            "ACGRM",
            "test_target_name_2",
        );
        renderWithMemoryRouter(<EditBarcodeSequence {...props} />, [{ state: { editSequence: true } }]);

        await userEvent.click(screen.getByRole("combobox"));
        await userEvent.click(screen.getByRole("option", { name: /test_target_name_2/ }));
        await userEvent.type(screen.getByRole("textbox", { name: "Accession (ID)" }), "user_typed_accession");
        await userEvent.type(screen.getByRole("textbox", { name: "Host" }), "user_typed_host");
        await userEvent.type(screen.getByRole("textbox", { name: "Definition" }), "user_typed_definition");
        await userEvent.type(screen.getByRole("textbox", { name: "Sequence 4" }), "ACGRM");

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        scope.done();

        renderWithMemoryRouter(<EditBarcodeSequence {...props} />, [{ state: { editSequence: true } }]);
        expect(screen.getByText("Resumed editing draft sequence.")).toBeInTheDocument();
    });
});
