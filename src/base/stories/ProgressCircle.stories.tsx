import type { Meta, StoryObj } from "@storybook/react-vite";
import ProgressCircle from "../ProgressCircle";

const meta: Meta<typeof ProgressCircle> = {
    title: "base/ProgressCircle",
    component: ProgressCircle,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Pending: Story = {
    args: { progress: 0 },
};

export const Running: Story = {
    args: { progress: 50, state: "running" },
};

export const Failed: Story = {
    args: { progress: 50, state: "failed" },
};

export const Succeeded: Story = {
    args: { progress: 100, state: "succeeded" },
};
