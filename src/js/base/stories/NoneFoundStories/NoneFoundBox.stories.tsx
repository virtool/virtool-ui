import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { NoneFound } from "../../NoneFound";
import { NoneFoundBox } from "../../NoneFoundBox";

const meta: Meta<typeof NoneFound> = {
    title: "base/NoneFound/NoneFoundBox",
    component: NoneFoundBox,
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

type Story = StoryObj<typeof NoneFoundBox>;

export const Default: Story = {
    render: function Render(args) {
        return <NoneFoundBox {...args} />;
    },
};
