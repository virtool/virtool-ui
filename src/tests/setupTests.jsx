import "@testing-library/jest-dom";
import { fireEvent, render as rtlRender, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { ConnectedRouter, connectRouter, routerMiddleware } from "connected-react-router";
import Enzyme, { mount, render, shallow } from "enzyme";
import { createSerializer } from "enzyme-to-json";
import { noop } from "lodash-es";
import React from "react";
import { QueryClient, QueryClientProvider, setLogger } from "react-query";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { ThemeProvider } from "styled-components";
import { vi } from "vitest";
import { watchRouter } from "../js/app/sagas";
import { theme } from "../js/app/theme";

process.env.TZ = "UTC";

// Note that enzyme-to-json snapshot serializer is configured in
// jest configuration settings specified in package.json instead of here.
Enzyme.configure({ adapter: new Adapter() });
expect.addSnapshotSerializer(createSerializer({ mode: "deep" }));

setLogger({
    log: console.log,
    warn: console.warn,
    error: noop,
});

const wrapWithProviders = (ui, createAppStore) => {
    const queryClient = new QueryClient();

    if (createAppStore) {
        return (
            <Provider store={createAppStore()}>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider theme={theme}>{ui}</ThemeProvider>
                </QueryClientProvider>
            </Provider>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>{ui}</ThemeProvider>
        </QueryClientProvider>
    );
};

export function renderWithProviders(ui, createAppStore) {
    const { rerender, ...rest } = rtlRender(wrapWithProviders(ui, createAppStore));

    function rerenderWithProviders(ui) {
        return rerender(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
    }

    return { ...rest, rerender: rerenderWithProviders };
}

const createGenericReducer = initState => state => state || initState;

const createAppStore = (state, history, createReducer) => {
    const reducer = createReducer
        ? createReducer(state, history)
        : combineReducers({
              router: connectRouter(history),
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

//mocks HTML element prototypes that are not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
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
