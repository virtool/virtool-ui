import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeAccount, mockAPIGetAccount } from "../../../../../tests/fake/account";
import { createFakeGroup, mockApiListGroups } from "../../../../../tests/fake/groups";
import { createFakeSample, mockApiGetSampleDetail, mockApiUpdateSampleRights } from "../../../../../tests/fake/samples";
import { renderWithRouter } from "../../../../../tests/setupTests";
import { AdministratorRoles } from "../../../../administration/types";
import SampleRights from "../SampleRights";

describe("<SampleRights />", () => {
    let sample;
    let group;
    let props;
    let history;

    beforeEach(() => {
        sample = createFakeSample({ all_read: false, all_write: false, group_read: false, group_write: false });
        group = createFakeGroup();
        mockApiGetSampleDetail(sample);
        mockApiListGroups([group]);
        props = {
            match: { params: { sampleId: sample.id } },
        };
        history = createBrowserHistory();
    });

    afterEach(() => nock.cleanAll());

    it("should render", async () => {
        mockAPIGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        renderWithRouter(<SampleRights {...props} />, {}, history);

        expect(await screen.findByText("Sample Rights")).toBeInTheDocument();
        expect(screen.getByText("Group")).toBeInTheDocument();
        expect(screen.getByText("Group Rights")).toBeInTheDocument();
        expect(screen.getByText("All Users' Rights")).toBeInTheDocument();
    });

    it("should return Not allowed panel when[this.props.canModifyRights=false]", async () => {
        mockAPIGetAccount(createFakeAccount({ administrator_role: null }));
        renderWithRouter(<SampleRights {...props} />, {}, history);

        expect(await screen.findByText("Not allowed")).toBeInTheDocument();
    });

    it("should handle group change when input is changed", async () => {
        mockAPIGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        const scope = mockApiUpdateSampleRights(sample, { group: group.id });
        renderWithRouter(<SampleRights {...props} />, {}, history);

        expect(await screen.findByText("Sample Rights")).toBeInTheDocument();
        await userEvent.selectOptions(screen.getByLabelText("Group"), group.name);

        scope.done();
    });

    it("should handle group rights change when input is changed", async () => {
        mockAPIGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        const scope = mockApiUpdateSampleRights(sample, { group_read: true, group_write: true });
        renderWithRouter(<SampleRights {...props} />, {}, history);

        expect(await screen.findByText("Sample Rights")).toBeInTheDocument();
        await userEvent.selectOptions(screen.getByLabelText("Group Rights"), "rw");

        scope.done();
    });

    it("should handle all users' rights change when input is changed", async () => {
        mockAPIGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        const scope = mockApiUpdateSampleRights(sample, { all_read: true, all_write: true });
        renderWithRouter(<SampleRights {...props} />, {}, history);

        expect(await screen.findByText("Sample Rights")).toBeInTheDocument();
        await userEvent.selectOptions(screen.getByLabelText("All Users' Rights"), "rw");

        scope.done();
    });
});
