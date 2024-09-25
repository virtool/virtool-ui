import { AdministratorRoles } from "@administration/types";
import { screen } from "@testing-library/react";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { createFakeReference, mockApiGetReferenceDetail } from "@tests/fake/references";
import { renderWithMemoryRouter } from "@tests/setupTests";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import ReferenceDetailHeader from "../ReferenceDetailHeader";

describe("<ReferenceDetailHeaderIcon />", () => {
    let props;
    let reference;

    beforeEach(() => {
        reference = createFakeReference();
        mockApiGetReferenceDetail(reference);
        mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        props = {
            createdAt: reference.created_at,
            isRemote: false,
            name: reference.name,
            userHandle: reference.user.handle,
            refId: reference.id,
        };
    });

    it("should render", () => {
        renderWithMemoryRouter(<ReferenceDetailHeader {...props} />, `/refs/${reference.id}/manage`);

        expect(screen.getByText(reference.name)).toBeInTheDocument();
        expect(screen.getByText(`${reference.user.handle} created`)).toBeInTheDocument();
    });

    it("should render when [showIcons=false]", () => {
        renderWithMemoryRouter(<ReferenceDetailHeader {...props} />, `/refs/${reference.id}/manage`);

        expect(screen.queryByLabelText("lock")).toBeNull();
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("should render when [canModify=true]", async () => {
        renderWithMemoryRouter(<ReferenceDetailHeader {...props} />, `/refs/${reference.id}/manage`);

        expect(await screen.findByRole("button")).toBeInTheDocument();
    });

    it("should render when [canModify=false]", () => {
        renderWithMemoryRouter(<ReferenceDetailHeader {...props} />, `/refs/${reference.id}/manage`);

        expect(screen.queryByRole("button")).toBeNull();
    });

    it("should render when [isRemote=true]", async () => {
        props.isRemote = true;
        mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        renderWithMemoryRouter(<ReferenceDetailHeader {...props} />, `/refs/${reference.id}/manage`);

        expect(await screen.findByLabelText("lock")).toBeInTheDocument();
    });

    it("should render when [isRemote=false]", () => {
        mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        renderWithMemoryRouter(<ReferenceDetailHeader {...props} />, `/refs/${reference.id}/manage`);

        expect(screen.queryByLabelText("lock")).toBeNull();
    });

    it("should render when [both canModify=false, isRemote=false]", () => {
        mockApiGetAccount(createFakeAccount({ administrator_role: null }));
        renderWithMemoryRouter(<ReferenceDetailHeader {...props} />, `/refs/${reference.id}/manage`);

        expect(screen.queryByLabelText("lock")).toBeNull();
        expect(screen.queryByRole("button")).toBeNull();
    });
});
