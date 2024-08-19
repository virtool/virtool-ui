import { IconButton } from "@base/IconButton";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof IconButton> = {
    title: "base/IconButton",
    component: IconButton,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const iconButton: Story = {
    args: {
        name: "trash",
        color: "red",
        onClick: fn,
        tip: "Remove",
        tipPlacement: "top",
    },
};
