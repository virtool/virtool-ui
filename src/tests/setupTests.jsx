import { fireEvent, render as rtlRender } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Enzyme, { mount, render, shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { theme } from "../js/app/theme";
import { createSerializer } from "enzyme-to-json";
import "@testing-library/jest-dom";
import { ConnectedRouter, routerMiddleware, connectRouter } from "connected-react-router";
import createSagaMiddleware from "redux-saga";
import { applyMiddleware, createStore, combineReducers } from "redux";
import { watchRouter } from "../js/app/sagas";

// React 16 Enzyme adapter

// Note that enzyme-to-json snapshot serializer is configured in
// jest configuration settings specified in package.json instead of here.
Enzyme.configure({ adapter: new Adapter() });
expect.addSnapshotSerializer(createSerializer({ mode: "deep" }));

const wrapWithProviders = (ui, createAppStore) => {
    let wrappedUi = <ThemeProvider theme={theme}>{ui}</ThemeProvider>;
    if (createAppStore) wrappedUi = <Provider store={createAppStore()}> {wrappedUi} </Provider>;
    return wrappedUi;
};

const renderWithProviders = (ui, createAppStore) => {
    return rtlRender(wrapWithProviders(ui, createAppStore));
};

const createGenericReducer = initState => state => state || initState;

const createAppStore = (state, history, createReducer) => {
    const reducer = createReducer
        ? createReducer(state, history)
        : combineReducers({
              router: connectRouter(history)
          });
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(reducer, applyMiddleware(sagaMiddleware, routerMiddleware(history)));

    sagaMiddleware.run(watchRouter);

    return store;
};

const renderWithRouter = (ui, state, history, createReducer) => {
    const wrappedUI = (
        <Provider store={createAppStore(state, history, createReducer)}>
            <ConnectedRouter history={history}> {ui} </ConnectedRouter>
        </Provider>
    );
    renderWithProviders(wrappedUI);
};

// Globals are defined here to limit import redundancies.
global.fireEvent = fireEvent;
global.userEvent = userEvent;
global.mount = mount;
global.React = React;
global.render = render;
global.renderWithProviders = renderWithProviders;
global.wrapWithProviders = wrapWithProviders;
global.shallow = shallow;
global.renderWithRouter = renderWithRouter;
global.createGenericReducer = createGenericReducer;
