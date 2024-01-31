import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Box } from "../../Box";
import { BoxTitle } from "../../BoxTitle";

const meta: Meta<typeof Box> = {
    title: "base/Box/Box",
    component: Box,
    args: {
        children: "This is a Box!",
    },
    argTypes: {
        children: {
            type: "string",
        },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "A box wrapper element that is useful for building custom wrapping elements or when a simple box is needed.",
            },
        },
    },
};

export default meta;

type Story = StoryObj<typeof Box>;

export const Default: Story = {
    render: function Render(args) {
        return <Box {...args} />;
    },
};

export const WithTitle: Story = {
    render: function Render(args) {
        return (
            <Box>
                <BoxTitle>This is a title</BoxTitle>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
            </Box>
        );
    },
};

export const Clickable: Story = {
    render: function Render(args) {
        return <Box {...args} onClick={() => alert("Clicked!")} />;
    },
};
