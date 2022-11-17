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
                        upload_file: true
                    }
                }
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
                            upload_file: true
                        }
                    }
                ],
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
                        upload_file: true
                    }
                }
            },
            users: {
                documents: {
                    handle: "testUser",
                    permissions: { permission1: true, permission2: false, permission3: true }
                }
            }
        };
        history = createBrowserHistory();
    });

    it("should render correctly when loading = true", () => {
        state.groups.documents = null;
        renderWithRouter(<Groups />, state, history);
        expect(screen.queryByText("Manage Groups")).not.toBeInTheDocument();
        expect(screen.queryByText("No Groups Found")).not.toBeInTheDocument();
        expect(screen.queryByText("cancel_job")).not.toBeInTheDocument();
        expect(screen.queryByText("No Group Members")).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
    });

    it("should render correctly when no groups exist", () => {
        state.groups.documents = [];
        renderWithRouter(<Groups />, state, history);
        expect(screen.getByText("No Groups Found")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
        expect(screen.getByText("Manage Groups")).toBeInTheDocument();
        expect(screen.getByText("Use groups to organize users and control access")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
    });

    it("should render correctly when one groups exists and group contains no members", () => {
        renderWithRouter(<Groups />, state, history);
        expect(screen.queryByText("No groups found")).not.toBeInTheDocument();
        expect(screen.getByText("Manage Groups")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
        expect(screen.getByText("cancel_job")).toBeInTheDocument();
        expect(screen.getByText("No Group Members")).toBeInTheDocument();
        const groupNameOccurrences = screen.getAllByText("testName");
        expect(groupNameOccurrences.length).toBe(2);
    });

    it("should render create new group view correctly", () => {
        renderWithRouter(<Groups />, state, history);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "Create" }));
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        const saveButton = screen.getByRole("button", { name: "Save" });
        const input = screen.getByRole("textbox", { name: "" });
        expect(saveButton).toBeInTheDocument();
        expect(input).toBeInTheDocument();
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
                    upload_file: true
                }
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
                    upload_file: false
                }
            }
        ];
        renderWithRouter(<Groups {...props} />, state, history);
        const groupNameOccurrences = screen.getAllByText("testName");
        expect(groupNameOccurrences.length).toBe(2);
        expect(screen.getByText("secondTestName")).toBeInTheDocument();
        expect(screen.getByText("testUser1")).toBeInTheDocument();
    });
});
