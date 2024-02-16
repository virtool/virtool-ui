import { screen } from "@testing-library/react";
import { connectRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import nock from "nock";
import React from "react";
import { combineReducers } from "redux";
import { describe, expect, it } from "vitest";
import { createFakeAccount, mockAPIGetAccount } from "../../../../tests/fake/account";
import { createFakeHMMSearchResults, mockApiGetHmms } from "../../../../tests/fake/hmm";
import { createGenericReducer, renderWithRouter } from "../../../../tests/setupTests";
import { AdministratorRoles } from "../../../administration/types";
import HMMList from "../HMMList";

function createReducer(state, history) {
    return combineReducers({
        hmms: createGenericReducer(state.hmms),
        tasks: createGenericReducer(state.tasks),
        router: connectRouter(history),
    });
}

describe("<HMMList />", () => {
    const history = createBrowserHistory();
    const fakeHMMData = createFakeHMMSearchResults();
    let state;

    beforeEach(() => {
        state = {
            hmms: fakeHMMData,
            tasks: {
                documents: [
                    {
                        complete: false,
                        id: 21,
                        progress: 33,
                        step: "decompress",
                    },
                ],
                id: 1,
                progress: 10,
            },
        };
    });

    afterEach(() => nock.cleanAll());

    it("should render correctly", async () => {
        const scope = mockApiGetHmms(fakeHMMData);
        renderWithRouter(<HMMList />, {}, history);

        expect(await screen.findByText("HMMs")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Definition")).toBeInTheDocument();

        expect(screen.getByText(fakeHMMData.documents[0].cluster)).toBeInTheDocument();
        expect(screen.getByText(fakeHMMData.documents[0].names[0])).toBeInTheDocument();

        scope.done();
    });

    it("should render correctly when no documents exist", async () => {
        const fakeHMMData = createFakeHMMSearchResults({ documents: [] });
        const scope = mockApiGetHmms(fakeHMMData);
        renderWithRouter(<HMMList />, {}, history);

        expect(await screen.findByText("HMMs")).toBeInTheDocument();
        expect(screen.getByText("No HMMs found.")).toBeInTheDocument();

        scope.done();
    });

    describe("<HMMInstaller />", () => {
        it("should render correctly when installed = false and user has permission to install", async () => {
            const fakeHMMData = createFakeHMMSearchResults({ documents: [], total_count: 0 });
            const scope = mockApiGetHmms(fakeHMMData);
            const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
            mockAPIGetAccount(account);
            renderWithRouter(<HMMList />, state, history, createReducer);

            expect(await screen.findByText("HMMs")).toBeInTheDocument();

            expect(screen.getByText("No HMM data available.")).toBeInTheDocument();
            expect(
                screen.getByText(/You can download and install the official HMM data automatically from our/),
            ).toBeInTheDocument();
            expect(screen.getByText("GitHub repository")).toBeInTheDocument();

            expect(await screen.findByRole("button", { name: "Install" })).toBeInTheDocument();

            scope.done();
        });

        it("should render correctly when installed = false and user does not have permission to install", async () => {
            const fakeHMMData = createFakeHMMSearchResults({ documents: [], total_count: 0 });
            const scope = mockApiGetHmms(fakeHMMData);
            const account = createFakeAccount({ administrator_role: null });
            mockAPIGetAccount(account);
            renderWithRouter(<HMMList />, state, history, createReducer);

            expect(await screen.findByText("HMMs")).toBeInTheDocument();

            expect(screen.getByText("You do not have permission to install HMMs.")).toBeInTheDocument();
            expect(screen.getByText("Contact an administrator.")).toBeInTheDocument();

            expect(screen.queryByRole("button", { name: "Install" })).not.toBeInTheDocument();

            scope.done();
        });

        it("should render correctly when installed = false, user has permission to install and task !== undefined", async () => {
            const fakeHMMData = createFakeHMMSearchResults({
                documents: [],
                total_count: 0,
                status: {
                    task: {
                        complete: false,
                        id: 21,
                        progress: 33,
                        step: "decompress",
                    },
                },
            });
            const scope = mockApiGetHmms(fakeHMMData);
            const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
            mockAPIGetAccount(account);
            renderWithRouter(<HMMList />, state, history, createReducer);

            expect(await screen.findByText("HMMs")).toBeInTheDocument();

            expect(screen.getByText("Installing")).toBeInTheDocument();
            expect(screen.getByText("decompress")).toBeInTheDocument();

            expect(screen.queryByText("No HMM data available.")).not.toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "Install" })).not.toBeInTheDocument();

            scope.done();
        });
    });
});
