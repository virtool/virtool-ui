import { AdministratorRoleName } from "@administration/types";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import {
    createFakeSettings,
    mockApiGetSettings,
} from "@tests/fake/administrator";
import {
    createFakeIndexMinimal,
    mockApiFindIndexes,
    mockApiGetUnbuiltChanges,
} from "@tests/fake/indexes";
import {
    createFakeReference,
    mockApiGetReferenceDetail,
} from "@tests/fake/references";
import { renderWithRouter } from "@tests/setup";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import References from "../../../references/components/References";

describe("<Indexes />", () => {
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
        mockApiGetSettings(createFakeSettings());
        path = `/refs/${reference.id}/indexes`;
    });

    afterEach(() => nock.cleanAll());

    it("should render", async () => {
        const index = createFakeIndexMinimal({ reference });
        const findIndexesScope = mockApiFindIndexes(reference.id, 1, {
            documents: [index],
            modified_otu_count: 1,
            total_otu_count: 1,
            change_count: 1,
        });
        renderWithRouter(<References />, path);

        await waitFor(() => findIndexesScope.done());
        expect(
            await screen.findByText(`Version ${index.version}`),
        ).toBeInTheDocument();
        expect(
            await screen.findByText(new RegExp(index.user.handle)),
        ).toBeInTheDocument();
        expect(
            await screen.findByText(
                `${index.change_count} changes made in ${index.modified_otu_count} OTUs`,
            ),
        ).toBeInTheDocument();
        expect(
            await screen.findByText("There are unbuilt changes."),
        ).toBeInTheDocument();
        expect(
            await screen.findByRole("link", { name: "Rebuild the index" }),
        ).toHaveAttribute(
            "href",
            `/refs/${reference.id}/indexes?openRebuild=true`,
        );
    });

    it("should render build alert", async () => {
        const index = createFakeIndexMinimal({ reference });
        mockApiGetUnbuiltChanges(reference.id);
        const scope = mockApiFindIndexes(reference.id, 1, {
            documents: [index],
            modified_otu_count: 1,
            total_otu_count: 1,
            change_count: 1,
        });
        renderWithRouter(<References />, path);

        await waitFor(() => scope.done());

        await userEvent.click(
            await screen.findByRole("link", { name: "Rebuild the index" }),
        );

        expect(
            await screen.findByRole("button", { name: "Start" }),
        ).toBeInTheDocument();
    });
});
