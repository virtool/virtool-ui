import { Alert } from "@base";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Alert> = {
    title: "base/Alert",
    component: Alert,
    parameters: {
        controls: {
            exclude: "level",
        },
    },
    tags: ["autodocs"],
    argTypes: {
        className: { control: { type: "text" } },
        block: { options: ["true", "false"], control: { type: "boolean" } },
        icon: { control: { type: "object" } },
        color: {
            options: ["red", "orange", "purple", "blue", "black"],
            control: { type: "radio" },
            defaultValue: "red",
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const SampleAlert: Story = {
    args: {
        children: "This is an example Alert!",
        color: "red",
        level: true,
    },
};
