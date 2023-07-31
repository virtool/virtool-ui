import { screen } from "@testing-library/react";
import { connectRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import { forEach } from "lodash-es";
import { combineReducers } from "redux";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeAccount, mockGetAccountAPI } from "../../../../tests/fake/account";
import { createFakeUsers, mockApiFindUsers } from "../../../../tests/fake/user";
import { createGenericReducer, renderWithRouter } from "../../../../tests/setupTests";
import { AdministratorRoles } from "../../../administration/types";
import { ManageUsers } from "../ManageUsers";

const createReducer = (state, history) =>
    combineReducers({
        router: connectRouter(history),
        users: createGenericReducer(state.users),
        settings: createGenericReducer(state.settings),
    });

describe("<ManageUsers />", () => {
    let history;
    let state;

    beforeEach(() => {
        state = {
            users: {},
            settings: {
                data: {
                    minimimum_password_length: 8,
                },
            },
        };
        history = createBrowserHistory();
    });

    it("should render correctly with 3 users", async () => {
        const users = createFakeUsers(3);
        users[0].administrator_role = AdministratorRoles.FULL;
        await mockApiFindUsers(users);
        const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
        mockGetAccountAPI(account);

        renderWithRouter(<ManageUsers />, state, history, createReducer);

        expect(await screen.findByLabelText("user-plus")).toBeInTheDocument();
        expect(await screen.findByLabelText("search")).toBeInTheDocument();
        expect(await screen.findByText(/Administrator/)).toBeInTheDocument();
        forEach(users, user => {
            expect(screen.getByText(user.handle)).toBeInTheDocument();
        });
    });

    it("should render correctly when documents = null", async () => {
        const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
        mockGetAccountAPI(account);

        renderWithRouter(<ManageUsers />, state, history, createReducer);

        expect(await screen.findByLabelText("user-plus")).toBeInTheDocument();
        expect(screen.getByLabelText("search")).toBeInTheDocument();
        expect(screen.getByLabelText("loading")).toBeInTheDocument();
        expect(screen.queryByText("Administrator")).not.toBeInTheDocument();
    });

    it("should render correctly if account has insufficent permissions", async () => {
        const users = createFakeUsers(3);
        mockApiFindUsers(users);
        const account = createFakeAccount({ administrator_role: null });
        mockGetAccountAPI(account);

        renderWithRouter(<ManageUsers />, state, history, createReducer);

        expect(await screen.findByText("You do not have permission to manage users.")).toBeInTheDocument();
        expect(screen.getByText("Contact an administrator.")).toBeInTheDocument();
        expect(screen.queryByText(users[0].handle)).not.toBeInTheDocument();
        expect(screen.queryByLabelText("user-plus")).not.toBeInTheDocument();
        expect(screen.queryByLabelText("search")).not.toBeInTheDocument();
        expect(screen.queryByText("Administrator")).not.toBeInTheDocument();
    });
});
