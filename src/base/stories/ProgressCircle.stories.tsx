import ProgressCircle from "../ProgressCircle";
import { JobState } from "../../jobs/types";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ProgressCircle> = {
    title: "base/ProgressCircle",
    component: ProgressCircle,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Waiting: Story = {
    args: { progress: 0 },
};

export const Running: Story = {
    args: { progress: 50, state: JobState.running },
};

export const Failed: Story = {
    args: { progress: 50, state: JobState.error },
};

export const Complete: Story = {
    args: { progress: 100, state: JobState.complete },
};
