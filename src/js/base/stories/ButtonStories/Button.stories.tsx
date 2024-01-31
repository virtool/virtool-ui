import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button } from "../../Button";
import { Table } from "../../Table";

const meta: Meta<typeof Table> = {
    component: Button,
    id: "button",
    title: "base/Button/Button",
    args: {
        children: "Click Here",
        color: "blue",
        tip: "Tooltip",
    },
    argTypes: {
        color: {
            options: ["blue", "grey", "orange", "purple", "red"],
            control: { type: "radio" },
        },
        tip: {
            type: "string",
        },
    },
    parameters: {
        controls: {
            exclude: ["tipPlacement", "type", "onBlur"],
        },
    },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
    render: function Render(args) {
        return <Button {...args}>{args.children}</Button>;
    },
};
