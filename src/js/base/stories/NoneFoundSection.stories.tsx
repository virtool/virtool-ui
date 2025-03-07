import NoneFoundSection from '@base/NoneFoundSection';
import Link from '@base/Link';
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta<typeof NoneFoundSection> = {
    title: "base/NoneFound/NoneFoundSection",
    component: NoneFoundSection,
    args: {
        noun: "items",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

function Template(args) {
    return (
        <NoneFoundSection {...args}>
            {args.displayLink && <Link to="#">Click here to create one</Link>}
        </NoneFoundSection>
    );
}

export const TestNoneFoundSection: Story = {
    render: Template,
};

export const NoneFoundSectionWithChild: Story = {
    render: () => <Template displayLink />,
};
