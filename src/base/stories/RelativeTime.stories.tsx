import type { Meta, StoryObj } from "@storybook/react";
import { toString } from "lodash-es";
import RelativeTime from "../RelativeTime";

const currentDate = new Date();

const meta: Meta<typeof RelativeTime> = {
    title: "base/RelativeTime",
    component: RelativeTime,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const CurrentRelativeTime: Story = {
    args: {
        time: toString(currentDate),
    },
};

export const FutureRelativeTime: Story = {
    args: {
        time: toString(
            new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + 8,
            ),
        ),
    },
};

export const PastRelativeTime: Story = {
    args: {
        time: toString(
            new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() - 6,
            ),
        ),
    },
};
