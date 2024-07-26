import { theme } from "@app/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import { fireEvent, render as rtlRender } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { noop } from "lodash-es";
import React from "react";
import { MemoryRouter, Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { vi } from "vitest";

process.env.TZ = "UTC";

export function wrapWithProviders(ui) {
    const queryClient = new QueryClient({
        logger: {
            log: console.log,
            warn: console.warn,
            error: noop,
        },
    });

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

export function renderWithRouter(ui, history) {
    const wrappedUI = <Router history={history}>{ui}</Router>;
    renderWithProviders(wrappedUI);
}

export function renderWithMemoryRouter(ui, initialEntries) {
    renderWithProviders(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);
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
