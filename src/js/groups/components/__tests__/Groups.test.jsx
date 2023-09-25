import { configureStore } from "@reduxjs/toolkit";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConnectedRouter, connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import React from "react";
import { Provider } from "react-redux";
import { combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeGroup, mockApiGetGroup, mockApiListGroups } from "../../../../tests/fake/groups";
import { renderWithProviders } from "../../../../tests/setupTests";
import { watchRouter } from "../../../app/sagas";
import { Groups } from "../Groups";

const createAppStore = (state, history) => {
    const reducer = combineReducers({
        router: connectRouter(history),
    });
    const sagaMiddleware = createSagaMiddleware();
    const store = configureStore({
        reducer: reducer,
        middleware: [sagaMiddleware, routerMiddleware(history)],
    });
    sagaMiddleware.run(watchRouter);

    return store;
};

const renderWithRouter = (ui, state, history) => {
    const wrappedUI = (
        <Provider store={createAppStore(state, history)}>
            <ConnectedRouter history={history}> {ui} </ConnectedRouter>
        </Provider>
    );
    renderWithProviders(wrappedUI);
};

describe("Groups", () => {
    let props;
    let state;
    let history;

    beforeEach(() => {
        props = {
            loading: false,
            groups: [
                {
                    name: "testName",
                    id: 1,
                    permissions: {
                        cancel_job: true,
                        create_ref: false,
                        create_sample: true,
                        modify_hmm: true,
                        modify_subtraction: false,
                        remove_file: true,
                        remove_job: true,
                        upload_file: true,
                    },
                },
            ],
            onShowCreateGroup: vi.fn(),
            activeGroup: {
                name: "testName",
                id: 1,
                permissions: {
                    cancel_job: true,
                    create_ref: false,
                    create_sample: true,
                    modify_hmm: true,
                    modify_subtraction: false,
                    remove_file: true,
                    remove_job: true,
                    upload_file: true,
                },
            },
        };
        state = {};
        history = createBrowserHistory();
    });

    it("should render correctly when loading = true", () => {
        renderWithRouter(<Groups />, state, history);

        expect(screen.queryByText("No Groups Found")).not.toBeInTheDocument();
        expect(screen.queryByText("cancel_job")).not.toBeInTheDocument();
        expect(screen.queryByText("No Group Members")).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
    });

    it("should render correctly when no groups exist", async () => {
        mockApiListGroups([]);
        renderWithRouter(<Groups />, state, history);

        expect(await screen.findByText("No Groups Found")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
        expect(screen.getByText("Create")).toBeInTheDocument();
    });

    it("should render correctly when one groups exists and group contains no members", async () => {
        const group = createFakeGroup();
        mockApiListGroups([group]);
        mockApiGetGroup(group);
        renderWithRouter(<Groups />, state, history);

        expect(await screen.findByRole("button", { name: "Delete" })).toBeInTheDocument();
        expect(screen.queryByText("No groups found")).not.toBeInTheDocument();
        expect(screen.getByText("cancel_job")).toBeInTheDocument();
        expect(screen.getByText("No Group Members")).toBeInTheDocument();
        expect(screen.getAllByText(group.name)).toHaveLength(1);
        expect(screen.getByRole("textbox", { name: "name" })).toHaveValue(group.name);
    });

    it("should render create new group view correctly", async () => {
        mockApiListGroups([]);
        renderWithRouter(<Groups />, state, history);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

        await userEvent.click(await screen.findByText("Create"));

        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "" })).toBeInTheDocument();
    });

    it("should render correctly when active group has a group member", async () => {
        const group = createFakeGroup({ users: [{ handle: "testUser1", administrator: false, id: "test_id" }] });
        mockApiListGroups([group]);
        mockApiGetGroup(group);

        renderWithRouter(<Groups />, state, history);

        expect(await screen.findByText("Members")).toBeInTheDocument();
        expect(screen.getByText("testUser1")).toBeInTheDocument();
        expect(screen.queryByText("No Group Members")).not.toBeInTheDocument();
    });

    it("should render correctly when more than one group exists", async () => {
        const group_1 = createFakeGroup({
            users: [{ handle: "testUser1", administrator: false, id: "test_id" }],
            permissions: { create_sample: true, modify_hmm: true },
            name: "testName",
        });
        const group_2 = createFakeGroup({
            users: [{ handle: "testUser2", administrator: false, id: "test_id2" }],
            permissions: { create_sample: true, modify_hmm: true, remove_job: true },
            name: "testName2",
        });

        mockApiListGroups([group_1, group_2]);
        mockApiGetGroup(group_1);

        renderWithRouter(<Groups {...props} />, state, history);

        expect(await screen.findByText("testName")).toBeInTheDocument();
        expect(screen.getByText("testName2")).toBeInTheDocument();
        expect(screen.getByText("testUser1")).toBeInTheDocument();
    });
});
