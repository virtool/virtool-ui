import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Badge } from "../Badge";

const meta: Meta<typeof Badge> = {
    title: "base/Badge",
    component: Badge,
    args: {
        children: "Text",
        color: "grey",
    },
    argTypes: {
        children: {
            type: "string",
        },
        color: {
            options: ["grey", "blue", "orange", "purple", "red"],
            control: { type: "radio" },
        },
    },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
    render: function Render(args) {
        return <Badge {...args} />;
    },
};
