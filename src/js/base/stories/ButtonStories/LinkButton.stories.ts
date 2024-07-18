import { LinkButton } from "@base";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof LinkButton> = {
    title: "base/Button/LinkButton",
    component: LinkButton,
    parameters: {
        controls: {
            exclude: ["tipPlacement", "replace"],
        },
    },
    argTypes: {
        children: { type: "string" },
        color: {
            options: ["black", "blue", "orange", "purple", "red"],
            control: { type: "radio" },
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const linkButton: Story = {
    args: {
        children: "Virtool Samples Page",
        color: "blue",
        to: "#",
        tip: "Visit Page",
    },
};
