import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { createFakeSample, mockApiGetSampleDetail } from "@tests/fake/samples";
import { renderWithRouter } from "@tests/setup";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeGroup, mockApiListGroups } from "../../../../../tests/fake/groups";
import { AdministratorRoles } from "../../../../administration/types";
import Samples from "../../Samples";

describe("<SampleRights />", () => {
    let sample;
    let group;
    let path;

    beforeEach(() => {
        sample = createFakeSample({ all_read: false, all_write: false, group_read: false, group_write: false });
        group = createFakeGroup();
        mockApiGetSampleDetail(sample);
        mockApiListGroups([group]);

        path = `/samples/${sample.id}/rights`;
    });

    afterEach(() => nock.cleanAll());

    it("should render", async () => {
        mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        renderWithRouter(<Samples />, path);

        expect(await screen.findByText("Sample Rights")).toBeInTheDocument();
        expect(screen.getByText("Group")).toBeInTheDocument();
        expect(screen.getByText("Group Rights")).toBeInTheDocument();
        expect(screen.getByText("All Users' Rights")).toBeInTheDocument();
    });

    it("should return Not allowed panel when[this.props.canModifyRights=false]", async () => {
        mockApiGetAccount(createFakeAccount({ administrator_role: null }));
        renderWithRouter(<Samples />, path);
        expect(await screen.findByText("Not allowed")).toBeInTheDocument();
    });

    it("should handle group change when input is changed", async () => {
        mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        renderWithRouter(<Samples />, path);
        expect(await screen.findByText("Sample Rights")).toBeInTheDocument();
        await userEvent.selectOptions(screen.getByLabelText("Group"), group.name);
    });

    it("should handle group rights change when input is changed", async () => {
        mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        renderWithRouter(<Samples />, `/samples/${sample.id}/rights`);
        expect(await screen.findByText("Sample Rights")).toBeInTheDocument();
        await userEvent.selectOptions(screen.getByLabelText("Group Rights"), "rw");
    });

    it("should handle all users' rights change when input is changed", async () => {
        mockApiGetAccount(createFakeAccount({ administrator_role: AdministratorRoles.FULL }));
        renderWithRouter(<Samples />, path);
        expect(await screen.findByText("Sample Rights")).toBeInTheDocument();
        await userEvent.selectOptions(screen.getByLabelText("All Users' Rights"), "rw");
    });
});
