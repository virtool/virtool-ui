import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeOTUSequence, mockApiEditSequence } from "../../../../../tests/fake/otus";
import { renderWithRouter } from "../../../../../tests/setupTests";
import EditBarcodeSequence, { castValues } from "../EditBarcodeSequence";

describe("<EditBarcodeSequence>", () => {
    let props;
    let history;

    beforeEach(() => {
        props = {
            activeSequence: createFakeOTUSequence({ sequence: "ACYG" }),
            isolateId: "test_isolate_id",
            otuId: "test_otu_id",
            targets: [{ description: "", length: 0, name: "test_target_name_2", required: false }],
        };
        history = createBrowserHistory();
    });

    it("should render all fields with current sequence data", () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { editSequence: true } }]}>
                <EditBarcodeSequence {...props} />
            </MemoryRouter>,
            {},
            history,
        );

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
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { editSequence: true } }]}>
                <EditBarcodeSequence {...props} />
            </MemoryRouter>,
            {},
            history,
        );

        await userEvent.click(screen.getByRole("combobox"));
        await userEvent.click(screen.getByText("test_target_name_2"));

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
        await userEvent.type(sequenceField, "ACGRM");

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        scope.done();
    });
    it("should display errors when accession, definition, or sequence not defined", async () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { editSequence: true } }]}>
                <EditBarcodeSequence {...props} />
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
                <EditBarcodeSequence {...props} />
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
    const targets = [
        {
            description: "test_target_description",
            length: 5,
            name: "test_target_name",
            required: false,
        },
        {
            description: "test_target_description_2",
            length: 5,
            name: "test_target_name_2",
            required: false,
        },
    ];

    const values = { targetName: "test_target_name", accession: "", definition: "", host: "", sequence: "" };

    it("should return unchanged values when segment in selectable segments", () => {
        const castedValues = castValues(targets, "test_target_name")(values);
        expect(castedValues).toEqual(values);
    });
    it("should return values where segment: null when segment is not selectable", () => {
        values.targetName = "invalid_target";
        const castedValues = castValues(targets, "test_target_name_2")(values);
        expect(castedValues).toEqual({ ...values, targetName: "test_target_name_2" });
    });
});
