import type { Meta, StoryObj } from "@storybook/react";
import { ProgressCircle } from "../ProgressCircle";

const meta: Meta<typeof ProgressCircle> = {
    title: "base/ProgressCircle",
    component: ProgressCircle,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Waiting: Story = {
    args: { progress: 0 },
};

export const Running: Story = {
    args: { progress: 50, state: "running" },
};

export const Failed: Story = {
    args: { progress: 50, state: "error" },
};

export const Complete: Story = {
    args: { progress: 100, state: "complete" },
};
