import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { createFakeSettings, mockApiGetSettings } from "@tests/fake/admin";
import {
    createFakeOtu,
    mockApiGetOtu,
    mockApiRemoveOTU,
} from "@tests/fake/otus";
import {
    createFakeReference,
    mockApiGetReferenceDetail,
} from "@tests/fake/references";
import { renderWithRouter } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { AdministratorRoles } from "../../../../administration/types";
import { formatPath } from "../../../../app/hooks";
import References from "../../../../references/components/References";

describe("<RemoveOTU />", () => {
    let path;
    let reference;
    let searchParams;
    let otu;
    let otuScope;

    beforeEach(() => {
        reference = createFakeReference({ name: "Foo" });
        mockApiGetReferenceDetail(reference);
        otu = createFakeOtu();
        otuScope = mockApiGetOtu(otu);
        mockApiGetSettings(createFakeSettings());
        mockApiGetAccount(
            createFakeAccount({ administrator_role: AdministratorRoles.FULL }),
        );

        path = `/refs/${reference.id}/otus/${otu.id}/otu`;
        searchParams = { openRemoveOTU: true };
    });

    it("should render when [show=true]", async () => {
        renderWithRouter(<References />, formatPath(path, searchParams));

        expect(await screen.findByText("Remove OTU")).toBeInTheDocument();
        expect(
            screen.getByText(/Are you sure you want to remove/),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Confirm" }),
        ).toBeInTheDocument();
    });

    it("should render when [show=false]", async () => {
        renderWithRouter(<References />, path);

        await waitFor(() => otuScope.done());

        expect(screen.queryByText("Remove OTU")).toBeNull();
        expect(
            screen.queryByText(/Are you sure you want to remove/),
        ).toBeNull();
        expect(screen.queryByRole("button", { name: "Confirm" })).toBeNull();
    });

    it("should handle submit when onConfirm() on RemoveDialog is called", async () => {
        const scope = mockApiRemoveOTU(otu.id);
        renderWithRouter(<References />, formatPath(path, searchParams));

        await userEvent.click(
            await screen.findByRole("button", { name: "Confirm" }),
        );

        scope.done();
    });
});
