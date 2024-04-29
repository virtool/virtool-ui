import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeOTU, mockApiAddSequence } from "../../../../../tests/fake/otus";
import { renderWithRouter } from "../../../../../tests/setupTests";
import AddGenomeSequence, { castValues } from "../AddGenomeSequence";

describe("<AddGenomeSequence>", () => {
    let props;
    let history;
    let otu;

    beforeEach(() => {
        otu = createFakeOTU();
        console.log(otu);
        props = {
            isolateId: otu.isolates[0].id,
            otuId: otu.id,
            sequences: otu.isolates[0].sequences,
            schema: otu.schema,
        };
        history = createBrowserHistory();
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
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { addSequence: true } }]}>
                <AddGenomeSequence {...props} />
            </MemoryRouter>,
            {},
            history,
        );

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
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { addSequence: true } }]}>
                <AddGenomeSequence {...props} />
            </MemoryRouter>,
            {},
            history,
        );
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.getByRole("textbox", { name: "Accession (ID)" })).toHaveStyle("border: 1px solid #E0282E");
        expect(screen.getByRole("textbox", { name: "Definition" })).toHaveStyle("border: 1px solid #E0282E");
        expect(screen.getByRole("textbox", { name: "Sequence 0" })).toHaveStyle("border: 1px solid #E0282E");
        expect(screen.getAllByText("Required Field").length).toBe(3);
    });

    it("should display specific error when sequence contains chars !== ATCGNRYKM", async () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { addSequence: true } }]}>
                <AddGenomeSequence {...props} />
            </MemoryRouter>,
            {},
            history,
        );
        const field = screen.getByRole("textbox", { name: /Sequence/ });

        await userEvent.type(field, "atbcq");
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(field).toHaveStyle("border: 1px solid #E0282E");
        expect(screen.getByText("Sequence should only contain the characters: ATCGNRYKM")).toBeInTheDocument();
    });
});

describe("castValues", () => {
    const segments = [
        { name: "test_1", molecule: null, required: true },
        { name: "test_2", molecule: null, required: true },
    ];

    const values = { segment: "test_1", sequence: "", accession: "", definition: "", host: "" };

    it("should return unchanged values when segment in selectable segments", () => {
        const castedValues = castValues(segments)(values);
        expect(castedValues).toEqual(values);
    });

    it("should return values where segment: null when segment is not selectable", () => {
        values.segment = "invalid_segment";
        const castedValues = castValues(segments)(values);
        expect(castedValues).toEqual({ ...values, segment: null });
    });
});
