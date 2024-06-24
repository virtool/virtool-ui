import { Box } from "@base";
import type { Meta, StoryObj } from "@storybook/react";

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
    tags: ["autodocs"],
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
        onClick: () => console.log("clicked"),
    },
};
