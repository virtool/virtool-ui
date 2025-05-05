import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import {
    createFakeReference,
    mockApiGetReferenceDetail,
    mockApiRemoveReference,
} from "@tests/fake/references";
import { renderWithRouter } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
        mockApiGetAccount(
            createFakeAccount({ administrator_role: AdministratorRoles.FULL }),
        );
        renderWithRouter(<RemoveReference {...props} />);

        expect(
            await screen.findByText("Permanently delete this reference"),
        ).toBeInTheDocument();
    });

    it("should not render when user does not have permission", () => {
        mockApiGetAccount(createFakeAccount({ administrator_role: null }));
        renderWithRouter(<RemoveReference {...props} />);

        expect(
            screen.queryByText("Permanently delete this reference"),
        ).toBeNull();
    });

    it("should call onConfirm() when confirmed", async () => {
        mockApiGetAccount(
            createFakeAccount({ administrator_role: AdministratorRoles.FULL }),
        );
        const scope = mockApiRemoveReference(reference.id);
        renderWithRouter(<RemoveReference {...props} />);

        expect(
            await screen.findByText("Permanently delete this reference"),
        ).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button"));
        expect(await screen.findByText("Remove Reference")).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button"));

        scope.done();
    });
});
