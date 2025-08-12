import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Box from "../Box";

const meta: Meta<typeof Box> = {
    title: "base/Box/Box",
    component: Box,
    parameters: {
        docs: {
            description: {
                component:
                    "A box wrapper element that is useful for building custom wrapping elements or when a simple box is needed.",
            },
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const SampleBox: Story = {
    args: {
        children: "This is a Box!",
    },
};

export const ClickableBox: Story = {
    args: {
        children: "This is a clickable Box!",
        onClick: fn(),
    },
};
