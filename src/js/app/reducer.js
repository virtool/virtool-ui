import { connectRouter, routerMiddleware } from "connected-react-router";
import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import accountReducer from "../account/reducer";
import cacheReducer from "../caches/reducer";
import settingsReducer from "../administration/reducer";
import analysesReducer from "../analyses/reducer";
import errorsReducer from "../errors/reducer";
import filesReducer from "../files/reducer";
import groupsReducer from "../groups/reducer";
import hmmsReducer from "../hmm/reducer";
import indexesReducer from "../indexes/reducer";
import jobsReducer from "../jobs/reducer";
import OTUsReducer from "../otus/reducer";
import referenceReducer from "../references/reducer";
import samplesReducer from "../samples/reducer";
import labelsReducer from "../labels/reducer";
import subtractionsReducer from "../subtraction/reducer";
import tasksReducer from "../tasks/reducer";
import usersReducer from "../users/reducer";
import { formsReducer } from "../forms/reducer";
import { CREATE_FIRST_USER, LOGIN, LOGOUT, RESET_PASSWORD, SET_INITIAL_STATE } from "./actionTypes";
import rootSaga from "./sagas";
import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    login: false,
    reset: false
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
        .addCase(LOGOUT.SUCCEEDED, state => {
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
        .addCase(SET_INITIAL_STATE, (state, action) => {
            state.dev = action.payload.dev;
            state.first = action.payload.first;
        });
});

export const createAppStore = history => {
    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(
        combineReducers({
            account: accountReducer,
            analyses: analysesReducer,
            app: appReducer,
            caches: cacheReducer,
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
            tasks: tasksReducer,
            users: usersReducer
        }),
        applyMiddleware(sagaMiddleware, routerMiddleware(history))
    );

    sagaMiddleware.run(rootSaga);

    return store;
};
