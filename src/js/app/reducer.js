import accountReducer from "@account/reducer";
import filesReducer from "@files/reducer";
import { configureStore, createReducer } from "@reduxjs/toolkit";
import { createReduxEnhancer } from "@sentry/react";
import createSagaMiddleware from "redux-saga";
import analysesReducer from "../analyses/reducer";
import { CREATE_FIRST_USER, GET_INITIAL_STATE, LOGIN, RESET_PASSWORD } from "./actionTypes";
import rootSaga from "./sagas";

const initialState = {
    login: true,
    reset: false,
    ready: false,
    first: false,
};

export const appReducer = createReducer(initialState, builder => {
    builder
        .addCase(LOGIN.SUCCEEDED, (state, action) => {
            state.login = false;
            if (action.payload.reset) {
                state.reset = true;
                state.resetCode = action.payload.reset_code;
            } else {
                state.reset = false;
            }
        })
        .addCase(LOGIN.FAILED, state => {
            state.login = true;
        })
        .addCase(RESET_PASSWORD.SUCCEEDED, state => {
            state.login = false;
            state.reset = false;
            state.resetCode = null;
            state.resetError = null;
        })
        .addCase(RESET_PASSWORD.FAILED, (state, action) => {
            state.login = false;
            state.reset = true;
            state.resetError = action.payload.error;
        })
        .addCase(CREATE_FIRST_USER.SUCCEEDED, state => {
            state.login = false;
            state.first = false;
        })
        .addCase(GET_INITIAL_STATE.SUCCEEDED, (state, action) => {
            state.dev = action.payload.dev;
            state.first = action.payload.first_user;
            state.login = action.payload.login;
            state.ready = true;
        });
});

const sentryReduxEnhancer = createReduxEnhancer();

export function createAppStore() {
    const sagaMiddleware = createSagaMiddleware();

    const store = configureStore({
        reducer: {
            account: accountReducer,
            analyses: analysesReducer,
            app: appReducer,
            files: filesReducer,
        },
        middleware: [sagaMiddleware],
        enhancers: [sentryReduxEnhancer],
    });

    sagaMiddleware.run(rootSaga);

    return store;
}
