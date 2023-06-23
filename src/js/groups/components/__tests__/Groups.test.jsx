import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConnectedRouter, connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import React from "react";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { mockListGroupsAPI } from "../../../../tests/fake/groups";
import { watchRouter } from "../../../app/sagas";
import { Groups } from "../Groups";

const createGenericReducer = initState => state => state || initState;

const createAppStore = (state, history) => {
    const reducer = combineReducers({
        router: connectRouter(history),
    });
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(reducer, applyMiddleware(sagaMiddleware, routerMiddleware(history)));

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
        renderWithRouter(<Groups />, state, history);
        mockListGroupsAPI([]);

        expect(await screen.findByText("No Groups Found")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
        expect(screen.getByText("Create")).toBeInTheDocument();
    });

    it("should render correctly when one groups exists and group contains no members", () => {
        renderWithRouter(<Groups />, state, history);

        expect(screen.queryByText("No groups found")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
        expect(screen.getByText("cancel_job")).toBeInTheDocument();
        expect(screen.getByText("No Group Members")).toBeInTheDocument();
        expect(screen.getAllByText("testName")).toHaveLength(1);
        expect(screen.getByRole("textbox", { name: "name" })).toHaveValue("testName");
    });

    it("should render create new group view correctly", async () => {
        renderWithRouter(<Groups />, state, history);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

        await userEvent.click(screen.getByText("Create"));

        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "" })).toBeInTheDocument();
    });

    it("should render correctly when active group has a group member", () => {
        state.users.documents = [{ handle: "testUser1", groups: { 0: { id: 1 } } }];

        renderWithRouter(<Groups />, state, history);

        expect(screen.getByText("Members")).toBeInTheDocument();
        expect(screen.getByText("testUser1")).toBeInTheDocument();
        expect(screen.queryByText("No Group Members")).not.toBeInTheDocument();
    });

    it("should render correctly when more than one group exists", () => {
        state.users.documents = [{ handle: "testUser1", groups: { 0: { id: 1 } } }];
        state.groups.documents = [
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
            {
                name: "secondTestName",
                id: 2,
                permissions: {
                    cancel_job: false,
                    create_ref: false,
                    create_sample: true,
                    modify_hmm: true,
                    modify_subtraction: false,
                    remove_file: false,
                    remove_job: true,
                    upload_file: false,
                },
            },
        ];

        renderWithRouter(<Groups {...props} />, state, history);

        expect(screen.getByText("testName")).toBeInTheDocument();
        expect(screen.getByText("secondTestName")).toBeInTheDocument();
        expect(screen.getByText("testUser1")).toBeInTheDocument();
    });
});
