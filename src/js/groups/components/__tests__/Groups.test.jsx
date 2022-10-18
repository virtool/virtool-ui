import userEvent from "@testing-library/user-event";
import { ConnectedRouter, connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import React from "react";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import Groups from "../Groups";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { screen } from "@testing-library/react";
import { watchRouter } from "../../../app/sagas";

const createGenericReducer = initState => state => state || initState;

const createAppStore = (state, history) => {
    const reducer = combineReducers({
        router: connectRouter(history),
        groups: createGenericReducer(state.groups),
        users: createGenericReducer(state.users)
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
                    id: "testid",
                    permissions: {
                        cancel_job: true,
                        create_ref: false,
                        create_sample: true,
                        modify_hmm: true,
                        modify_subtraction: false,
                        remove_file: true,
                        remove_job: true,
                        upload_file: true
                    }
                }
            ],
            onShowCreateGroup: vi.fn(),
            activeGroup: {
                id: "testid",
                permissions: {
                    cancel_job: true,
                    create_ref: false,
                    create_sample: true,
                    modify_hmm: true,
                    modify_subtraction: false,
                    remove_file: true,
                    remove_job: true,
                    upload_file: true
                }
            },
            onListGroups: vi.fn(),
            onFindUsers: vi.fn()
        };
        state = {
            groups: {
                documents: [
                    {
                        id: "testid",
                        permissions: {
                            cancel_job: true,
                            create_ref: false,
                            create_sample: true,
                            modify_hmm: true,
                            modify_subtraction: false,
                            remove_file: true,
                            remove_job: true,
                            upload_file: true
                        }
                    }
                ],
                activeGroup: {
                    id: "testid",
                    permissions: {
                        cancel_job: true,
                        create_ref: false,
                        create_sample: true,
                        modify_hmm: true,
                        modify_subtraction: false,
                        remove_file: true,
                        remove_job: true,
                        upload_file: true
                    }
                }
            },
            users: {
                documents: {
                    handle: "testuser",
                    permissions: { permission1: true, permission2: false, permission3: true }
                }
            }
        };
        history = createBrowserHistory();
    });

    it("should render correctly when loading = true", () => {
        state.groups.documents = null;
        renderWithRouter(<Groups />, state, history);
        renderWithRouter(<Groups />, state, history);
        expect(screen.queryByText("Manage Groups")).not.toBeInTheDocument();
        expect(screen.queryByText("No Groups Found")).not.toBeInTheDocument();
        expect(screen.queryByText("cancel_job")).not.toBeInTheDocument();
        expect(screen.queryByText("No Group Members")).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Remove Group" })).not.toBeInTheDocument();
    });

    it("should render correctly when no groups exist", () => {
        state.groups.documents = [];
        renderWithRouter(<Groups />, state, history);
        expect(screen.getByText("No Groups Found")).toBeInTheDocument();
        expect(screen.queryByText("Groups")).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Remove Group" })).not.toBeInTheDocument();
        expect(screen.getByText("Manage Groups")).toBeInTheDocument();
        expect(screen.queryByText("Create Group")).not.toBeInTheDocument();
    });

    it("should render correctly when one groups exists and group contains no members", () => {
        renderWithRouter(<Groups />, state, history);
        expect(screen.queryByText("No groups exist")).not.toBeInTheDocument();
        expect(screen.getByText("Manage Groups")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Remove Group" })).toBeInTheDocument();
        expect(screen.getByText("cancel_job")).toBeInTheDocument();
        expect(screen.getByText("No Group Members")).toBeInTheDocument();
        expect(screen.getByText("testid")).toBeInTheDocument();
    });

    it("should render create new group view correctly", () => {
        renderWithRouter(<Groups />, state, history);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "" }));
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        const saveButton = screen.getByRole("button", { name: "Save" });
        const input = screen.getByRole("textbox", { name: "" });
        expect(saveButton).toBeInTheDocument();
        expect(input).toBeInTheDocument();
    });

    it("should render correctly when active group has a group member", () => {
        state.users.documents = [{ handle: "testuser1", groups: { 0: { id: "testid" } } }];
        renderWithRouter(<Groups />, state, history);
        expect(screen.getByText("testuser1")).toBeInTheDocument();
        expect(screen.queryByText("No Members Found")).not.toBeInTheDocument();
    });

    it("should render correctly when more than one group exists", () => {
        state.users.documents = [{ handle: "testuser1", groups: { 0: { id: "testid" } } }];
        state.groups.documents = [
            {
                id: "testid",
                permissions: {
                    cancel_job: true,
                    create_ref: false,
                    create_sample: true,
                    modify_hmm: true,
                    modify_subtraction: false,
                    remove_file: true,
                    remove_job: true,
                    upload_file: true
                }
            },
            {
                id: "secondtestid",
                permissions: {
                    cancel_job: false,
                    create_ref: false,
                    create_sample: true,
                    modify_hmm: true,
                    modify_subtraction: false,
                    remove_file: false,
                    remove_job: true,
                    upload_file: false
                }
            }
        ];
        renderWithRouter(<Groups {...props} />, state, history);
        expect(screen.getByText("testid")).toBeInTheDocument();
        expect(screen.getByText("secondtestid")).toBeInTheDocument();
        expect(screen.getByText("testuser1")).toBeInTheDocument();
    });
});
