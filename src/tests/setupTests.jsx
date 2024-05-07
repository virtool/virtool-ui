import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import { fireEvent, render as rtlRender } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConnectedRouter, connectRouter, routerMiddleware } from "connected-react-router";
import { noop } from "lodash-es";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { ThemeProvider } from "styled-components";
import { vi } from "vitest";
import { watchRouter } from "../js/app/sagas";
import { theme } from "../js/app/theme";

process.env.TZ = "UTC";

export function wrapWithProviders(ui, createAppStore) {
    const queryClient = new QueryClient({
        logger: {
            log: console.log,
            warn: console.warn,
            error: noop,
        },
    });

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
}

export function renderWithProviders(ui, createAppStore) {
    const { rerender, ...rest } = rtlRender(wrapWithProviders(ui, createAppStore));

    function rerenderWithProviders(ui) {
        return rerender(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
    }

    return { ...rest, rerender: rerenderWithProviders };
}

export function createGenericReducer(initState) {
    return state => state || initState;
}

export function createAppStore(state, history, createReducer) {
    const reducer = createReducer
        ? createReducer(state, history)
        : combineReducers({
              router: connectRouter(history),
          });
    const sagaMiddleware = createSagaMiddleware();
    const store = configureStore({
        reducer: reducer,
        middleware: [sagaMiddleware, routerMiddleware(history)],
    });

    sagaMiddleware.run(watchRouter);

    return store;
}

export function renderWithRouter(ui, state, history, createReducer) {
    const wrappedUI = (
        <Provider store={createAppStore(state, history, createReducer)}>
            <ConnectedRouter history={history}> {ui} </ConnectedRouter>
        </Provider>
    );
    renderWithProviders(wrappedUI);
}

export function renderWithMemoryRouter(ui, initialEntries, createAppStore) {
    renderWithProviders(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>, createAppStore);
}

//mocks HTML element prototypes that are not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

export function attachResizeObserver() {
    window.ResizeObserver = ResizeObserver;
}

attachResizeObserver();

// Globals are defined here to limit import redundancies.
global.fireEvent = fireEvent;
global.userEvent = userEvent;
global.React = React;
global.renderWithProviders = renderWithProviders;
global.wrapWithProviders = wrapWithProviders;
global.renderWithRouter = renderWithRouter;
global.createGenericReducer = createGenericReducer;
