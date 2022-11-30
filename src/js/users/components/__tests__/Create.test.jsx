import { PUSH_STATE } from "../../../app/actionTypes";
import { CreateUser, mapDispatchToProps, mapStateToProps } from "../Create";
import { fireEvent, screen } from "@testing-library/react";
import { ConnectedRouter, connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import React from "react";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { watchRouter } from "../../../app/sagas";

const createAppStore = (state, history) => {
    const reducer = combineReducers({
        router: connectRouter(history)
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

describe("<CreateUser />", () => {
    let props;
    let state;

    beforeEach(() => {
        props = {
            error: "",
            show: true,
            minimumPasswordLength: 8,
            onClearError: vi.fn(),
            onCreate: vi.fn(),
            onHide: vi.fn()
        };

        state = {
            errorPassword: "",
            errorHandle: "",
            forceReset: false,
            password: "",
            handle: ""
        };
        history = createBrowserHistory();
    });

    it("should render correctly when show=true", () => {
        renderWithRouter(<CreateUser {...props} />, state, history);
        expect(screen.getByText("Create User")).toBeInTheDocument();
        expect(screen.getByText("Username")).toBeInTheDocument();
        expect(screen.getByText("Password")).toBeInTheDocument();
        expect(screen.getByText("Force user to reset password on login"));
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("should render correct error messages", () => {
        renderWithRouter(<CreateUser {...props} />, state, history);
        const saveButton = screen.getByRole("button", { name: "Save" });
        saveButton.click();
        expect(screen.getByText("Please specify a username")).toBeInTheDocument();
        expect(screen.getByText("Passwords must contain at least 8 characters")).toBeInTheDocument();
        expect(props.onCreate).not.toHaveBeenCalled();
    });

    it("should not display error messages and should call onCreate when valid info entered", () => {
        renderWithRouter(<CreateUser {...props} />, state, history);
        const userNameInput = screen.getByLabelText("username");
        const passwordInput = screen.getByLabelText("password");
        const saveButton = screen.getByRole("button", { name: "Save" });
        fireEvent.change(userNameInput, { target: { value: "newUsername" } });
        fireEvent.change(passwordInput, { target: { value: "newPassword" } });
        expect(props.onCreate).not.toHaveBeenCalled();
        saveButton.click();
        expect(props.onCreate).toHaveBeenCalled();
    });

    it("should call onHide when model exited", () => {
        props.error = "Error";
        renderWithRouter(<CreateUser {...props} />, state, history);
        const closeButton = screen.getByLabelText("close");
        expect(props.onHide).toHaveBeenCalledTimes(0);
        fireEvent.click(closeButton);
        expect(props.onHide).toHaveBeenCalledTimes(1);
    });
});

describe("mapStateToProps", () => {
    it("should call mapStateToProps", () => {
        const state = {
            errors: {
                CREATE_USER_ERROR: {
                    message: "foo"
                }
            },
            router: { location: "foo" },
            users: {
                createPending: true
            },
            settings: {
                data: {
                    minimum_password_length: 1
                }
            }
        };

        const result = mapStateToProps(state);
        expect(result).toEqual({
            show: false,
            pending: true,
            minimumPasswordLength: 1,
            error: "foo"
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

    it("should return onCreate() in props", () => {
        const data = "foo";

        result.onCreate(data);
        expect(dispatch).toHaveBeenCalledWith({
            payload: "foo",
            type: "CREATE_USER_REQUESTED"
        });
    });
    it("should return onHide() in props", () => {
        result.onHide();
        expect(dispatch).toHaveBeenCalledWith({ type: PUSH_STATE, payload: { state: { createUser: false } } });
    });

    it("should return onClearError() in props", () => {
        result.onClearError();
        expect(dispatch).toHaveBeenCalledWith({
            payload: { error: "CREATE_USER_ERROR" },
            type: "CLEAR_ERROR"
        });
    });
});
