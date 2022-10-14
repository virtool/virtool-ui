import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "../src/js/app/theme";
import { MemoryRouter } from "react-router";

export const decorators = [
  (Story) => (
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    </MemoryRouter>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
