import { connectRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import React from "react";
import { combineReducers } from "redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createGenericReducer, renderWithRouter } from "../../../../tests/setupTests";
import { createFakeHMMData } from "../../classes";
import { HMMList } from "../List";

function createReducer(state, history) {
    return combineReducers({
        hmms: createGenericReducer(state.hmms),
        account: createGenericReducer(state.account),
        tasks: createGenericReducer(state.tasks),
        router: connectRouter(history),
    });
}

describe("<HMMList />", () => {
    let props;
    let state;
    let history;

    const fakeHMMData = createFakeHMMData();

    beforeEach(() => {
        props = {
            hmms: "HMMs",
            term: "",
            status: {
                installed: true,
            },
            documents: [],
            onLoadNextPage: vi.fn(),
        };
        state = {
            hmms: fakeHMMData,
            account: {
                permissions: {
                    modify_hmm: true,
                },
            },
            tasks: {
                documents: [{ id: "foo", step: "step 1", progress: 45 }],
                id: 1,
                progress: 10,
            },
        };
        history = createBrowserHistory();
    });

    it("should render correctly when documents = null", () => {
        props.documents = null;

        renderWithRouter(<HMMList {...props} />, state, history, createReducer);

        expect(screen.getByLabelText("loading")).toBeInTheDocument();

        expect(screen.queryByText("HMMs")).not.toBeInTheDocument();
    });

    it("should render correctly when no documents exist", () => {
        props.documents = [];

        renderWithRouter(<HMMList {...props} />, state, history, createReducer);

        expect(screen.getByText("HMMs")).toBeInTheDocument();
        expect(screen.getByText("No HMMs found.")).toBeInTheDocument();
    });

    it("should render correctly when documents not null", () => {
        props.documents = fakeHMMData.documents;
        props.documents[0] = {
            id: "1",
            cluster: 2,
            count: 216,
            families: { family1: 200, family2: 80, None: 10 },
            names: ["Name1", "Name2", "Name3"],
        };

        renderWithRouter(<HMMList {...props} />, state, history, createReducer);

        expect(screen.getByPlaceholderText("Definition")).toBeInTheDocument();

        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByText("Name1")).toBeInTheDocument();
        expect(screen.getByText("family1")).toBeInTheDocument();
        expect(screen.getByText("family2")).toBeInTheDocument();
    });

    describe("<HMMInstaller />", () => {
        it("should render correctly when installed = false and user has permission to install", () => {
            props.status.installed = false;

            renderWithRouter(<HMMList {...props} />, state, history, createReducer);

            expect(screen.getByText("HMMs")).toBeInTheDocument();

            expect(screen.getByText("No HMM data available.")).toBeInTheDocument();
            expect(
                screen.getByText(/You can download and install the official HMM data automatically from our/),
            ).toBeInTheDocument();
            expect(screen.getByText("GitHub repository")).toBeInTheDocument();

            expect(screen.getByRole("button", { name: "Install" })).toBeInTheDocument();
        });

        it("should render correctly when installed = false and user does not have permission to install", () => {
            props.status.installed = false;
            state.account.permissions.modify_hmm = false;

            renderWithRouter(<HMMList {...props} />, state, history, createReducer);

            expect(screen.getByText("You do not have permission to install HMMs.")).toBeInTheDocument();
            expect(screen.getByText("Contact an administrator.")).toBeInTheDocument();

            expect(screen.queryByRole("button", { name: "Install" })).not.toBeInTheDocument();
        });

        it("should render correctly when installed = false, user has permission to install and task !== undefined", () => {
            props.status.installed = false;
            state.hmms.status = {
                task: {
                    id: "foo",
                },
            };

            renderWithRouter(<HMMList {...props} />, state, history, createReducer);

            expect(screen.getByText("Installing")).toBeInTheDocument();
            expect(screen.getByText("step 1")).toBeInTheDocument();

            expect(screen.queryByText("No HMM data available.")).not.toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "Install" })).not.toBeInTheDocument();
        });
    });
});
