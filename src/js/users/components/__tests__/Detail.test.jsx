import { getFakeUserDetail } from "../../classes";
import { UserDetail, mapDispatchToProps, mapStateToProps } from "../Detail";
import { ConnectedRouter, connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import React from "react";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { screen } from "@testing-library/react";
import { watchRouter } from "../../../app/sagas";

const createGenericReducer = initState => state => state || initState;

const createAppStore = (state, history) => {
    const reducer = combineReducers({
        router: connectRouter(history),
        users: createGenericReducer(state.users),
        settings: createGenericReducer(state.settings),
        groups: createGenericReducer(state.groups),
        account: createGenericReducer(state.account)
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

describe("<UserDetail />", () => {
    let props;
    let state;
    let history;

    beforeEach(() => {
        const userDetail = getFakeUserDetail();
        props = {
            match: {
                params: {
                    userId: "foo"
                }
            },
            error: [],
            detail: userDetail,

            onGetUser: vi.fn(),
            onRemoveUser: vi.fn(),
            onListGroups: vi.fn(),
            onSetPrimaryGroup: vi.fn(),
            onSubmit: vi.fn()
        };

        state = {
            users: {
                detail: userDetail
            },
            settings: {
                data: {
                    minimum_password_length: 4
                }
            },
            groups: {
                documents: userDetail.groups
            },
            account: {
                id: userDetail.id,
                administrator: true
            }
        };
        history = createBrowserHistory();
    });

    describe("<UserDetail />", () => {
        it("should render correctly when administrator=true, canModifyUser=true and 5 groups exist", () => {
            state.users.detail.id = "123456789";
            props.detail.handle = "bob";
            props.detail.id = "1";
            props.detail.administrator = true;
            renderWithRouter(<UserDetail {...props} />, state, history);
            expect(screen.getByText("bob")).toBeInTheDocument();
            expect(screen.getByLabelText("admin")).toBeInTheDocument();
            expect(screen.getByText("Back To List")).toBeInTheDocument();
            expect(screen.getByText("Force user to reset password on next login")).toBeInTheDocument();
            expect(screen.getByText("Groups")).toBeInTheDocument();
            expect(screen.getByText("Group0")).toBeInTheDocument();
            expect(screen.getByText("Group1")).toBeInTheDocument();
            expect(screen.getByText("Group2")).toBeInTheDocument();
            expect(screen.getByText("Group3")).toBeInTheDocument();
            expect(screen.getByText("Primary Group")).toBeInTheDocument();
            expect(screen.getByRole("option", { name: "None" })).toBeInTheDocument();
            expect(screen.getByRole("option", { name: "Group1" })).toBeInTheDocument();
            expect(screen.getByRole("option", { name: "Group4" })).toBeInTheDocument();
            expect(screen.getByText("Permissions")).toBeInTheDocument();
            expect(screen.getByText("Change group membership to modify permissions")).toBeInTheDocument();
            expect(screen.getByText("cancel_job")).toBeInTheDocument();
            expect(screen.getByText("create_sample")).toBeInTheDocument();
            expect(screen.getByText("User Role")).toBeInTheDocument();
            expect(screen.getByText("Change Password")).toBeInTheDocument();
        });

        it("should render correctly when details = null", () => {
            props.detail = null;
            renderWithRouter(<UserDetail {...props} />, state, history);
            expect(screen.getByLabelText("loading")).toBeInTheDocument();
            expect(screen.queryByText("Groups")).not.toBeInTheDocument();
            expect(screen.queryByText("bob")).not.toBeInTheDocument();
        });

        it("should render correctly when [administrator=false] and canModifyUser=false", () => {
            props.detail.administrator = false;
            renderWithRouter(<UserDetail {...props} />, state, history);
            expect(screen.queryByLabelText("admin")).not.toBeInTheDocument();
            expect(screen.queryByText("User Role")).not.toBeInTheDocument();
            expect(screen.getByText("Group4")).toBeInTheDocument();
            expect(screen.getByText("create_sample")).toBeInTheDocument();
        });

        it("should call onGetUser() and onListGroups() on mount", () => {
            expect(props.onGetUser).not.toHaveBeenCalled();
            expect(props.onListGroups).not.toHaveBeenCalled();
            renderWithRouter(<UserDetail {...props} />, state, history);
            expect(props.onGetUser).toHaveBeenCalledWith("foo");
            expect(props.onListGroups).toHaveBeenCalled();
        });

        it("should render correctly when error exists", () => {
            props.error = ["invalid permission error"];
            renderWithRouter(<UserDetail {...props} />, state, history);
            expect(screen.getByText("You do not have permission to manage users.")).toBeInTheDocument();
            expect(screen.getByText("Contact an administrator.")).toBeInTheDocument();
            expect(screen.queryByText("bob")).not.toBeInTheDocument();
            expect(screen.queryByText("Groups")).not.toBeInTheDocument();
            expect(screen.queryByText("Permissions")).not.toBeInTheDocument();
        });
    });
    describe("<UserGroups />", () => {
        it("should render correctly when documents not null", () => {
            renderWithRouter(<UserDetail {...props} />, state, history);
            expect(screen.getByText("Groups")).toBeInTheDocument();
            expect(screen.getByLabelText("group1")).toBeInTheDocument();
            expect(screen.getByLabelText("group3")).toBeInTheDocument();
        });
        it("should render loading when documents = null", () => {
            state.groups.documents = null;
            renderWithRouter(<UserDetail {...props} />, state, history);
            expect(screen.getByLabelText("loading")).toBeInTheDocument();
            expect(screen.queryByText("Groups")).not.toBeInTheDocument();
            expect(screen.queryByLabelText("Group1")).not.toBeInTheDocument();
            expect(screen.queryByLabelText("Group3")).not.toBeInTheDocument();
            expect(screen.getByText("Permissions")).toBeInTheDocument();
        });
        it("should render NoneFound when documents = []", () => {
            state.groups.documents = [];
            renderWithRouter(<UserDetail {...props} />, state, history);
            expect(screen.getByText("Groups")).toBeInTheDocument();
            expect(screen.getByText("No groups found")).toBeInTheDocument();
            expect(screen.queryByLabelText("group3")).not.toBeInTheDocument();
            expect(screen.getByText("Primary Group")).toBeInTheDocument();
            expect(screen.getByRole("option", { name: "None" })).toBeInTheDocument();
        });
    });

    describe("<Password />", () => {
        it("should render correctly when forceReset = false", () => {
            props.detail.force_reset = false;
            renderWithRouter(<UserDetail {...props} />, state, history);
            expect(screen.getByText("Change Password")).toBeInTheDocument();
            expect(screen.getByText("Last changed")).toBeInTheDocument();
            const input = screen.getByLabelText("password");
            expect(input).toBeInTheDocument();
            expect(screen.getByText("Force user to reset password on next login")).toBeInTheDocument();
            const saveButton = screen.getByRole("button", { name: "Save" });
            expect(saveButton).toBeInTheDocument();
        });
    });

    describe("<UserPermissions />", () => {
        it("should render permissions correctly", () => {
            props.detail.permissions = {
                cancel_job: true,
                create_ref: true,
                create_sample: true,
                modify_hmm: true,
                modify_subtraction: true,
                remove_file: false,
                remove_job: false,
                upload_file: false
            };
            renderWithRouter(<UserDetail {...props} />, state, history);
            expect(screen.getByText("Permissions")).toBeInTheDocument();
            expect(screen.getByText("Change group membership to modify permissions")).toBeInTheDocument();
            expect(screen.getByLabelText("cancel_job:true")).toBeInTheDocument();
            expect(screen.getByLabelText("create_sample:true")).toBeInTheDocument();
            expect(screen.getByLabelText("remove_file:false")).toBeInTheDocument();
            expect(screen.getByLabelText("upload_file:false")).toBeInTheDocument();
        });
    });
    describe("<UserRole", () => {
        it("should render correctly when canModifyUser=true", () => {
            state.users.detail.id = "123456789";
            renderWithRouter(<UserDetail {...props} />, state, history);
            expect(screen.getByText("User Role")).toBeInTheDocument();
            expect(screen.getByRole("option", { name: "Administrator" })).toBeInTheDocument();
            expect(screen.getByRole("option", { name: "Limited" })).toBeInTheDocument();
        });
        it("should not render when canModifyUser=false", () => {
            renderWithRouter(<UserDetail {...props} />, state, history);
            expect(screen.queryByText("User Role")).not.toBeInTheDocument();
            expect(screen.queryByRole("option", { name: "Administrator" })).not.toBeInTheDocument();
            expect(screen.queryByRole("option", { name: "Limited" })).not.toBeInTheDocument();
        });
        it("should render correctly when administrator = false", () => {
            props.detail.id = "123456789";
            props.detail.administrator = false;
            renderWithRouter(<UserDetail {...props} />, state, history);
            const administratorOption = screen.getByRole("option", { name: "Administrator" });
            const limitedOption = screen.getByRole("option", { name: "Limited" });
            expect(administratorOption.selected).not.toBeTruthy();
            expect(limitedOption.selected).toBeTruthy();
        });
    });
});

describe("mapStateToProps", () => {
    const state = {
        users: {
            detail: { handle: "foo", last_password_change: 0 }
        },
        groups: {
            list: "foo",
            fetched: true
        }
    };

    it("should return correct props", () => {
        const props = mapStateToProps(state);

        expect(props).toEqual({
            detail: state.users.detail,
            error: ""
        });
    });
});

describe("mapDispatchToProps", () => {
    let dispatch;
    let result;

    beforeEach(() => {
        dispatch = vi.fn();
        result = mapDispatchToProps(dispatch);
    });

    it("should return onGetUser() in props", () => {
        const userId = "foo";
        result.onGetUser(userId);
        expect(dispatch).toHaveBeenCalledWith({
            type: "GET_USER_REQUESTED",
            payload: { userId }
        });
    });

    it("should return onListGroups() in props", () => {
        result.onListGroups();
        expect(dispatch).toHaveBeenCalledWith({
            type: "LIST_GROUPS_REQUESTED"
        });
    });
});
