import { configureStore, createReducer } from "@reduxjs/toolkit";
import { createReduxEnhancer } from "@sentry/react";
import { connectRouter, routerMiddleware } from "connected-react-router";
import createSagaMiddleware from "redux-saga";
import accountReducer from "../account/reducer";
import settingsReducer from "../administration/reducer";
import analysesReducer from "../analyses/reducer";
import errorsReducer from "../errors/reducer";
import filesReducer from "../files/reducer";
import { formsReducer } from "../forms/reducer";
import groupsReducer from "../groups/reducer";
import hmmsReducer from "../hmm/reducer";
import indexesReducer from "../indexes/reducer";
import jobsReducer from "../jobs/reducer";
import labelsReducer from "../labels/reducer";
import OTUsReducer from "../otus/reducer";
import referenceReducer from "../references/reducer";
import samplesReducer from "../samples/reducer";
import subtractionsReducer from "../subtraction/reducer";
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
            state.resetCode = action.payload.reset_code;
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

export function createAppStore(history) {
    const sagaMiddleware = createSagaMiddleware();

    const store = configureStore({
        reducer: {
            account: accountReducer,
            analyses: analysesReducer,
            app: appReducer,
            errors: errorsReducer,
            files: filesReducer,
            forms: formsReducer,
            groups: groupsReducer,
            hmms: hmmsReducer,
            indexes: indexesReducer,
            jobs: jobsReducer,
            labels: labelsReducer,
            otus: OTUsReducer,
            references: referenceReducer,
            router: connectRouter(history),
            samples: samplesReducer,
            settings: settingsReducer,
            subtraction: subtractionsReducer,
        },
        middleware: [sagaMiddleware, routerMiddleware(history)],
        enhancers: [sentryReduxEnhancer],
    });

    sagaMiddleware.run(rootSaga);

    return store;
}
