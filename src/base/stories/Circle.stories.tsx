import type { Meta, StoryObj } from "@storybook/react-vite";
import Circle from "../Circle";

const meta: Meta<typeof Circle> = {
    title: "base/Circle",
    component: Circle,
    parameters: {
        layout: "centered",
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        size: 20,
        color: "blue",
    },
};

export const Small: Story = {
    args: {
        size: 10,
        color: "red",
    },
};

export const Large: Story = {
    args: {
        size: 50,
        color: "green",
    },
};

export const Gray: Story = {
    args: {
        size: 20,
        color: "gray",
    },
};

export const Full: Story = {
    args: {
        size: 20,
        color: "blue",
        fill: "full",
    },
};

export const Empty: Story = {
    args: {
        size: 20,
        color: "blue",
        fill: "empty",
    },
};

export const Half: Story = {
    args: {
        size: 20,
        color: "blue",
        fill: "half",
    },
};
