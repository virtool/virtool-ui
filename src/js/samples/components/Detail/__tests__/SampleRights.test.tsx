import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeAccount, mockApiGetAccount } from "../../../../../tests/fake/account";
import { createFakeGroup, mockApiListGroups } from "../../../../../tests/fake/groups";
import { createFakeSample, mockApiGetSampleDetail } from "../../../../../tests/fake/samples";
import { renderWithMemoryRouter } from "../../../../../tests/setupTests";
import { AdministratorRoles } from "../../../../administration/types";
import Samples from "../../Samples";

describe("<SampleRights />", () => {
    let sample;
    let group;

    beforeEach(() => {
        sample = createFakeSample({ all_read: false, all_write: false, group_read: false, group_write: false });
        group = createFakeGroup();
        mockApiGetSampleDetail(sample);
        mockApiListGroups([group]);
    });

    afterEach(() => nock.cleanAll());

    it("should render", async () => {
        mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        const unreadySample = createFakeSample({ paired: true, ready: false });
        const scope = mockApiGetSampleDetail(unreadySample);
        renderWithMemoryRouter(<Samples />, [`/${unreadySample.id}/rights`]);

        await waitFor(() => scope.done());

        expect(await screen.findByText("Sample Rights")).toBeInTheDocument();
        expect(screen.getByText("Group")).toBeInTheDocument();
        expect(screen.getByText("Group Rights")).toBeInTheDocument();
        expect(screen.getByText("All Users' Rights")).toBeInTheDocument();
    });

    it("should return Not allowed panel when[this.props.canModifyRights=false]", async () => {
        mockApiGetAccount(createFakeAccount({ administrator_role: null }));
        const unreadySample = createFakeSample({ paired: true, ready: false });
        const scope = mockApiGetSampleDetail(unreadySample);
        renderWithMemoryRouter(<Samples />, [`/${unreadySample.id}/rights`]);

        await waitFor(() => scope.done());

        expect(await screen.findByText("Not allowed")).toBeInTheDocument();
    });

    it("should handle group change when input is changed", async () => {
        mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        const unreadySample = createFakeSample({ paired: true, ready: false });
        const scope = mockApiGetSampleDetail(unreadySample);
        renderWithMemoryRouter(<Samples />, [`/${unreadySample.id}/rights`]);

        await waitFor(() => scope.done());

        expect(await screen.findByText("Sample Rights")).toBeInTheDocument();
        await userEvent.selectOptions(screen.getByLabelText("Group"), group.name);

        scope.done();
    });

    it("should handle group rights change when input is changed", async () => {
        mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        const unreadySample = createFakeSample({ paired: true, ready: false });
        const scope = mockApiGetSampleDetail(unreadySample);
        renderWithMemoryRouter(<Samples />, [`/${unreadySample.id}/rights`]);

        await waitFor(() => scope.done());

        expect(await screen.findByText("Sample Rights")).toBeInTheDocument();
        await userEvent.selectOptions(screen.getByLabelText("Group Rights"), "rw");

        scope.done();
    });

    it("should handle all users' rights change when input is changed", async () => {
        mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        const unreadySample = createFakeSample({ paired: true, ready: false });
        const scope = mockApiGetSampleDetail(unreadySample);
        renderWithMemoryRouter(<Samples />, [`/${unreadySample.id}/rights`]);

        await waitFor(() => scope.done());

        expect(await screen.findByText("Sample Rights")).toBeInTheDocument();
        await userEvent.selectOptions(screen.getByLabelText("All Users' Rights"), "rw");

        scope.done();
    });
});
