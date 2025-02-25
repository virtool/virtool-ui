import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import {
    createFakeOTU,
    mockApiGetOTU,
    mockApiRemoveSequence,
} from "../../../../tests/fake/otus";
import {
    createFakeReference,
    mockApiGetReferenceDetail,
} from "@tests/fake/references";
import { createFakeSettings, mockApiGetSettings } from "@tests/fake/admin";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { AdministratorRoles } from "@administration/types";
import References from "@references/components/References";
import { formatPath } from "@utils/hooks";

describe("<RemoveSequence />", () => {
    let path;
    let searchParams;
    let reference;
    let otu;
    let otuScope;
    let sourceType;

    beforeEach(() => {
        reference = createFakeReference({ name: "Foo" });
        mockApiGetReferenceDetail(reference);
        otu = createFakeOTU();
        otuScope = mockApiGetOTU(otu);
        mockApiGetSettings(createFakeSettings());
        mockApiGetAccount(
            createFakeAccount({ administrator_role: AdministratorRoles.FULL }),
        );

        path = `/refs/${reference.id}/otus/${otu.id}/otu`;
        searchParams = { removeSequenceId: otu.isolates[0].sequences[0].id };

        sourceType =
            otu.isolates[0].source_type[0].toUpperCase() +
            otu.isolates[0].source_type.slice(1);
    });

    it("should render when [show=true]", async () => {
        renderWithRouter(<References />, formatPath(path, searchParams));

        expect(await screen.findByText("Remove Sequence")).toBeInTheDocument();
        expect(
            screen.getByText(/Are you sure you want to remove the sequence/),
        ).toBeInTheDocument();
        expect(
            screen.getAllByText(`${otu.isolates[0].sequences[0].accession}`),
        ).toHaveLength(2);
        expect(
            screen.getAllByText(`${sourceType} ${otu.isolates[0].source_name}`),
        ).toHaveLength(3);
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render when [show=false]", async () => {
        renderWithRouter(<References />, path);

        await waitFor(() => otuScope.done());

        expect(screen.queryByText("Remove Sequence")).toBeNull();
        expect(
            screen.queryByText(
                /Are you sure you want to remove the sequence from/,
            ),
        ).toBeNull();
        expect(
            screen.getAllByText(`${otu.isolates[0].sequences[0].accession}`),
        ).toHaveLength(1);
        expect(
            screen.getAllByText(`${sourceType} ${otu.isolates[0].source_name}`),
        ).toHaveLength(2);
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("should handle submit when onConfirm() on RemoveDialog is called", async () => {
        const scope = mockApiRemoveSequence(
            otu.id,
            otu.isolates[0].id,
            otu.isolates[0].sequences[0].id,
        );
        renderWithRouter(<References />, formatPath(path, searchParams));

        await userEvent.click(
            await screen.findByRole("button", { name: "Confirm" }),
        );

        scope.done();
    });
});
