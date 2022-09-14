import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createStore } from "redux";
import { LOGIN } from "../../app/actionTypes";
import { Login, mapDispatchToProps, mapStateToProps } from "../Login";
import { vi } from "vitest";

const createAppStore = state => {
    return () => createStore(state => state, state);
};

describe("<Login />", () => {
    let props;

    beforeEach(() => {
        props = {
            onLogin: vi.fn()
        };
        window.b2c = {
            use: false
        };
    });

    it("should render", () => {
        renderWithProviders(<Login {...props} />, createAppStore(null));
        expect(screen.getByText("Virtool")).toBeInTheDocument();
        expect(screen.getByText("Sign in with your Virtool account")).toBeInTheDocument();
        expect(screen.getByText("Username")).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Username" })).toBeInTheDocument();
        expect(screen.getByText("Password")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toHaveValue("");
    });

    it.each(["Username", "Password"], "should render filled %p field", name => {
        renderWithProviders(<Login {...props} />, createAppStore(null));
        userEvent.type(screen.getByLabelText(name), `test_${name}`);
        expect(screen.getByLabelText(name)).toHaveValue(`test_${name}`);
    });

    it("should render checked remember checkbox", () => {
        renderWithProviders(<Login {...props} />, createAppStore(null));
        expect(screen.getByLabelText("Remember Me")).toHaveAttribute("data-state", "unchecked");
        userEvent.click(screen.getByLabelText("Remember Me"));
        expect(screen.getByLabelText("Remember Me")).toHaveAttribute("data-state", "checked");
    });

    it("should call onLogin() with correct values when submitted", async () => {
        renderWithProviders(<Login {...props} />, createAppStore(null));
        userEvent.type(screen.getByLabelText("Username"), `test_Username`);
        expect(screen.getByLabelText("Username")).toHaveValue(`test_Username`);
        userEvent.type(screen.getByLabelText("Password"), `Password`);
        expect(screen.getByLabelText("Password")).toHaveValue(`Password`);
        userEvent.click(screen.getByRole("button", { name: "Login" }));
        await waitFor(() => expect(props.onLogin).toHaveBeenCalledWith("test_Username", "Password", false));
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
