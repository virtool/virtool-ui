import { waitFor } from "@testing-library/react";
import { connectRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import nock from "nock";
import { combineReducers } from "redux";
import { createFakeAccount } from "../../../../tests/fake/account";
import { AdministratorRoles } from "../../types";
import { Settings } from "../Settings";

const createReducer = (state, history) =>
    combineReducers({
        instanceMessage: createGenericReducer(state.instanceMessage),
        settings: createGenericReducer(state.settings),
        router: connectRouter(history),
    });

describe("<Settings />", () => {
    let account;
    let history;
    let scope;
    let state;

    beforeEach(() => {
        account = createFakeAccount();
        history = createBrowserHistory();
        history.push("/administration/settings");
        state = {
            instanceMessage: { color: "red", loaded: true, message: "" },
            settings: { data: { enable_api: false } },
        };
    });

    it("should render", async () => {
        account.administrator_role = AdministratorRoles.FULL;
        scope = nock("http://localhost").get("/api/account").reply(200, account);
        renderWithRouter(<Settings loading={false} />, state, history, createReducer);

        await waitFor(() => expect(screen.getByText("Settings")).toBeInTheDocument());
        expect(screen.getByText("Instance Message")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Message" })).toBeInTheDocument();

        expect(screen.getByText("JSON API")).toBeInTheDocument();

        scope.isDone();
    });

    it("should render all options for full administrators", async () => {
        account.administrator_role = AdministratorRoles.FULL;
        scope = nock("http://localhost").get("/api/account").reply(200, account);

        renderWithRouter(<Settings loading={false} />, state, history, createReducer);

        await waitFor(() => expect(screen.getByText("Users")).toBeInTheDocument());
        expect(screen.getByText("Settings")).toBeInTheDocument();
        expect(screen.getByText("Administrators")).toBeInTheDocument();
        expect(screen.getByText("Groups")).toBeInTheDocument();

        scope.isDone();
    });

    it("should render only groups and users for users administrators", async () => {
        account.administrator_role = AdministratorRoles.USERS;
        scope = nock("http://localhost").get("/api/account").reply(200, account);

        renderWithRouter(<Settings loading={false} />, state, history, createReducer);

        await waitFor(() => expect(screen.getByText("Users")).toBeInTheDocument());
        expect(screen.queryByText("Settings")).not.toBeInTheDocument();
        expect(screen.queryByText("Administrators")).not.toBeInTheDocument();
        expect(screen.getByText("Groups")).toBeInTheDocument();

        scope.isDone();
    });
});
