import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { connectRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import nock from "nock";
import React from "react";
import { combineReducers } from "redux";
import { describe, expect, it } from "vitest";
import { createFakeAccount, mockGetAccountAPI } from "../../../../tests/fake/account";
import { createFakePermissions } from "../../../../tests/fake/permissions";
import {
    createFakeReferenceMinimal,
    mockApiCloneReference,
    mockApiGetReferences,
} from "../../../../tests/fake/references";
import { createGenericReducer, renderWithRouter } from "../../../../tests/setupTests";
import ReferenceList from "../ReferenceList";

function createReducer(state, history) {
    return combineReducers({
        tasks: createGenericReducer(state.tasks),
        router: connectRouter(history),
    });
}

describe("<ReferenceList />", () => {
    let history;
    let references;
    let state;

    beforeEach(() => {
        state = {
            tasks: {
                documents: [{ complete: true }],
            },
        };
        references = createFakeReferenceMinimal();
        history = createBrowserHistory();
    });

    afterEach(() => nock.cleanAll());

    it("should render correctly", async () => {
        const scope = mockApiGetReferences([references]);
        renderWithRouter(<ReferenceList />, state, history, createReducer);

        expect(await screen.findByText("References")).toBeInTheDocument();
        expect(screen.getByText(references.name)).toBeInTheDocument();
        expect(screen.getByText(references.cloned_from.name)).toBeInTheDocument();

        scope.done();
    });

    describe("<ReferenceToolbar />", () => {
        it("should render when toolbar term is changed to foo", async () => {
            const scope = mockApiGetReferences([references]);
            renderWithRouter(<ReferenceList />, state, history, createReducer);

            expect(await screen.findByText("References")).toBeInTheDocument();

            const inputElement = screen.getByPlaceholderText("Reference name");
            expect(inputElement).toHaveValue("");

            await userEvent.type(inputElement, "Foo");
            expect(inputElement).toHaveValue("Foo");

            await userEvent.clear(inputElement);
            scope.done();
        });

        it("should not render creation button when [canCreate=false]", async () => {
            const permissions = createFakePermissions({ create_ref: true });
            const account = createFakeAccount({ permissions: permissions });
            mockGetAccountAPI(account);
            const scope = mockApiGetReferences([references]);
            renderWithRouter(<ReferenceList />, state, history, createReducer);

            expect(await screen.findByText("References")).toBeInTheDocument();
            expect(screen.queryByLabelText("plus-square fa-fw")).toBeNull();

            scope.done();
        });

        it("should not render creation button when [canCreate=true]", async () => {
            const permissions = createFakePermissions({ create_ref: true });
            const account = createFakeAccount({ permissions: permissions });
            mockGetAccountAPI(account);
            const scope = mockApiGetReferences([references]);
            renderWithRouter(<ReferenceList />, state, history, createReducer);

            expect(await screen.findByLabelText("plus-square fa-fw")).toBeInTheDocument();

            scope.done();
        });
        it("should handle toolbar updates correctly", async () => {
            const scope = mockApiGetReferences([references]);
            renderWithRouter(<ReferenceList />, state, history, createReducer);

            expect(await screen.findByText("References")).toBeInTheDocument();

            const inputElement = screen.getByPlaceholderText("Reference name");
            expect(inputElement).toHaveValue("");

            await userEvent.type(inputElement, "Foobar");
            expect(inputElement).toHaveValue("Foobar");

            expect(history.location.search).toEqual("?find=Foobar");

            scope.done();
        });
    });

    describe("<CloneReference />", () => {
        it("handleSubmit() should mutate with correct input", async () => {
            const getReferencesScope = mockApiGetReferences([references]);
            const cloneReferenceScope = mockApiCloneReference(
                `Clone of ${references.name}`,
                `Cloned from ${references.name}`,
                references,
            );
            renderWithRouter(<ReferenceList />, state, history, createReducer);

            expect(await screen.findByText("References")).toBeInTheDocument();
            await userEvent.click(screen.getByLabelText("clone"));

            await userEvent.click(screen.getByRole("button", { name: "Clone" }));

            getReferencesScope.done();
            cloneReferenceScope.done();
        });

        it("handleSubmit() should mutate with changed input", async () => {
            const getReferencesScope = mockApiGetReferences([references]);
            const cloneReferenceScope = mockApiCloneReference("newName", `Cloned from ${references.name}`, references);
            renderWithRouter(<ReferenceList />, state, history, createReducer);

            expect(await screen.findByText("References")).toBeInTheDocument();
            await userEvent.click(screen.getByLabelText("clone"));

            await userEvent.clear(screen.getByRole("textbox"));
            await userEvent.type(screen.getByRole("textbox"), "newName");
            await userEvent.click(screen.getByRole("button", { name: "Clone" }));

            getReferencesScope.done();
            cloneReferenceScope.done();
        });
    });

    it("should display an error when name input is cleared", async () => {
        const scope = mockApiGetReferences([references]);
        renderWithRouter(<ReferenceList />, state, history, createReducer);

        expect(await screen.findByText("References")).toBeInTheDocument();
        await userEvent.click(screen.getByLabelText("clone"));

        await userEvent.clear(screen.getByRole("textbox"));
        await userEvent.click(screen.getByRole("button", { name: "Clone" }));

        expect(screen.getByText("Required Field")).toBeInTheDocument();

        scope.done();
    });
});
