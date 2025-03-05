import { AdministratorRoles } from "@administration/types";
import References from "@references/components/References";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { createFakeSettings, mockApiGetSettings } from "@tests/fake/admin";
import {
    createFakeReference,
    mockApiGetReferenceDetail,
} from "@tests/fake/references";
import { renderWithRouter } from "@tests/setup";
import { formatPath } from "@utils/hooks";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import {
    createFakeOtu,
    mockApiEditOTU,
    mockApiGetOtu,
} from "../../../../../../tests/fake/otus";

describe("<RemoveSegment />", () => {
    let props;
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

        path = `/refs/${reference.id}/otus/${otu.id}/schema`;
        searchParams = { removeSegmentName: otu.schema[0].name };

        props = {
            abbreviation: otu.abbreviation,
            name: otu.name,
            otuId: otu.id,
            schema: otu.schema,
        };
    });

    it("should render when [show=true]", async () => {
        renderWithRouter(<References />, formatPath(path, searchParams));

        expect(await screen.findByText("Remove Segment")).toBeInTheDocument();
        expect(
            screen.getByText(/Are you sure you want to remove/),
        ).toBeInTheDocument();
        expect(screen.getAllByText(`${otu.schema[0].name}`)).toHaveLength(2);
        expect(
            screen.getByRole("button", { name: "Confirm" }),
        ).toBeInTheDocument();
    });

    it("should render when [show=false]", async () => {
        renderWithRouter(<References />, path);

        await waitFor(() => otuScope.done());

        expect(
            await screen.findByText(`${otu.schema[0].name}`),
        ).toBeInTheDocument();

        expect(screen.queryByText("Remove Segment")).toBeNull();
        expect(
            screen.queryByText(/Are you sure you want to remove/),
        ).toBeNull();
        expect(screen.queryByRole("button", { name: "Confirm" })).toBeNull();
    });

    it("should call onSubmit() when onConfirm() called on <RemoveDialog />", async () => {
        const scope = mockApiEditOTU(otu, {
            abbreviation: otu.abbreviation,
            name: otu.name,
            otuId: otu.id,
            schema: [props.schema[1]],
        });
        renderWithRouter(<References />, formatPath(path, searchParams));

        await userEvent.click(
            await screen.findByRole("button", { name: "Confirm" }),
        );

        scope.done();
    });

    it("should call onHide() when onHide() called on <RemoveDialog />", async () => {
        renderWithRouter(<References />, formatPath(path, searchParams));

        expect(await screen.findByText("Remove Segment")).toBeInTheDocument();

        await userEvent.keyboard("{Escape}");

        await waitFor(() =>
            expect(screen.queryByText("Remove Segment")).toBeNull(),
        );
    });
});
