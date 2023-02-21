import "@testing-library/jest-dom";
import { fireEvent, render as rtlRender, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { ConnectedRouter, connectRouter, routerMiddleware } from "connected-react-router";
import Enzyme, { mount, render, shallow } from "enzyme";
import { createSerializer } from "enzyme-to-json";
import React from "react";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { ThemeProvider } from "styled-components";
import { watchRouter } from "../js/app/sagas";
import { theme } from "../js/app/theme";

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

class ResizeObserver {
    observe() {}
    unobserve() {}
}

export const attachResizeObserver = () => {
    window.ResizeObserver = ResizeObserver;
};

attachResizeObserver();

// Globals are defined here to limit import redundancies.
global.fireEvent = fireEvent;
global.userEvent = userEvent;
global.mount = mount;
global.React = React;
global.screen = screen;
global.render = render;
global.renderWithProviders = renderWithProviders;
global.wrapWithProviders = wrapWithProviders;
global.shallow = shallow;
global.renderWithRouter = renderWithRouter;
global.createGenericReducer = createGenericReducer;
