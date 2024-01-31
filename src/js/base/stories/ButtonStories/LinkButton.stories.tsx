import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { LinkButton } from "../../LinkButton";

const meta: Meta<typeof LinkButton> = {
    title: "base/Button/LinkButton",
    component: LinkButton,
    args: {
        children: "Go to Root",
        className: "",
        color: "green",
        disabled: false,
        icon: "chevron-left",
        tip: "",
        to: "/",
    },
    argTypes: {
        color: {
            options: ["black", "blue", "orange", "purple", "red"],
            control: { type: "radio" },
        },
        tip: {
            type: "string",
        },
        to: {
            type: "string",
        },
    },
    parameters: {
        controls: {
            exclude: ["onClick", "replace"],
        },
    },
};

export default meta;

type Story = StoryObj<typeof LinkButton>;

export const Default: Story = {
    render: function Render(args) {
        return <LinkButton {...args} />;
    },
};
