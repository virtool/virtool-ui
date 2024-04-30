import { AdministratorRoles } from "@administration/types";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeAccount, mockAPIGetAccount } from "../../../../tests/fake/account";
import { createFakeIndexMinimal, mockApiFindIndexes, mockApiGetUnbuiltChanges } from "../../../../tests/fake/indexes";
import { createFakeReference, mockApiGetReferenceDetail } from "../../../../tests/fake/references";
import { renderWithRouter } from "../../../../tests/setupTests";
import Indexes from "../Indexes";

describe("<Indexes />", () => {
    let history;
    let props;
    let reference;

    beforeEach(() => {
        reference = createFakeReference();
        mockApiGetReferenceDetail(reference);
        mockAPIGetAccount(
            createFakeAccount({
                administrator_role: AdministratorRoles.FULL,
            }),
        );
        props = {
            match: { params: { refId: reference.id } },
        };
        history = createBrowserHistory();
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
        renderWithRouter(<Indexes {...props} />, {}, history);

        await waitFor(() => findIndexesScope.done());
        expect(await screen.findByText(`Version ${index.version}`)).toBeInTheDocument();
        expect(await screen.findByText(new RegExp(index.user.handle))).toBeInTheDocument();
        expect(
            await screen.findByText(`${index.change_count} changes made in ${index.modified_otu_count} OTUs`),
        ).toBeInTheDocument();
        expect(await screen.findByText("There are unbuilt changes.")).toBeInTheDocument();
        expect(await screen.findByRole("link", { name: "Rebuild the index" })).toHaveAttribute(
            "href",
            `/refs/${reference.id}/indexes`,
        );
    });

    it("should render build alert", async () => {
        const index = createFakeIndexMinimal({ reference });
        mockApiGetUnbuiltChanges(reference.id);
        mockApiFindIndexes(reference.id, 1, {
            documents: [index],
            modified_otu_count: 1,
            total_otu_count: 1,
            change_count: 1,
        });
        renderWithRouter(<Indexes {...props} />, {}, history);

        await userEvent.click(await screen.findByRole("link", { name: "Rebuild the index" }));

        expect(await screen.findByRole("button", { name: "Start" })).toBeInTheDocument();
    });
});
