import AccountProfile from "../Profile";

import userEvent from "@testing-library/user-event";
import { connectRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import { combineReducers } from "redux";
import { createFakeAccount } from "../../../../tests/fake/account";
import { AdministratorRoles } from "../../../administration/types";

function createReducer(state, history) {
    return combineReducers({
        account: createGenericReducer(state.account),
        settings: createGenericReducer(state.settings),
        router: connectRouter(history),
    });
}

describe("<AccountProfile />", () => {
    let history;
    let state;

    beforeEach(() => {
        history = createBrowserHistory();

        state = {
            account: { ...createFakeAccount({}), administrator_role: AdministratorRoles.FULL, handle: "amanda36" },
            settings: { data: { minimum_password_length: 8 } },
        };
    });

    it("should render when administrator", () => {
        renderWithRouter(<AccountProfile />, state, history, createReducer);

        expect(screen.getByText("amanda36")).toBeInTheDocument();
        expect(screen.getByText("full Administrator")).toBeInTheDocument();
        expect(screen.queryAllByText("AM")).toHaveLength(2);
    });

    it("should render when not administrator", () => {
        state.account.administrator_role = null;
        renderWithRouter(<AccountProfile />, state, history, createReducer);

        expect(screen.getByText("amanda36")).toBeInTheDocument();
    });

    it("should render with initial email", () => {
        state.account.email = "virtool.devs@gmail.com";
        renderWithRouter(<AccountProfile />, state, history, createReducer);
        const emailInput = screen.getByLabelText("Email Address");
        expect(emailInput.value).toBe("virtool.devs@gmail.com");
    });

    it("should handle email changes", async () => {
        state.account.email = "";
        renderWithRouter(<AccountProfile />, state, history, createReducer);

        const emailInput = screen.getByLabelText("Email Address");
        expect(emailInput.value).toBe("");

        await userEvent.type(emailInput, "invalid");
        await userEvent.click(screen.getByText("Save"), { role: "button" });

        expect(emailInput).toHaveValue("invalid");
        expect(screen.getByText("Please provide a valid email address")).toBeInTheDocument();

        await userEvent.clear(emailInput);
        await userEvent.type(emailInput, "virtool.devs@gmail.com");
        await userEvent.click(screen.getByText("Save"), { role: "button" });
    });

    it("should handle password changes", async () => {
        renderWithRouter(<AccountProfile />, state, history, createReducer);

        const oldPasswordInput = screen.getByLabelText("Old Password");
        const newPasswordInput = screen.getByLabelText("New Password");

        // Try without providing old password.
        await userEvent.type(newPasswordInput, "long_enough_password");
        await userEvent.click(screen.getByText("Change"), { role: "button" });

        expect(screen.getByText("Please provide your old password")).toBeInTheDocument();

        await userEvent.clear(newPasswordInput);
        await userEvent.type(oldPasswordInput, "expected_password");
        await userEvent.type(newPasswordInput, "short");

        expect(screen.getByLabelText("New Password")).toHaveValue("short");

        await userEvent.click(screen.getByText("Change"), { role: "button" });

        expect(screen.getByText("Passwords must contain at least 8 characters")).toBeInTheDocument();
    });
});
