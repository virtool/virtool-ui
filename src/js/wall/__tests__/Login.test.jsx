import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createStore } from "redux";
import { LOGIN } from "../../app/actionTypes";
import { Login, mapDispatchToProps, mapStateToProps } from "../Login";
import { vi } from "vitest";
import { attachResizeObserver } from "../../../tests/setupTests";

const createAppStore = state => {
    return () => createStore(state => state, state);
};

describe("<Login />", () => {
    attachResizeObserver();
    let props;

    beforeEach(() => {
        props = {
            onLogin: vi.fn()
        };
        window.b2c = {
            use: false
        };
    });

    it.each(["Username", "Password"], "should render filled %p field", async name => {
        renderWithProviders(<Login {...props} />, createAppStore(null));
        await userEvent.type(screen.getByLabelText(name), `test_${name}`);
        expect(screen.getByLabelText(name)).toHaveValue(`test_${name}`);
    });

    it("should render checked remember checkbox", async () => {
        renderWithProviders(<Login {...props} />, createAppStore(null));
        expect(screen.getByLabelText("Remember Me")).toHaveAttribute("data-state", "unchecked");

        await userEvent.click(screen.getByLabelText("Remember Me"));
        expect(screen.getByLabelText("Remember Me")).toHaveAttribute("data-state", "checked");
    });

    it("should call onLogin() with correct values when submitted", async () => {
        renderWithProviders(<Login {...props} />, createAppStore(null));

        const usernameField = screen.getByLabelText("Username");
        await userEvent.type(usernameField, `test_Username`);
        expect(usernameField).toHaveValue(`test_Username`);

        const passwordField = screen.getByLabelText("Password");
        await userEvent.type(passwordField, "Password");
        expect(passwordField).toHaveValue("Password");

        await userEvent.click(screen.getByRole("button", { name: "Login" }));
        expect(props.onLogin).toHaveBeenCalledWith("test_Username", "Password", false);
    });
});

describe("mapStateToProps()", () => {
    it("should return props given state", () => {
        const state = {
            app: {}
        };
        const result = mapStateToProps(state);
        expect(result).toEqual({});
    });
});

describe("mapDispatchToProps()", () => {
    it("should return props with valid onLogin()", () => {
        const dispatch = vi.fn();
        const props = mapDispatchToProps(dispatch);

        props.onLogin("bob", "foobar", false, "baz");

        expect(dispatch).toHaveBeenCalledWith({
            type: LOGIN.REQUESTED,
            payload: { username: "bob", password: "foobar", remember: false }
        });
    });
});
