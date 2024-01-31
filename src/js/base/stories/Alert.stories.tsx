import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Alert } from "../Alert";

const meta: Meta<typeof Alert> = {
    component: Alert,
    title: "base/Alert",
    args: {
        children: "This is a destructive operation.",
        color: "red",
        icon: "bomb",
    },
    argTypes: {
        color: {
            control: { type: "radio" },
            options: ["black", "blue", "green", "orange", "purple", "red"],
        },
    },
    parameters: {
        controls: {
            exclude: ["as", "block", "forwardedAs", "level", "theme"],
        },
    },
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
    render: args => <Alert {...args} />,
};
