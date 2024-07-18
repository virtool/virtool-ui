import { BoxLink } from "@base";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof BoxLink> = {
    title: "base/Box/LinkBox",
    component: BoxLink,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const TestLinkBox: Story = {
    args: {
        children: "Virtool Samples Page",
        to: "#",
    },
};
