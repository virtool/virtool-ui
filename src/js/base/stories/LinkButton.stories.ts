import LinkButton from '@base/LinkButton';
import type { Meta, StoryObj } from "@storybook/react";

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
