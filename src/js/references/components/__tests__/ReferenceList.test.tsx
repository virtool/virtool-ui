import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { describe, expect, it } from "vitest";
import { createFakeAccount, mockAPIGetAccount } from "../../../../tests/fake/account";
import { createFakePermissions } from "../../../../tests/fake/permissions";
import {
    createFakeReferenceMinimal,
    mockApiCloneReference,
    mockApiGetReferences,
} from "../../../../tests/fake/references";
import { renderWithRouter } from "../../../../tests/setupTests";
import ReferenceList from "../ReferenceList";

describe("<ReferenceList />", () => {
    let history;
    let references;
    let state;

    beforeEach(() => {
        references = createFakeReferenceMinimal();
        history = createMemoryHistory();
    });

    afterEach(() => nock.cleanAll());

    it("should render correctly", async () => {
        const permissions = createFakePermissions({ create_ref: true });
        const account = createFakeAccount({ permissions: permissions });
        mockAPIGetAccount(account);
        const scope = mockApiGetReferences([references]);
        renderWithRouter(<ReferenceList />, state, history);

        expect(await screen.findByText("References")).toBeInTheDocument();
        expect(screen.getByText(references.name)).toBeInTheDocument();
        expect(screen.getByText(`${references.user.handle} created`)).toBeInTheDocument();
        expect(screen.getByText(`${references.organism} ${references.data_type}s`)).toBeInTheDocument();

        expect(await screen.findByRole("link", { name: "clone" })).toBeInTheDocument();
        expect(screen.getByLabelText("clone")).toBeInTheDocument();

        scope.done();
    });

    describe("<ReferenceToolbar />", () => {
        it("should render when toolbar term is changed to foo", async () => {
            const scope = mockApiGetReferences([references]);
            renderWithRouter(<ReferenceList />, state, history);

            expect(await screen.findByText("References")).toBeInTheDocument();

            const inputElement = screen.getByPlaceholderText("Reference name");
            expect(inputElement).toHaveValue("");

            await userEvent.type(inputElement, "Foo");
            expect(inputElement).toHaveValue("Foo");

            await userEvent.clear(inputElement);
            scope.done();
        });

        it("should not render creation button when [canCreate=false]", async () => {
            const scope = mockApiGetReferences([references]);
            renderWithRouter(<ReferenceList />, state, history);

            expect(await screen.findByText("References")).toBeInTheDocument();
            expect(screen.queryByLabelText("plus-square fa-fw")).toBeNull();

            scope.done();
        });

        it("should not render creation button when [canCreate=true]", async () => {
            const permissions = createFakePermissions({ create_ref: true });
            const account = createFakeAccount({ permissions: permissions });
            mockAPIGetAccount(account);
            const scope = mockApiGetReferences([references]);
            renderWithRouter(<ReferenceList />, state, history);

            expect(await screen.findByLabelText("plus-square fa-fw")).toBeInTheDocument();

            scope.done();
        });

        it("should handle toolbar updates correctly", async () => {
            const scope = mockApiGetReferences([references]);
            renderWithRouter(<ReferenceList />, state, history);

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
            const permissions = createFakePermissions({ create_ref: true });
            const account = createFakeAccount({ permissions: permissions });
            mockAPIGetAccount(account);
            const getReferencesScope = mockApiGetReferences([references]);
            const cloneReferenceScope = mockApiCloneReference(
                `Clone of ${references.name}`,
                `Cloned from ${references.name}`,
                references,
            );
            renderWithRouter(<ReferenceList />, state, history);

            expect(await screen.findByText("References")).toBeInTheDocument();
            await userEvent.click(await screen.findByRole("link", { name: "clone" }));
            await userEvent.click(screen.getByRole("button", { name: "Clone" }));

            getReferencesScope.done();
            cloneReferenceScope.done();
        });

        it("handleSubmit() should mutate with changed input", async () => {
            const permissions = createFakePermissions({ create_ref: true });
            const account = createFakeAccount({ permissions: permissions });
            mockAPIGetAccount(account);
            const getReferencesScope = mockApiGetReferences([references]);
            const cloneReferenceScope = mockApiCloneReference("newName", `Cloned from ${references.name}`, references);
            renderWithRouter(<ReferenceList />, state, history);

            expect(await screen.findByText("References")).toBeInTheDocument();
            await userEvent.click(await screen.findByRole("link", { name: "clone" }));
            await userEvent.clear(screen.getByRole("textbox"));
            await userEvent.type(screen.getByRole("textbox"), "newName");
            await userEvent.click(screen.getByRole("button", { name: "Clone" }));

            getReferencesScope.done();
            cloneReferenceScope.done();
        });

        it("should display an error when name input is cleared", async () => {
            const permissions = createFakePermissions({ create_ref: true });
            const account = createFakeAccount({ permissions: permissions });
            mockAPIGetAccount(account);
            const scope = mockApiGetReferences([references]);
            renderWithRouter(<ReferenceList />, state, history);

            expect(await screen.findByText("References")).toBeInTheDocument();
            await userEvent.click(await screen.findByRole("link", { name: "clone" }));
            await userEvent.clear(screen.getByRole("textbox"));
            await userEvent.click(screen.getByRole("button", { name: "Clone" }));
            expect(screen.getByText("Required Field")).toBeInTheDocument();

            scope.done();
        });
    });
});
