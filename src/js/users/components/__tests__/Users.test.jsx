import { screen } from "@testing-library/react";
import { connectRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import React from "react";
import { combineReducers } from "redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeUsers } from "../../../../tests/fake/user";
import { createGenericReducer, renderWithRouter } from "../../../../tests/setupTests";
import { AdministratorRoles } from "../../../administration/types";
import { ManageUsers, mapDispatchToProps, mapStateToProps } from "../Users";

const createReducer = (state, history) =>
    combineReducers({
        router: connectRouter(history),
        users: createGenericReducer(state.users),
        settings: createGenericReducer(state.settings),
    });

describe("<ManageUsers />", () => {
    let history;
    let props;
    let state;

    beforeEach(() => {
        const documents = createFakeUsers(3);
        props = {
            canEditUsers: true,
            filter: "test",
            groups: [],
            error: "",
            groupsFetched: true,
            onFilter: vi.fn(),
            onClearError: vi.fn(),
            onListGroups: vi.fn(),
        };
        state = {
            users: {
                documents,
                term: "",
                page: "",
                page_count: 0,
            },
            settings: {
                data: {
                    minimimum_password_length: 8,
                },
            },
            createUser: false,
            isAdmin: true,
            term: "",
            groups: [],
            groupsFetched: "",
        };
        history = createBrowserHistory();
    });

    it("should render correctly with 3 users", () => {
        state.users.documents[0].handle = "Bob";
        state.users.documents[0].administrator_role = AdministratorRoles.FULL;
        state.users.documents[1].handle = "Peter";
        state.users.documents[2].handle = "Sam";

        renderWithRouter(<ManageUsers {...props} />, state, history, createReducer);

        expect(screen.getByLabelText("user-plus")).toBeInTheDocument();
        expect(screen.getByLabelText("search")).toBeInTheDocument();
        expect(screen.getByText(/Administrator/)).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
        expect(screen.getByText("Peter")).toBeInTheDocument();
        expect(screen.getByText("Sam")).toBeInTheDocument();
    });

    it("should render correctly when documents = null", () => {
        state.users.documents = null;

        renderWithRouter(<ManageUsers {...props} />, state, history, createReducer);

        expect(screen.getByLabelText("user-plus")).toBeInTheDocument();
        expect(screen.getByLabelText("search")).toBeInTheDocument();
        expect(screen.getByLabelText("loading")).toBeInTheDocument();
        expect(screen.queryByText("Administrator")).not.toBeInTheDocument();
    });

    it("should render correctly with error", () => {
        state.users.documents[0].handle = "Bob";
        state.users.documents[0].administrator = true;
        props.error = {
            LIST_USERS_ERROR: {
                message: "Requires administrative privilege",
                status: 403,
            },
        };

        renderWithRouter(<ManageUsers {...props} />, state, history, createReducer);

        expect(screen.getByText("You do not have permission to manage users.")).toBeInTheDocument();
        expect(screen.getByText("Contact an administrator.")).toBeInTheDocument();
        expect(screen.queryByText("Bob")).not.toBeInTheDocument();
        expect(screen.queryByLabelText("user-plus")).not.toBeInTheDocument();
        expect(screen.queryByLabelText("search")).not.toBeInTheDocument();
        expect(screen.queryByText("Administrator")).not.toBeInTheDocument();
    });
});

describe("mapStateToProps()", () => {
    it("should return props", () => {
        const state = {
            account: {
                administrator_role: AdministratorRoles.USERS,
            },
            users: {
                filter: "foo",
            },
            groups: {
                list: "bar",
                fetched: true,
            },
        };
        const result = mapStateToProps(state);
        expect(result).toEqual({
            canEditUsers: true,
            term: "foo",
            groups: "bar",
            groupsFetched: true,
            error: "",
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

    it("should return onFind in props", () => {
        const e = {
            target: {
                value: "foo",
            },
        };
        result.onFind(e);
        expect(dispatch).toHaveBeenCalledWith({
            payload: { page: 1, term: "foo" },
            type: "FIND_USERS_REQUESTED",
        });
    });

    it("should return onClearError in props", () => {
        const error = "foo";
        result.onClearError(error);
        expect(dispatch).toHaveBeenCalledWith({
            payload: { error: "foo" },
            type: "CLEAR_ERROR",
        });
    });

    it("should return onListGroups in props", () => {
        result.onListGroups();
        expect(dispatch).toHaveBeenCalled();
    });
});
