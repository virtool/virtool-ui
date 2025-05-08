import { screen } from "@testing-library/react";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import {
    createFakeReference,
    mockApiGetReferenceDetail,
} from "@tests/fake/references";
import { renderWithRouter } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { AdministratorRoleName } from "../../../../administration/types";
import ReferenceDetailHeader from "../ReferenceDetailHeader";

describe("<ReferenceDetailHeaderIcon />", () => {
    let props;
    let reference;
    let path;

    beforeEach(() => {
        reference = createFakeReference();
        mockApiGetReferenceDetail(reference);
        mockApiGetAccount(
            createFakeAccount({
                administrator_role: AdministratorRoleName.FULL,
            }),
        );
        props = {
            createdAt: reference.created_at,
            isRemote: false,
            name: reference.name,
            userHandle: reference.user.handle,
            refId: reference.id,
        };
        path = `/refs/${reference.id}/manage`;
    });

    it("should render", () => {
        renderWithRouter(<ReferenceDetailHeader {...props} />, path);

        expect(screen.getByText(reference.name)).toBeInTheDocument();
        expect(
            screen.getByText(`${reference.user.handle} created`),
        ).toBeInTheDocument();
    });

    it("should render when [showIcons=false]", () => {
        renderWithRouter(<ReferenceDetailHeader {...props} />, path);

        expect(screen.queryByLabelText("lock")).toBeNull();
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("should render when [canModify=true]", async () => {
        renderWithRouter(<ReferenceDetailHeader {...props} />, path);

        expect(await screen.findByRole("button")).toBeInTheDocument();
    });

    it("should render when [canModify=false]", () => {
        renderWithRouter(<ReferenceDetailHeader {...props} />, path);

        expect(screen.queryByRole("button")).toBeNull();
    });

    it("should render when [isRemote=true]", async () => {
        props.isRemote = true;
        mockApiGetAccount(
            createFakeAccount({
                administrator_role: AdministratorRoleName.FULL,
            }),
        );
        renderWithRouter(<ReferenceDetailHeader {...props} />, path);

        expect(await screen.findByLabelText("lock")).toBeInTheDocument();
    });

    it("should render when [isRemote=false]", () => {
        mockApiGetAccount(
            createFakeAccount({
                administrator_role: AdministratorRoleName.FULL,
            }),
        );
        renderWithRouter(<ReferenceDetailHeader {...props} />, path);

        expect(screen.queryByLabelText("lock")).toBeNull();
    });

    it("should render when [both canModify=false, isRemote=false]", () => {
        mockApiGetAccount(createFakeAccount({ administrator_role: null }));
        renderWithRouter(<ReferenceDetailHeader {...props} />, path);

        expect(screen.queryByLabelText("lock")).toBeNull();
        expect(screen.queryByRole("button")).toBeNull();
    });
});
