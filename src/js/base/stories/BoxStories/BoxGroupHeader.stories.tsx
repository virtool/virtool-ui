import { BoxGroup, BoxGroupHeader } from "@base";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta<typeof BoxGroupHeader> = {
    title: "base/Box/BoxGroupHeader",
    component: BoxGroupHeader,
    parameters: {
        controls: {
            hideNoControlsWarning: true,
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

function Template(args) {
    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2 {...args} />
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                </p>
            </BoxGroupHeader>
        </BoxGroup>
    );
}

export const TestBoxGroupHeader: Story = { args: { children: "This is a BoxGroupHeader!" }, render: Template };
