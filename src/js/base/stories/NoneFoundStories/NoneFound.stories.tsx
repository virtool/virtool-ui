import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { NoneFound } from "../../NoneFound";

const meta: Meta<typeof NoneFound> = {
    title: "base/NoneFound/NoneFound",
    component: NoneFound,
    args: {
        noun: "things",
    },
    argTypes: {
        noun: {
            type: "string",
        },
    },
};

export default meta;

type Story = StoryObj<typeof NoneFound>;

export const Default: Story = {
    render: function Render(args) {
        return <NoneFound {...args} />;
    },
};
