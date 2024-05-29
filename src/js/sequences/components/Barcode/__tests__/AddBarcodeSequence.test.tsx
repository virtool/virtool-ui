import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { mockApiAddSequence } from "../../../../../tests/fake/otus";
import { renderWithRouter } from "../../../../../tests/setupTests";
import AddBarcodeSequence, { castValues } from "../AddBarcodeSequence";

describe("<AddBarcodeSequence>", () => {
    let props;
    let history;

    beforeEach(() => {
        props = {
            isolateId: "test_isolate_id",
            otuId: "test_otu_id",
            targets: [
                { description: "", length: 0, name: "test_target_name_1", required: false },
                { description: "", length: 0, name: "test_target_name_2", required: false },
            ],
        };
        history = createBrowserHistory();
    });

    it("should render all fields", () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { addSequence: true } }]}>
                <AddBarcodeSequence {...props} />
            </MemoryRouter>,
            {},
            history,
        );

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
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { addSequence: true } }]}>
                <AddBarcodeSequence {...props} />
            </MemoryRouter>,
            {},
            history,
        );

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
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { addSequence: true } }]}>
                <AddBarcodeSequence {...props} />
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
                <AddBarcodeSequence {...props} />
            </MemoryRouter>,
            {},
            history,
        );

        await userEvent.type(screen.getByRole("textbox", { name: /Sequence/ }), "atbcq");
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.getByRole("textbox", { name: /Sequence/ })).toHaveStyle("border: 1px solid #E0282E");
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

    it("should return unchanged values when target in selectable targets", () => {
        const castedValues = castValues(targets, "test_target_name")(values);
        expect(castedValues).toEqual(values);
    });

    it("should return values where [target= null] when target is not selectable", () => {
        values.targetName = "invalid_target";
        const castedValues = castValues(targets, "test_target_name_2")(values);
        expect(castedValues).toEqual({ ...values, targetName: "test_target_name_2" });
    });
});
