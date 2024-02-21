import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeAccount, mockAPIGetAccount } from "../../../../../tests/fake/account";
import {
    createFakeReference,
    mockApiGetReferenceDetail,
    mockApiRemoveReference,
} from "../../../../../tests/fake/references";
import { renderWithProviders } from "../../../../../tests/setupTests";
import { AdministratorRoles } from "../../../../administration/types";
import RemoveReference from "../RemoveReference";

describe("<RemoveReference />", () => {
    let props;
    let reference;

    beforeEach(() => {
        reference = createFakeReference();
        mockApiGetReferenceDetail(reference);
        props = {
            id: reference.id,
            onConfirm: vi.fn(),
        };
    });

    it("should render when user has permission", async () => {
        mockAPIGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        renderWithProviders(<RemoveReference {...props} />);

        expect(await screen.findByText("Permanently delete this reference")).toBeInTheDocument();
    });

    it("should not render when user does not have permission", () => {
        mockAPIGetAccount(createFakeAccount({ administrator_role: null }));
        renderWithProviders(<RemoveReference {...props} />);

        expect(screen.queryByText("Permanently delete this reference")).toBeNull();
    });

    it("should call onConfirm() when confirmed", async () => {
        mockAPIGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        const scope = mockApiRemoveReference(reference.id);
        renderWithProviders(<RemoveReference {...props} />);

        expect(await screen.findByText("Permanently delete this reference")).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button"));

        scope.done();
    });
});
