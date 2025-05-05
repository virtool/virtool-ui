import type { Meta, StoryObj } from "@storybook/react";
import LinkButton from "../LinkButton";

const meta: Meta<typeof LinkButton> = {
    title: "base/LinkButton",
    component: LinkButton,
    parameters: {
        controls: {
            exclude: ["replace"],
        },
    },
    argTypes: {
        children: { type: "string" },
        color: {
            control: { type: "radio" },
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const linkButton: Story = {
    args: {
        children: "Link",
        color: "blue",
        to: "#",
    },
};
