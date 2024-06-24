import { BoxGroup, BoxGroupHeader, BoxGroupSection } from "@base";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta<typeof BoxGroupSection> = {
    title: "base/Box/BoxGroupSection",
    component: BoxGroupSection,
    parameters: {
        docs: {
            description: {
                component:
                    "A wrapper for elements contained inside a box or boxgroup. Helps to ensure visual consistency and prevents double borders from occuring.",
            },
        },
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

function Template(args) {
    return (
        <BoxGroup>
            <BoxGroupHeader>These are BoxGroupSections!</BoxGroupHeader>
            <BoxGroupSection {...args} />
            <BoxGroupSection>Second BoxGroupSection</BoxGroupSection>
            <BoxGroupSection>Third BoxGroupSection</BoxGroupSection>
        </BoxGroup>
    );
}

function ClickableTemplate(args) {
    return (
        <BoxGroup>
            <BoxGroupHeader>These are clickable BoxGroupSections!</BoxGroupHeader>
            <BoxGroupSection {...args}>First BoxGroupSection</BoxGroupSection>
            <BoxGroupSection {...args}>Second BoxGroupSection</BoxGroupSection>
            <BoxGroupSection {...args}>Third BoxGroupSection</BoxGroupSection>
        </BoxGroup>
    );
}

export const TestBoxGroupSection: Story = {
    args: {
        children: "First BoxGroupSection",
    },
    render: Template,
};

export const ClickableBoxGroupSection: Story = {
    args: {
        onClick: () => console.log("Click Here!"),
    },
    render: ClickableTemplate,
};
