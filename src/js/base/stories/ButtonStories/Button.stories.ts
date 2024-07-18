import { Button } from "@base";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Button> = {
    title: "base/Button/Button",
    component: Button,
    parameters: {
        controls: {
            exclude: ["tipPlacement", "type", "onBlur"],
        },
    },
    tags: ["autodocs"],
    argTypes: {
        children: { type: "string" },
        color: {
            options: ["black", "blue", "orange", "purple", "red"],
            control: { type: "radio" },
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const BasicButton: Story = {
    args: {
        active: false,
        children: "Click here",
        color: "blue",
        onClick: () => console.log("clicked"),
        tip: "Display Form",
    },
};
