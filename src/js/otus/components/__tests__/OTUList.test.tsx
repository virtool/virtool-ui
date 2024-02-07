import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { connectRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import nock from "nock";
import React from "react";
import { combineReducers } from "redux";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeAccount, mockGetAccountAPI } from "../../../../tests/fake/account";
import { createFakeOTUMinimal, mockApiGetOTUs } from "../../../../tests/fake/otus";
import { createFakeReference, mockApiGetReferenceDetail } from "../../../../tests/fake/references";
import { createGenericReducer, renderWithRouter } from "../../../../tests/setupTests";
import { AdministratorRoles } from "../../../administration/types";
import OTUList from "../OTUList";

function createReducer(state, history) {
    return combineReducers({
        router: connectRouter(history),
        references: createGenericReducer(state.references),
        account: createGenericReducer(state.account),
        indexes: createGenericReducer(state.indexes),
    });
}

describe("<OTUsList />", () => {
    let history;
    let reference;
    let OTUs;
    let props;
    let state;

    beforeEach(() => {
        reference = createFakeReference();
        OTUs = [createFakeOTUMinimal(), createFakeOTUMinimal()];
        history = createBrowserHistory();
        mockApiGetReferenceDetail(reference);

        props = {
            match: { params: { refId: reference.id } },
        };
        state = {
            references: { detail: reference },
            account: { administrator_role: AdministratorRoles.FULL },
            indexes: { unbuilt: [] },
        };
    });

    afterEach(() => nock.cleanAll());

    describe("<OTUList />", () => {
        it("should render correctly", async () => {
            const scope = mockApiGetOTUs(OTUs, reference.id);
            renderWithRouter(<OTUList {...props} />, state, history, createReducer);

            expect(await screen.findByText(OTUs[0].name)).toBeInTheDocument();
            expect(screen.getByText(OTUs[0].abbreviation)).toBeInTheDocument();
            expect(screen.getByText(OTUs[1].name)).toBeInTheDocument();
            expect(screen.getByText(OTUs[1].abbreviation)).toBeInTheDocument();
            expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Name or abbreviation");

            scope.done();
        });

        it("should render when no documents are found", async () => {
            const scope = mockApiGetOTUs([], reference.id);
            renderWithRouter(<OTUList {...props} />, state, history, createReducer);

            expect(await screen.findByText("No OTUs found.")).toBeInTheDocument();
            expect(screen.queryByText(OTUs[0].name)).toBeNull();
            expect(screen.queryByText(OTUs[0].abbreviation)).toBeNull();

            scope.done();
        });
    });

    describe("<OTUToolbar />", () => {
        it("should render properly", async () => {
            const scope = mockApiGetOTUs(OTUs, reference.id);
            renderWithRouter(<OTUList {...props} />, state, history, createReducer);

            expect(await screen.findByRole("textbox")).toBeInTheDocument();

            scope.done();
        });

        it("should not render creation button when [canCreate=true]", async () => {
            const scope = mockApiGetOTUs(OTUs, reference.id);
            const account = createFakeAccount({
                administrator_role: AdministratorRoles.FULL,
            });
            mockGetAccountAPI(account);
            renderWithRouter(<OTUList {...props} />, state, history, createReducer);

            expect(await screen.findByText("Create")).toBeInTheDocument();

            scope.done();
        });

        it("should not render creation button when [canCreate=false]", async () => {
            const scope = mockApiGetOTUs(OTUs, reference.id);
            const account = createFakeAccount({
                administrator_role: null,
            });
            mockGetAccountAPI(account);
            renderWithRouter(<OTUList {...props} />, state, history, createReducer);

            expect(await screen.findByRole("textbox")).toBeInTheDocument();
            expect(screen.queryByText("Create")).toBeNull();

            scope.done();
        });

        it("should handle toolbar updates correctly", async () => {
            const scope = mockApiGetOTUs(OTUs, reference.id);
            renderWithRouter(<OTUList {...props} />, state, history, createReducer);

            expect(await screen.findByRole("textbox")).toBeInTheDocument();
            const inputElement = screen.getByPlaceholderText("Name or abbreviation");
            expect(inputElement).toHaveValue("");

            await userEvent.type(inputElement, "Foobar");
            expect(inputElement).toHaveValue("Foobar");

            expect(history.location.search).toEqual("?find=Foobar");

            scope.done();
        });
    });

    describe("<OTUItem />", () => {
        it("should render when [verified=true]", async () => {
            const scope = mockApiGetOTUs(OTUs, reference.id);
            renderWithRouter(<OTUList {...props} />, state, history, createReducer);

            expect(await screen.findByText(OTUs[0].name)).toBeInTheDocument();
            expect(screen.queryByText("Unverified")).toBeNull();

            scope.done();
        });

        it("should render when [verified=false]", async () => {
            const scope = mockApiGetOTUs([createFakeOTUMinimal({ verified: false })], reference.id);
            renderWithRouter(<OTUList {...props} />, state, history, createReducer);

            expect(await screen.findByText("Unverified")).toBeInTheDocument();
            scope.done();
        });
    });
});
