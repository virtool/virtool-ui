import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeOTU, mockApiAddSequence } from "@tests/fake/otus";
import { renderWithMemoryRouter } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import AddGenomeSequence from "../AddGenomeSequence";

describe("<AddGenomeSequence>", () => {
    let props;
    let otu;

    beforeEach(() => {
        otu = createFakeOTU();
        props = {
            isolateId: otu.isolates[0].id,
            otuId: otu.id,
            sequences: otu.isolates[0].sequences,
            schema: otu.schema,
            refId: "test_ref_id",
        };
    });

    it("should update fields on typing", async () => {
        const scope = mockApiAddSequence(
            props.otuId,
            props.isolateId,
            "user_typed_accession",
            "user_typed_host",
            "user_typed_definition",
            "ATGRYKM",
            otu.schema[0].name,
        );
        renderWithMemoryRouter(<AddGenomeSequence {...props} />, [{ state: { addSequence: true } }]);

        expect(screen.getByText("Segment")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Accession (ID)" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Host" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Definition" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Sequence 0" })).toBeInTheDocument();

        await userEvent.click(screen.getByRole("combobox"));
        await userEvent.click(await screen.findByRole("option", { name: `${otu.schema[0].name}` }));
        await userEvent.type(screen.getByRole("textbox", { name: "Accession (ID)" }), "user_typed_accession");
        await userEvent.type(screen.getByRole("textbox", { name: "Host" }), "user_typed_host");
        await userEvent.type(screen.getByRole("textbox", { name: "Definition" }), "user_typed_definition");
        await userEvent.type(screen.getByRole("textbox", { name: "Sequence 0" }), "ATGRYKM");
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        scope.done();
    });
    it("should display errors when accession, definition, or sequence not defined", async () => {
        renderWithMemoryRouter(<AddGenomeSequence {...props} />, [{ state: { addSequence: true } }]);

        await userEvent.click(screen.getByRole("button", { name: "undo restore" }));
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.getAllByText("Required Field").length).toBe(3);
    });

    it("should display specific error when sequence contains chars !== ATCGNRYKM", async () => {
        renderWithMemoryRouter(<AddGenomeSequence {...props} />, [{ state: { addSequence: true } }]);

        await userEvent.type(screen.getByRole("textbox", { name: "Sequence 0" }), "atbcq");
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.getByText("Sequence should only contain the characters: ATCGNRYKM")).toBeInTheDocument();
    });

    it("should resume editing once form opened after submitting", async () => {
        const scope = mockApiAddSequence(
            props.otuId,
            props.isolateId,
            "user_typed_accession",
            "user_typed_host",
            "user_typed_definition",
            "ATGRYKM",
            otu.schema[0].name,
        );
        renderWithMemoryRouter(<AddGenomeSequence {...props} />, [{ state: { addSequence: true } }]);

        expect(screen.getByText("Segment")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Accession (ID)" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Host" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Definition" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Sequence 0" })).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: "undo restore" }));
        await userEvent.click(screen.getByRole("combobox"));
        await userEvent.click(await screen.findByRole("option", { name: `${otu.schema[0].name}` }));
        await userEvent.type(screen.getByRole("textbox", { name: "Accession (ID)" }), "user_typed_accession");
        await userEvent.type(screen.getByRole("textbox", { name: "Host" }), "user_typed_host");
        await userEvent.type(screen.getByRole("textbox", { name: "Definition" }), "user_typed_definition");
        await userEvent.type(screen.getByRole("textbox", { name: "Sequence 0" }), "ATGRYKM");
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        scope.done();

        renderWithMemoryRouter(<AddGenomeSequence {...props} />, [{ state: { addSequence: true } }]);
        expect(screen.getByText("Resumed editing draft sequence.")).toBeInTheDocument();
    });
});
