import { AdministratorRoles } from "@administration/types";
import References from "@references/components/References";
import { screen } from "@testing-library/react";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { createFakeSettings, mockApiGetSettings } from "@tests/fake/admin";
import { createFakeOTUMinimal, mockApiGetOTUs } from "@tests/fake/otus";
import { createFakeReference, mockApiGetReferenceDetail } from "@tests/fake/references";
import { renderWithMemoryRouter } from "@tests/setupTests";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";

describe("<OTUsList />", () => {
    let reference;
    let OTUs;

    beforeEach(() => {
        mockApiGetSettings(createFakeSettings());
        reference = createFakeReference();
        OTUs = [createFakeOTUMinimal(), createFakeOTUMinimal()];
        mockApiGetReferenceDetail(reference);
    });

    afterEach(() => nock.cleanAll());

    describe("<OTUList />", () => {
        it("should render correctly", async () => {
            const scope = mockApiGetOTUs(OTUs, reference.id);
            renderWithMemoryRouter(<References />, [`/${reference.id}/otus`]);

            expect(await screen.findByText(OTUs[0].name)).toBeInTheDocument();
            expect(screen.getByText(OTUs[0].abbreviation)).toBeInTheDocument();
            expect(screen.getByText(OTUs[1].name)).toBeInTheDocument();
            expect(screen.getByText(OTUs[1].abbreviation)).toBeInTheDocument();
            expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Name or abbreviation");

            scope.done();
        });

        it("should render when no documents are found", async () => {
            const scope = mockApiGetOTUs([], reference.id);
            renderWithMemoryRouter(<References />, [`/${reference.id}/otus`]);

            expect(await screen.findByText("No OTUs found.")).toBeInTheDocument();
            expect(screen.queryByText(OTUs[0].name)).toBeNull();
            expect(screen.queryByText(OTUs[0].abbreviation)).toBeNull();

            scope.done();
        });
    });

    describe("<OTUToolbar />", () => {
        it("should render properly", async () => {
            const scope = mockApiGetOTUs(OTUs, reference.id);
            renderWithMemoryRouter(<References />, [`/${reference.id}/otus`]);

            expect(await screen.findByRole("textbox")).toBeInTheDocument();

            scope.done();
        });

        it("should not render creation button when [canCreate=true]", async () => {
            const scope = mockApiGetOTUs(OTUs, reference.id);
            const account = createFakeAccount({
                administrator_role: AdministratorRoles.FULL,
            });
            mockApiGetAccount(account);
            renderWithMemoryRouter(<References />, [`/${reference.id}/otus`]);

            expect(await screen.findByText("Create")).toBeInTheDocument();

            scope.done();
        });

        it("should not render creation button when [canCreate=false]", async () => {
            const scope = mockApiGetOTUs(OTUs, reference.id);
            const account = createFakeAccount({
                administrator_role: null,
            });
            mockApiGetAccount(account);
            renderWithMemoryRouter(<References />, [`/${reference.id}/otus`]);

            expect(await screen.findByRole("textbox")).toBeInTheDocument();
            expect(screen.queryByText("Create")).toBeNull();

            scope.done();
        });
    });

    describe("<OTUItem />", () => {
        it("should render when [verified=true]", async () => {
            const scope = mockApiGetOTUs(OTUs, reference.id);
            renderWithMemoryRouter(<References />, [`/${reference.id}/otus`]);

            expect(await screen.findByText(OTUs[0].name)).toBeInTheDocument();
            expect(screen.queryByText("Unverified")).toBeNull();

            scope.done();
        });

        it("should render when [verified=false]", async () => {
            const scope = mockApiGetOTUs([createFakeOTUMinimal({ verified: false })], reference.id);
            renderWithMemoryRouter(<References />, [`/${reference.id}/otus`]);

            expect(await screen.findByText("Unverified")).toBeInTheDocument();
            scope.done();
        });
    });
});
