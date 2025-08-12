import type { Meta, StoryObj } from "@storybook/react-vite";
import Alert from "../Alert";

const meta: Meta<typeof Alert> = {
    title: "base/Alert",
    component: Alert,
    parameters: {
        controls: {
            exclude: "level",
        },
    },
    argTypes: {
        className: { control: { type: "text" } },
        block: { options: ["true", "false"], control: { type: "boolean" } },
        icon: { control: { type: "object" } },
        color: {
            options: ["red", "orange", "purple", "blue", "black"],
            control: { type: "radio" },
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
