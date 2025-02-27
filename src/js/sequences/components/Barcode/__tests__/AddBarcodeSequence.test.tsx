import { AdministratorRoles } from "@administration/types";
import References from "@references/components/References";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { createFakeSettings, mockApiGetSettings } from "@tests/fake/admin";
import {
    createFakeOTU,
    mockApiAddSequence,
    mockApiGetOTU,
} from "@tests/fake/otus";
import {
    createFakeReference,
    mockApiGetReferenceDetail,
} from "@tests/fake/references";
import { renderWithRouter } from "@tests/setup";
import { formatPath } from "@utils/hooks";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";

describe("<AddBarcodeSequence>", () => {
    let reference;
    let otu;
    let path;

    beforeEach(() => {
        reference = createFakeReference({
            data_type: "barcode",
            targets: [
                {
                    description: "",
                    length: 0,
                    name: "test_target_name_1",
                    required: false,
                },
                {
                    description: "",
                    length: 0,
                    name: "test_target_name_2",
                    required: false,
                },
            ],
        });
        mockApiGetReferenceDetail(reference);
        otu = createFakeOTU();
        mockApiGetOTU(otu);
        mockApiGetSettings(createFakeSettings());
        mockApiGetAccount(
            createFakeAccount({ administrator_role: AdministratorRoles.FULL }),
        );

        path = formatPath(`/refs/${reference.id}/otus/${otu.id}/otu`, {
            openAddSequence: true,
        });
    });

    afterEach(() => window.sessionStorage.clear());

    it("should render all fields", async () => {
        renderWithRouter(<References />, path);

        expect(await screen.findByText("Target")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(
            screen.getByRole("textbox", { name: "Accession (ID)" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("textbox", { name: "Host" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("textbox", { name: "Definition" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("textbox", { name: "Sequence 0" }),
        ).toBeInTheDocument();
    });

    it("should submit correct data when all fields changed", async () => {
        const scope = mockApiAddSequence(
            otu.id,
            otu.isolates[0].id,
            "user_typed_accession",
            "user_typed_host",
            "user_typed_definition",
            "ATGRYK",
            undefined,
            "test_target_name_2",
        );
        renderWithRouter(<References />, path);

        await userEvent.click(await screen.findByRole("combobox"));
        await userEvent.click(screen.getByText("test_target_name_2"));
        await userEvent.type(
            screen.getByRole("textbox", { name: "Accession (ID)" }),
            "user_typed_accession",
        );
        await userEvent.type(
            screen.getByRole("textbox", { name: "Host" }),
            "user_typed_host",
        );
        await userEvent.type(
            screen.getByRole("textbox", { name: "Definition" }),
            "user_typed_definition",
        );
        await userEvent.type(
            screen.getByRole("textbox", { name: "Sequence 0" }),
            "ATGRYK",
        );

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        scope.done();
    });

    it("should display errors when accession, definition, or sequence not defined", async () => {
        renderWithRouter(<References />, path);

        await userEvent.click(
            await screen.findByRole("button", { name: "Save" }),
        );

        expect(screen.getAllByText("Required Field").length).toBe(3);
    });

    it("should display specific error when sequence contains chars !== ATCGNRYKM", async () => {
        renderWithRouter(<References />, path);

        await userEvent.type(
            await screen.findByRole("textbox", { name: /Sequence/ }),
            "atbcq",
        );
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(
            screen.getByText(
                "Sequence should only contain the characters: ATCGNRYKM",
            ),
        ).toBeInTheDocument();
    });

    it("should clear form persistence cache after submitting", async () => {
        const scope = mockApiAddSequence(
            otu.id,
            otu.isolates[0].id,
            "user_typed_accession",
            "user_typed_host",
            "user_typed_definition",
            "ATGRYK",
            undefined,
            "test_target_name_2",
        );

        renderWithRouter(<References />, path);

        await userEvent.click(await screen.findByRole("combobox"));
        await userEvent.click(screen.getByText("test_target_name_2"));
        await userEvent.type(
            screen.getByRole("textbox", { name: "Accession (ID)" }),
            "user_typed_accession",
        );
        await userEvent.type(
            screen.getByRole("textbox", { name: "Host" }),
            "user_typed_host",
        );
        await userEvent.type(
            screen.getByRole("textbox", { name: "Definition" }),
            "user_typed_definition",
        );
        await userEvent.type(
            screen.getByRole("textbox", { name: "Sequence 0" }),
            "ATGRYK",
        );

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        scope.done();

        renderWithRouter(<References />, path);
        expect(
            screen.queryByText("Resumed editing draft sequence."),
        ).toBeNull();
    });
});
