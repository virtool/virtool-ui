import { theme } from "@app/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import { fireEvent, render as rtlRender } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocationDescriptor } from "history";
import React, { ReactNode } from "react";
import { MemoryRouter, Router } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import { ThemeProvider } from "styled-components";
import { vi } from "vitest";

process.env.TZ = "UTC";

export function wrapWithProviders(ui: ReactNode) {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>{ui}</ThemeProvider>
        </QueryClientProvider>
    );
}

export function renderWithProviders(ui: ReactNode) {
    const { rerender, ...rest } = rtlRender(wrapWithProviders(ui));

    function rerenderWithProviders(updatedUi: ReactNode) {
        return rerender(<ThemeProvider theme={theme}>{updatedUi}</ThemeProvider>);
    }

    return { ...rest, rerender: rerenderWithProviders };
}

export function renderWithRouter(ui, history) {
    renderWithProviders(
        <Router history={history}>
            <CompatRouter>{ui}</CompatRouter>
        </Router>
    );
}

export function renderWithMemoryRouter(ui: ReactNode, initialEntries: LocationDescriptor[] = ["/"]) {
    renderWithProviders(
        <MemoryRouter initialEntries={initialEntries}>
            <CompatRouter>{ui}</CompatRouter>
        </MemoryRouter>
    );
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

function attachResizeObserver() {
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
