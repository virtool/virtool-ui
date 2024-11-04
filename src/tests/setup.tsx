import { theme } from "@app/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import { fireEvent, render as rtlRender } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { ReactNode } from "react";
import { ThemeProvider } from "styled-components";
import { vi } from "vitest";
import { BaseLocationHook, Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { Path } from "wouter/types/location-hook";
import { faker } from "@faker-js/faker";

process.env.TZ = "UTC";

faker.seed(1);

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

export function renderWithRouter(ui: ReactNode, path?: string) {
    const { hook, history } = memoryLocation({ path, record: true });

    const result = renderWithProviders(<MemoryRouter hook={hook}>{ui}</MemoryRouter>);

    return { ...result, history };
}

export function MemoryRouter({
    children,
    path,
    hook,
}: {
    children: React.ReactNode;
    path?: string;
    hook?: BaseLocationHook;
}) {
    if (!hook) {
        hook = memoryLocation({ path }).hook;
    }

    return (
        <Router hook={() => useMemoryLocation(hook)} searchHook={() => useMemorySearch(hook)}>
            {children}
        </Router>
    );
}

export function useMemoryLocation(baseHook: BaseLocationHook): [string, (path: Path, ...args: any[]) => any] {
    let [location, rest] = baseHook();
    location = location.split("?")[0] || "";
    return [location, rest];
}

export function useMemorySearch(baseHook) {
    const [location] = baseHook();
    return location.split("?")[1] || "";
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
