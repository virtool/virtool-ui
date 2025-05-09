import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import {
    createFakeSettings,
    mockApiGetSettings,
} from "@tests/fake/administrator";
import {
    createFakeOtu,
    mockApiAddSequence,
    mockApiGetOtu,
} from "@tests/fake/otus";
import {
    createFakeReference,
    mockApiGetReferenceDetail,
} from "@tests/fake/references";
import { renderWithRouter } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { AdministratorRoleName } from "../../../administration/types";
import { formatPath } from "../../../app/hooks";
import References from "../../../references/components/References";

describe("<CreateSequence>", () => {
    let otu;
    let path;
    let reference;

    beforeEach(() => {
        reference = createFakeReference();
        mockApiGetReferenceDetail(reference);
        otu = createFakeOtu();
        mockApiGetOtu(otu);
        mockApiGetSettings(createFakeSettings());
        mockApiGetAccount(
            createFakeAccount({
                administrator_role: AdministratorRoleName.FULL,
            }),
        );

        path = formatPath(`/refs/${reference.id}/otus/${otu.id}/otu`, {
            openCreateSequence: true,
        });
    });

    afterEach(() => window.sessionStorage.clear());

    it("should update fields on typing", async () => {
        const scope = mockApiAddSequence(
            otu.id,
            otu.isolates[0].id,
            "user_typed_accession",
            "user_typed_host",
            "user_typed_definition",
            "ATGRYKM",
            otu.schema[0].name,
        );
        renderWithRouter(<References />, path);

        expect(await screen.findByText("Segment")).toBeInTheDocument();
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
            screen.getByRole("textbox", { name: /Sequence [0-9]/ }),
        ).toBeInTheDocument();

        await userEvent.click(screen.getByRole("combobox"));
        await userEvent.click(
            await screen.findByRole("option", {
                name: `${otu.schema[0].name}`,
            }),
        );
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
            "ATGRYKM",
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
            await screen.findByRole("textbox", { name: /Sequence [0-9]/ }),
            "atbcq",
        );
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(
            screen.getByText(
                "Sequence should only contain the characters: ATCGNRYKM",
            ),
        ).toBeInTheDocument();
    });

    it("should clear form cache after submitting", async () => {
        const scope = mockApiAddSequence(
            otu.id,
            otu.isolates[0].id,
            "user_typed_accession",
            "user_typed_host",
            "user_typed_definition",
            "ATGRYKM",
            otu.schema[0].name,
        );
        renderWithRouter(<References />, path);

        expect(await screen.findByText("Segment")).toBeInTheDocument();
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
            screen.getByRole("textbox", { name: /Sequence [0-9]/ }),
        ).toBeInTheDocument();

        await userEvent.click(screen.getByRole("combobox"));
        await userEvent.click(
            await screen.findByRole("option", {
                name: `${otu.schema[0].name}`,
            }),
        );
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
            "ATGRYKM",
        );
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        scope.done();

        renderWithRouter(<References />, path);
        expect(
            screen.queryByText("Resumed editing draft sequence."),
        ).toBeNull();
    });
});
