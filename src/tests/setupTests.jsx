import { theme } from "@app/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import { fireEvent, render as rtlRender } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { noop } from "lodash-es";
import React from "react";
import { Router } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import { ThemeProvider } from "styled-components";
import { vi } from "vitest";
import { Router as Wouter } from "wouter";
import { memoryLocation } from "wouter/memory-location";

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

export function renderWithProviders(ui) {
    const { rerender, ...rest } = rtlRender(wrapWithProviders(ui));

    function rerenderWithProviders(updatedUI) {
        return rerender(<ThemeProvider theme={theme}>{updatedUI}</ThemeProvider>);
    }

    return { ...rest, rerender: rerenderWithProviders };
}

export function renderWithRouter(ui, history) {
    const wrappedUI = (
        <Router history={history}>
            <CompatRouter>{ui}</CompatRouter>
        </Router>
    );
    renderWithProviders(wrappedUI);
}

export function renderWithMemoryRouter(ui, path) {
    console.log(path);
    const { hook, navigate } = memoryLocation({ path });

    renderWithProviders(
        <Wouter hook={() => useMemoryLocation(hook)} searchHook={() => useMemorySearch(hook)}>
            {ui}
        </Wouter>
    );
}

export function useMemoryLocation(baseHook) {
    let [location, navigate] = baseHook();
    console.log("base location", location);

    try {
        location = location.split("?")[0] || "";
    } catch (error) {}

    return [location, navigate];
}

export function useMemorySearch(baseHook) {
    const [location] = baseHook();

    try {
        return location.split("?")[1] || "";
    } catch (error) {
        return null;
    }
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
