import { configureStore } from "@reduxjs/toolkit";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../../../tests/setupTests";
import { AddGenomeSequence, castValues } from "../AddGenomeSequence";

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

    beforeEach(() => {
        props = {
            isolateId: "test_isolate_id",
            otuId: "test_otu_id",
            show: true,
            segments: [],
            onHide: vi.fn(),
            onSave: vi.fn(),
        };
        state = {
            otus: {
                activeIsolateId: "test_isolate_id",
                detail: {
                    schema: [{ name: "test_segment", molecule: "", required: true }],
                    isolates: [
                        {
                            default: true,
                            id: "test_isolate_id",
                            name: "test_isolate_name",
                            sequences: [
                                {
                                    accession: "NC_010317",
                                    definition: "Abaca bunchy top virus DNA-M, complete genome",
                                    host: "Musa sp.",
                                    sequence:
                                        "GGGGCTGGGGCTTATTATTACCCCCAGCCCCGGAACGGGACATCACGTGTATTCTCTATAGTGGTGGGTCATATGTCCCGAGTTAGTGCGCCACGTAA",
                                    segment: "",
                                    id: "0r0vmzt4",
                                    reference: { id: "85r8ucx8" },
                                },
                            ],
                        },
                    ],
                },
            },
        };
    });

    it("should update fields on typing", async () => {
        renderWithProviders(<AddGenomeSequence {...props} />, createAppStore(state));

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
        expect(castedValues).toEqual({ ...values, segment: "" });
    });
});
