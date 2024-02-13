import { configureStore } from "@reduxjs/toolkit";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../../../tests/setupTests";
import { AddBarcodeSequence, castValues } from "../AddBarcodeSequence";

function createAppStore(state) {
    return () =>
        configureStore({
            reducer: state => state,
            preloadedState: state,
        });
}

describe("<AddBarcodeSequence>", () => {
    let props;
    let state;

    beforeEach(() => {
        props = {
            isolateId: "test_isolate_id",
            otuId: "test_otu_id",
            show: true,
            defaultTarget: "test_target_name",
            targets: [],
            onHide: vi.fn(),
            onSave: vi.fn(),
        };
        state = {
            otus: {
                activeIsolateId: "test_isolate_id",
                detail: {
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
            references: {
                detail: {
                    targets: [
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
                    ],
                },
            },
        };
    });

    it("should render all fields", () => {
        renderWithProviders(<AddBarcodeSequence {...props} />, createAppStore(state));
        expect(screen.getByText("Target")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Accession (ID)" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Host" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Definition" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Sequence 0" })).toBeInTheDocument();
    });

    it("should submit correct data when all fields changed", async () => {
        renderWithProviders(<AddBarcodeSequence {...props} />, createAppStore(state));

        await userEvent.click(screen.getByRole("combobox"));
        await userEvent.click(screen.getByText("test_target_name_2"));
        await userEvent.type(screen.getByRole("textbox", { name: "Accession (ID)" }), "user_typed_accession");
        await userEvent.type(screen.getByRole("textbox", { name: "Host" }), "user_typed_host");
        await userEvent.type(screen.getByRole("textbox", { name: "Definition" }), "user_typed_definition");
        await userEvent.type(screen.getByRole("textbox", { name: "Sequence 0" }), "ATGRYK");

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(props.onSave).toHaveBeenCalledWith(
            "test_otu_id",
            "test_isolate_id",
            "user_typed_accession",
            "user_typed_definition",
            "user_typed_host",
            "ATGRYK",
            "test_target_name_2",
        );
    });
    it("should display errors when accession, definition, or sequence not defined", async () => {
        renderWithProviders(<AddBarcodeSequence {...props} />, createAppStore(state));

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(props.onSave).not.toHaveBeenCalled();
        expect(screen.getByRole("textbox", { name: "Accession (ID)" })).toHaveStyle("border: 1px solid #E0282E");
        expect(screen.getByRole("textbox", { name: "Definition" })).toHaveStyle("border: 1px solid #E0282E");
        expect(screen.getByRole("textbox", { name: "Sequence 0" })).toHaveStyle("border: 1px solid #E0282E");
        expect(screen.getAllByText("Required Field").length).toBe(3);
    });

    it("should display specific error when sequence contains chars !== ATCGNRYKM", async () => {
        renderWithProviders(<AddBarcodeSequence {...props} />, createAppStore(state));

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
