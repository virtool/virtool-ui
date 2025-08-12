import { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],

    addons: ["@storybook/addon-links", "@storybook/addon-docs"],

    framework: {
        name: "@storybook/react-vite",
        options: {},
    },

    docs: {},

    typescript: {
        reactDocgen: "react-docgen-typescript",
    },
};

export async function viteFinal(config) {
    return mergeConfig(config, { process: { env: {} } });
}

export default config;
