import { Box, BoxTitle } from "@base";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta<typeof BoxTitle> = {
    title: "base/Box/BoxTitle",
    component: BoxTitle,
};

export default meta;

type Story = StoryObj<typeof meta>;

function Template(args) {
    return (
        <Box>
            <BoxTitle {...args} />
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
            </p>
        </Box>
    );
}

export const TestBoxTitle: Story = {
    args: {
        children: "This is a BoxTitle!",
    },
    render: Template,
};
