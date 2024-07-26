import { fn } from "@storybook/test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "../src/js/app/GlobalStyles";
import { theme } from "../src/js/app/theme";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

export const decorators = [
    Story => (
        <MemoryRouter>
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <GlobalStyles />
                    <Story />
                </QueryClientProvider>
            </ThemeProvider>
        </MemoryRouter>
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
