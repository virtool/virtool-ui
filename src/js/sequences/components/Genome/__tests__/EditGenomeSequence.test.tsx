import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeOTUSequence, mockApiEditSequence } from "../../../../../tests/fake/otus";
import { renderWithRouter } from "../../../../../tests/setupTests";
import EditGenomeSequence, { castValues } from "../EditGenomeSequence";

describe("<EditGenomeSequence>", () => {
    let props;
    let history;

    beforeEach(() => {
        props = {
            activeSequence: createFakeOTUSequence({ sequence: "ACGY" }),
            isolateId: "test_isolate_id",
            otuId: "test_otu_id",
            hasSchema: true,
            segments: [],
            refId: "test_ref_id",
        };
        history = createBrowserHistory();
    });

    it("should render all fields with current sequence data", () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { editSequence: true } }]}>
                <EditGenomeSequence {...props} />
            </MemoryRouter>,
            {},
            history,
        );

        expect(screen.getByText("Segment")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Accession (ID)" })).toHaveValue(props.initialAccession);
        expect(screen.getByRole("textbox", { name: "Host" })).toHaveValue(props.initialHost);
        expect(screen.getByRole("textbox", { name: "Definition" })).toHaveValue(props.initialDefinition);
        expect(screen.getByRole("textbox", { name: "Sequence 4" })).toHaveValue(props.initialSequence);
    });

    it("should submit correct data when all fields changed", async () => {
        const scope = mockApiEditSequence(
            props.otuId,
            props.isolateId,
            props.activeSequence.id,
            "user_typed_accession",
            "user_typed_definition",
            "user_typed_host",
            null,
            "ACGRYKM",
        );
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { editSequence: true } }]}>
                <EditGenomeSequence {...props} />
            </MemoryRouter>,
            {},
            history,
        );

        await userEvent.click(screen.getByRole("combobox"));
        await userEvent.click(screen.getByRole("option", { name: "None" }));

        const accessionField = screen.getByRole("textbox", { name: "Accession (ID)" });
        await userEvent.clear(accessionField);
        await userEvent.type(accessionField, "user_typed_accession");

        const hostField = screen.getByRole("textbox", { name: "Host" });
        await userEvent.clear(hostField);
        await userEvent.type(hostField, "user_typed_host");

        const definitionField = screen.getByRole("textbox", { name: "Definition" });
        await userEvent.clear(definitionField);
        await userEvent.type(definitionField, "user_typed_definition");

        const sequenceField = screen.getByRole("textbox", { name: "Sequence 4" });
        await userEvent.clear(sequenceField);
        await userEvent.type(sequenceField, "ACGRYKM");

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        scope.done();
    });

    it("should display errors when accession, definition, or sequence not defined", async () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { editSequence: true } }]}>
                <EditGenomeSequence {...props} />
            </MemoryRouter>,
            {},
            history,
        );

        await userEvent.clear(screen.getByRole("textbox", { name: "Accession (ID)" }));
        await userEvent.clear(screen.getByRole("textbox", { name: "Definition" }));
        await userEvent.clear(screen.getByRole("textbox", { name: "Sequence 4" }));
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.getByRole("textbox", { name: "Accession (ID)" })).toHaveStyle("border: 1px solid #E0282E");
        expect(screen.getByRole("textbox", { name: "Definition" })).toHaveStyle("border: 1px solid #E0282E");
        expect(screen.getByRole("textbox", { name: "Sequence 0" })).toHaveStyle("border: 1px solid #E0282E");
        expect(screen.getAllByText("Required Field").length).toBe(3);
    });

    it("should display specific error when sequence contains chars !== ATCGNRYKM", async () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { editSequence: true } }]}>
                <EditGenomeSequence {...props} />
            </MemoryRouter>,
            {},
            history,
        );

        await userEvent.type(screen.getByRole("textbox", { name: "Sequence 4" }), "q");
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.getByRole("textbox", { name: "Sequence 5" })).toHaveStyle("border: 1px solid #E0282E");
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
