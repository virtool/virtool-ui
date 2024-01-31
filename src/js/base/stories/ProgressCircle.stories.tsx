import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ProgressCircle } from "../ProgressCircle";

const meta: Meta<typeof ProgressCircle> = {
    title: "base/ProgressCircle",
    component: ProgressCircle,
    args: {
        progress: 50,
        state: "running",
    },
    argTypes: {
        progress: {
            control: { type: "range", min: 0, max: 100 },
        },
        state: {
            control: { type: "radio" },
            options: ["running", "complete", "failed"],
        },
    },
};

export default meta;

type Story = StoryObj<typeof ProgressCircle>;

export const Waiting: Story = {
    render: args => <ProgressCircle {...args} state="waiting" progress={0} />,
};

export const Running: Story = {
    render: args => {
        return <ProgressCircle {...args} state="running" />;
    },
};

export const Error: Story = {
    render: args => {
        return <ProgressCircle {...args} state="error" />;
    },
};

export function Complete(args) {
    return <ProgressCircle {...args} state="complete" progress={100} />;
}
