import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { RelativeTime } from "../RelativeTime";

const currentDate = new Date();

const meta: Meta<typeof RelativeTime> = {
    component: RelativeTime,
    title: "base/RelativeTime",
    args: {
        time: currentDate,
    },
    argTypes: {
        time: {
            control: { type: "date" },
        },
    },
};

export default meta;

type Story = StoryObj<typeof RelativeTime>;

export const Current: Story = {
    render: args => <RelativeTime {...args} />,
};

export const Future: Story = {
    render: args => (
        <RelativeTime
            {...args}
            time={new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 8)}
        />
    ),
};

export const Past: Story = {
    render: args => (
        <RelativeTime
            {...args}
            time={new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6)}
        />
    ),
};
