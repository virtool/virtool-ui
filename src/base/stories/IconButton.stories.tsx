import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import IconButton from "../IconButton";

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
