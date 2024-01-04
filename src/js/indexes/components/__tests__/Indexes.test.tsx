import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { connectRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import React from "react";
import { combineReducers } from "redux";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeIndexMinimal, mockApiFindIndexes } from "../../../../tests/fake/indexes";
import { createFakeReferenceNested } from "../../../../tests/fake/references";
import { createGenericReducer, renderWithRouter } from "../../../../tests/setupTests";
import { AdministratorRoles } from "../../../administration/types";
import { Indexes } from "../Indexes";

function createReducer(state, history) {
    return combineReducers({
        router: connectRouter(history),
        references: createGenericReducer(state.references),
        account: createGenericReducer(state.account),
        indexes: createGenericReducer(state.indexes),
    });
}

describe("<Indexes />", () => {
    let state;

    const defaultReference = createFakeReferenceNested();
    beforeEach(() => {
        state = {
            references: { detail: { id: defaultReference.id } },
            account: { administrator_role: AdministratorRoles.FULL },
            indexes: { unbuilt: [] },
        };
    });

    it("should render", async () => {
        const index = createFakeIndexMinimal({ reference: defaultReference });
        const findIndexesScope = mockApiFindIndexes(defaultReference.id, 1, {
            documents: [index],
            modified_otu_count: 1,
            total_otu_count: 1,
            change_count: 1,
        });

        renderWithRouter(<Indexes refId={defaultReference.id} />, state, createBrowserHistory(), createReducer);

        await waitFor(() => findIndexesScope.done());
        expect(await screen.findByText(`Version ${index.version}`)).toBeInTheDocument();
        expect(await screen.findByText(new RegExp(index.user.handle))).toBeInTheDocument();
        expect(
            await screen.findByText(`${index.change_count} changes made in ${index.modified_otu_count} OTUs`),
        ).toBeInTheDocument();
        expect(await screen.findByText("There are unbuilt changes.")).toBeInTheDocument();
        expect(await screen.findByRole("link", { name: "Rebuild the index" })).toHaveAttribute(
            "href",
            `/refs/${defaultReference.id}/indexes`,
        );
    });

    it("should render build alert", async () => {
        const index = createFakeIndexMinimal({ reference: defaultReference });
        mockApiFindIndexes(defaultReference.id, 1, {
            documents: [index],
            modified_otu_count: 1,
            total_otu_count: 1,
            change_count: 1,
        });

        renderWithRouter(<Indexes refId={defaultReference.id} />, state, createBrowserHistory(), createReducer);

        await userEvent.click(await screen.findByRole("link", { name: "Rebuild the index" }));

        expect(await screen.findByRole("button", { name: "Start" })).toBeInTheDocument();
    });
});
