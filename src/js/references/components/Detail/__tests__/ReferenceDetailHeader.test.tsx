import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeAccount, mockAPIGetAccount } from "../../../../../tests/fake/account";
import { createFakeReference, mockApiGetReferenceDetail } from "../../../../../tests/fake/references";
import { renderWithRouter } from "../../../../../tests/setupTests";
import { AdministratorRoles } from "../../../../administration/types";
import ReferenceDetailHeader from "../ReferenceDetailHeader";

describe("<ReferenceDetailHeaderIcon />", () => {
    let props;
    let history;
    let reference;

    beforeEach(() => {
        reference = createFakeReference();
        mockApiGetReferenceDetail(reference);
        mockAPIGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        props = {
            createdAt: reference.created_at,
            isRemote: false,
            name: reference.name,
            userHandle: reference.user.handle,
            refId: reference.id,
        };
        history = createBrowserHistory();
        history.push("/manage");
    });

    it("should render", () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ pathname: `/refs/${reference.id}/manage` }]}>
                <ReferenceDetailHeader {...props} />
            </MemoryRouter>,
            {},
            history,
        );

        expect(screen.getByText(reference.name)).toBeInTheDocument();
        expect(screen.getByText(`${reference.user.handle} created`)).toBeInTheDocument();
    });

    it("should render when [showIcons=false]", () => {
        renderWithRouter(
            <MemoryRouter initialEntries={[{ pathname: `/refs/${reference.id}/settings` }]}>
                <ReferenceDetailHeader {...props} />
            </MemoryRouter>,
            {},
            history,
        );

        expect(screen.queryByLabelText("lock")).toBeNull();
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("should render when [canModify=true]", async () => {
        mockApiGetReferenceDetail(reference);
        renderWithRouter(<ReferenceDetailHeader {...props} />, {}, history);

        expect(await screen.findByRole("button")).toBeInTheDocument();
    });

    it("should render when [canModify=false]", () => {
        mockAPIGetAccount(createFakeAccount({ administrator_role: null }));
        renderWithRouter(<ReferenceDetailHeader {...props} />, {}, history);

        expect(screen.queryByRole("button")).toBeNull();
    });

    it("should render when [isRemote=true]", async () => {
        props.isRemote = true;
        mockAPIGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        renderWithRouter(<ReferenceDetailHeader {...props} />, {}, history);

        expect(await screen.findByLabelText("lock")).toBeInTheDocument();
    });

    it("should render when [isRemote=false]", () => {
        mockAPIGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        renderWithRouter(<ReferenceDetailHeader {...props} />, {}, history);

        expect(screen.queryByLabelText("lock")).toBeNull();
    });

    it("should render when [both canModify=false, isRemote=false]", () => {
        mockAPIGetAccount(createFakeAccount({ administrator_role: null }));
        renderWithRouter(<ReferenceDetailHeader {...props} />, {}, history);

        expect(screen.queryByLabelText("lock")).toBeNull();
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("should call onEdit", async () => {
        renderWithRouter(<ReferenceDetailHeader {...props} />, {}, history);

        await userEvent.click(await screen.findByRole("button"));
        expect(history.location.state).toEqual({ editReference: true });
    });
});
