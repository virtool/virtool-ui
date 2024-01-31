import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Attribution } from "../Attribution";

const meta: Meta<typeof Attribution> = {
    title: "base/Attribution",
    component: Attribution,
    args: {
        className: "",
        time: "2021-12-17T03:24:00",
        verb: "created",
        user: "James Smith",
    },
    parameters: {
        controls: { exclude: ["as", "forwardedAs", "theme"] },
    },
};

export default meta;

type Story = StoryObj<typeof Attribution>;

export const WithUsername: Story = {
    render: function Render(args) {
        return <Attribution {...args} />;
    },
};

export const WithoutUsername: Story = {
    render: function Render(args) {
        return <Attribution {...args} user="" />;
    },
};
