import { configureStore } from "@reduxjs/toolkit";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeOTU } from "../../../../../tests/fake/otus";
import { renderWithProviders, renderWithRouter } from "../../../../../tests/setupTests";
import AddGenomeSequence, { castValues } from "../AddGenomeSequence";

function createAppStore(state) {
    return () =>
        configureStore({
            reducer: state => state,
            preloadedState: state,
        });
}

describe("<AddGenomeSequence>", () => {
    let props;
    let state;
    let history;

    beforeEach(() => {
        const otu = createFakeOTU();

        props = {
            isolateId: otu.isolates[0].id,
            otuId: otu.id,
            segments: [],
        };
        state = {
            otus: {
                activeIsolateId: otu.isolates[0].id,
                detail: otu,
            },
        };
        history = createBrowserHistory();
    });

    it("should update fields on typing", async () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ state: { addSequence: true } }]}>
                <AddGenomeSequence {...props} />
            </MemoryRouter>,
            createAppStore(state),
            history,
        );

        expect(screen.getByText("Segment")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Accession (ID)" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Host" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Definition" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Sequence 0" })).toBeInTheDocument();

        await userEvent.click(screen.getByRole("combobox"));
        await userEvent.click(screen.getByText("test_segment"));
        await userEvent.type(screen.getByRole("textbox", { name: "Accession (ID)" }), "user_typed_accession");
        await userEvent.type(screen.getByRole("textbox", { name: "Host" }), "user_typed_host");
        await userEvent.type(screen.getByRole("textbox", { name: "Definition" }), "user_typed_definition");
        await userEvent.type(screen.getByRole("textbox", { name: "Sequence 0" }), "ATGRYKM");
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(props.onSave).toHaveBeenCalledWith(
            "test_otu_id",
            "test_isolate_id",
            "user_typed_accession",
            "user_typed_definition",
            "user_typed_host",
            "test_segment",
            "ATGRYKM",
        );
    });
    it("should display errors when accession, definition, or sequence not defined", async () => {
        renderWithProviders(<AddGenomeSequence {...props} />, createAppStore(state));

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(props.onSave).not.toHaveBeenCalled();
        expect(screen.getByRole("textbox", { name: "Accession (ID)" })).toHaveStyle("border: 1px solid #E0282E");
        expect(screen.getByRole("textbox", { name: "Definition" })).toHaveStyle("border: 1px solid #E0282E");
        expect(screen.getByRole("textbox", { name: "Sequence 0" })).toHaveStyle("border: 1px solid #E0282E");
        expect(screen.getAllByText("Required Field").length).toBe(3);
    });

    it("should display specific error when sequence contains chars !== ATCGNRYKM", async () => {
        renderWithProviders(<AddGenomeSequence {...props} />, createAppStore(state));

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
