import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeOTU, mockApiEditSequence, mockApiGetOTU } from "../../../../../tests/fake/otus";
import { createFakeReference, mockApiGetReferenceDetail } from "@tests/fake/references";
import { createFakeSettings, mockApiGetSettings } from "@tests/fake/admin";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { AdministratorRoles } from "@administration/types";
import { formatPath } from "@utils/hooks";
import References from "@references/components/References";

describe("<EditBarcodeSequence>", () => {
    let props;
    let reference;
    let otu;
    let path;
    let activeSequence;

    beforeEach(() => {
        reference = createFakeReference({
            data_type: "barcode",
            targets: [
                { description: "", length: 0, name: "test_target_name_1", required: false },
                { description: "", length: 0, name: "test_target_name_2", required: false },
            ],
        });
        mockApiGetReferenceDetail(reference);
        otu = createFakeOTU();
        activeSequence = otu.isolates[0].sequences[0];
        mockApiGetOTU(otu);
        mockApiGetSettings(createFakeSettings());
        mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));

        path = formatPath(`/refs/${reference.id}/otus/${otu.id}/otu`, { openEditSequence: activeSequence.id });
        props = {
            activeSequence: "derp",
            isolateId: "test_isolate_id",
            otuId: "test_otu_id",
            targets: [{ description: "", length: 0, name: "test_target_name_2", required: false }],
        };
    });

    afterEach(() => window.sessionStorage.clear());

    it("should render all fields with current sequence data", async () => {
        renderWithRouter(<References />, path);

        expect(await screen.findByText("Target")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Accession (ID)" })).toHaveValue(activeSequence.accession);
        expect(screen.getByRole("textbox", { name: "Host" })).toHaveValue(activeSequence.host);
        expect(screen.getByRole("textbox", { name: "Definition" })).toHaveValue(activeSequence.definition);
        expect(screen.getByRole("textbox", { name: /Sequence/ })).toHaveValue(activeSequence.sequence);
    });

    it("should submit correct data when all fields changed", async () => {
        const scope = mockApiEditSequence(
            otu.id,
            otu.isolates[0].id,
            activeSequence.id,
            "user_typed_accession",
            "user_typed_definition",
            "user_typed_host",
            "ACGRM",
            undefined,
            "test_target_name_2",
        );
        renderWithRouter(<References />, path);

        await userEvent.click(await screen.findByRole("combobox"));
        await userEvent.click(screen.getByRole("option", { name: /test_target_name_2/ }));
        await userEvent.clear(screen.getByRole("textbox", { name: "Accession (ID)" }));
        await userEvent.type(screen.getByRole("textbox", { name: "Accession (ID)" }), "user_typed_accession");
        await userEvent.clear(screen.getByRole("textbox", { name: "Host" }));
        await userEvent.type(screen.getByRole("textbox", { name: "Host" }), "user_typed_host");
        await userEvent.clear(screen.getByRole("textbox", { name: "Definition" }));
        await userEvent.type(screen.getByRole("textbox", { name: "Definition" }), "user_typed_definition");
        await userEvent.clear(screen.getByRole("textbox", { name: /Sequence [0-9]+/ }));
        await userEvent.type(screen.getByRole("textbox", { name: /Sequence [0-9]+/ }), "ACGRM");

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        await waitFor(() => scope.done());
    });
    it("should display errors when accession, definition, or sequence not defined", async () => {
        renderWithRouter(<References {...props} />, path);

        await userEvent.clear(await screen.findByRole("textbox", { name: "Accession (ID)" }));
        await userEvent.clear(screen.getByRole("textbox", { name: "Definition" }));
        await userEvent.clear(screen.getByRole("textbox", { name: /Sequence [0-9]+/ }));
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.getAllByText("Required Field").length).toBe(3);
    });

    it("should display specific error when sequence contains chars !== ATCGNRYKM", async () => {
        renderWithRouter(<References />, path);

        await userEvent.type(await screen.findByRole("textbox", { name: /Sequence [0-9]+/ }), "q");
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.getByText("Sequence should only contain the characters: ATCGNRYKM")).toBeInTheDocument();
    });

    it("should resume editing once form opened after submitting", async () => {
        const scope = mockApiEditSequence(
            otu.id,
            otu.isolates[0].id,
            activeSequence.id,
            "user_typed_accession",
            "user_typed_definition",
            "user_typed_host",
            "ACGRM",
            undefined,
            "test_target_name_2",
        );
        renderWithRouter(<References />, path);

        await userEvent.click(await screen.findByRole("combobox"));
        await userEvent.click(screen.getByRole("option", { name: /test_target_name_2/ }));
        await userEvent.clear(screen.getByRole("textbox", { name: "Accession (ID)" }));
        await userEvent.type(screen.getByRole("textbox", { name: "Accession (ID)" }), "user_typed_accession");
        await userEvent.clear(screen.getByRole("textbox", { name: "Host" }));
        await userEvent.type(screen.getByRole("textbox", { name: "Host" }), "user_typed_host");
        await userEvent.clear(screen.getByRole("textbox", { name: "Definition" }));
        await userEvent.type(screen.getByRole("textbox", { name: "Definition" }), "user_typed_definition");
        await userEvent.clear(screen.getByRole("textbox", { name: /Sequence [0-9]+/ }));
        await userEvent.type(screen.getByRole("textbox", { name: /Sequence [0-9]+/ }), "ACGRM");

        renderWithRouter(<References />, path);

        expect(screen.getByRole("textbox", { name: "Accession (ID)" })).toHaveValue("user_typed_accession");

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        await waitFor(() => scope.done());

        renderWithRouter(<References />, path);
        expect(screen.queryByText("Resumed editing draft sequence.")).toBeNull();
    });
});
