import { fn } from "@storybook/test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ThemeProvider } from "styled-components";
import { Router } from "wouter";
import "../src/app/style.css";
import { theme } from "../src/app/theme";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

export const decorators = [
    (Story) => (
        <Router>
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <Story />
                </QueryClientProvider>
            </ThemeProvider>
        </Router>
    ),
];

export const parameters = {
    actions: {
        args: { onClick: fn() },
    },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};
export const tags = ["autodocs"];
