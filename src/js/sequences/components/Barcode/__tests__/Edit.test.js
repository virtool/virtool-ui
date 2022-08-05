import userEvent from "@testing-library/user-event";
import { EditBarcodeSequence, castValues } from "../Edit";
import { createStore } from "redux";
import { screen, waitFor } from "@testing-library/react";

const createAppStore = state => () => createStore(state => state, state);

describe("<EditBarcodeSequence>", () => {
    let props;
    let state;

    beforeEach(() => {
        props = {
            isolateId: "test_isolate_id",
            otuId: "test_otu_id",
            id: "test_id",
            show: true,
            targets: [],
            onHide: jest.fn(),
            onSave: jest.fn(),
            initialAccession: "initialAccession",
            initialDefinition: "initialDefinition",
            initialHost: "initialHost",
            initialTargetName: "test_target_name",
            initialSequence: "ATAG"
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
                                    reference: { id: "85r8ucx8" }
                                }
                            ]
                        }
                    ]
                }
            },
            references: {
                detail: {
                    targets: [
                        {
                            description: "test_target_description",
                            length: 5,
                            name: "test_target_name",
                            required: false
                        },
                        {
                            description: "test_target_description_2",
                            length: 5,
                            name: "test_target_name_2",
                            required: false
                        }
                    ]
                }
            }
        };
    });

    it("should render all fields with current sequence data", () => {
        renderWithProviders(<EditBarcodeSequence {...props} />, createAppStore(state));
        expect(screen.getByText("Target")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "test_target_name test_target_description" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Accession (ID)" })).toHaveValue(props.initialAccession);
        expect(screen.getByRole("textbox", { name: "Host" })).toHaveValue(props.initialHost);
        expect(screen.getByRole("textbox", { name: "Definition" })).toHaveValue(props.initialDefinition);
        expect(screen.getByRole("textbox", { name: "Sequence 4" })).toHaveValue(props.initialSequence);
    });

    it("should submit correct data when all fields changed", async () => {
        renderWithProviders(<EditBarcodeSequence {...props} />, createAppStore(state));
        userEvent.click(screen.getByRole("button", { name: "test_target_name test_target_description" }));
        userEvent.click(screen.getByText("test_target_name_2"));
        userEvent.type(
            screen.getByRole("textbox", { name: "Accession (ID)" }),
            "{selectall}{delete}user_typed_accession"
        );
        userEvent.type(screen.getByRole("textbox", { name: "Host" }), "{selectall}{delete}user_typed_host");
        userEvent.type(screen.getByRole("textbox", { name: "Definition" }), "{selectall}{delete}user_typed_definition");
        userEvent.type(screen.getByRole("textbox", { name: "Sequence 4" }), "{selectall}{delete}ACG");

        userEvent.click(screen.getByRole("button", { name: "Save" }));
        await waitFor(() => {
            expect(props.onSave).toHaveBeenCalledWith(
                "test_otu_id",
                "test_isolate_id",
                "test_id",
                "user_typed_accession",
                "user_typed_definition",
                "user_typed_host",
                "ACG",
                "test_target_name_2"
            );
        });
    });
    it("should display errors when accession, definition, or sequence not defined", async () => {
        renderWithProviders(<EditBarcodeSequence {...props} />, createAppStore(state));
        userEvent.type(screen.getByRole("textbox", { name: "Accession (ID)" }), "{selectall}{delete}");
        userEvent.type(screen.getByRole("textbox", { name: "Definition" }), "{selectall}{delete}");
        userEvent.type(screen.getByRole("textbox", { name: "Sequence 4" }), "{selectall}{delete}");
        userEvent.click(screen.getByRole("button", { name: "Save" }));
        await waitFor(() => {
            expect(props.onSave).not.toHaveBeenCalled();
            expect(screen.getByRole("textbox", { name: "Accession (ID)" })).toHaveStyle("border: 1px solid #E0282E");
            expect(screen.getByRole("textbox", { name: "Definition" })).toHaveStyle("border: 1px solid #E0282E");
            expect(screen.getByRole("textbox", { name: "Sequence 0" })).toHaveStyle("border: 1px solid #E0282E");
            expect(screen.getAllByText("Required Field").length).toBe(3);
        });
    });

    it("should display specific error when sequence contains chars !== ATCGN", async () => {
        renderWithProviders(<EditBarcodeSequence {...props} />, createAppStore(state));
        userEvent.type(screen.getByRole("textbox", { name: "Sequence 4" }), "q");
        userEvent.click(screen.getByRole("button", { name: "Save" }));
        await waitFor(() => {
            expect(screen.getByRole("textbox", { name: "Sequence 5" })).toHaveStyle("border: 1px solid #E0282E");
            expect(screen.getByText("Sequence should only contain the characters: ATCGN")).toBeInTheDocument();
        });
    });
});

describe("castValues", () => {
    const targets = [
        {
            description: "test_target_description",
            length: 5,
            name: "test_target_name",
            required: false
        },
        {
            description: "test_target_description_2",
            length: 5,
            name: "test_target_name_2",
            required: false
        }
    ];

    const values = { targetName: "test_target_name", otherData: {} };

    it("should return unchanged values when segment in selectable segments", () => {
        const castedValues = castValues(targets)(values);
        expect(castedValues).toEqual(values);
    });
    it("should return values where segment: null when segment is not selectable", () => {
        values.targetName = "invalid_target";
        const castedValues = castValues(targets, "test_target_name_2")(values);
        expect(castedValues).toEqual({ ...values, targetName: "test_target_name_2" });
    });
});
