import { StoryObj } from "@storybook/react";
import React from "react";
import { BoxGroup } from "../../BoxGroup";
import { BoxGroupHeader } from "../../BoxGroupHeader";
import { BoxGroupSection } from "../../BoxGroupSection";
import { NoneFoundSection } from "../../NoneFoundSection";

const meta = {
    title: "base/NoneFound/NoneFoundSection",
    component: NoneFoundSection,
    args: {
        noun: "things",
    },
    argTypes: {
        noun: {
            type: "string",
        },
    },
};

export default meta;

type Story = StoryObj<typeof NoneFoundSection>;

export const Default: Story = {
    render: function Render(args) {
        return (
            <BoxGroup>
                <BoxGroupHeader>Header</BoxGroupHeader>
                <BoxGroupSection>First section</BoxGroupSection>
                <BoxGroupSection>Second section</BoxGroupSection>
                <NoneFoundSection {...args} />
            </BoxGroup>
        );
    },
};
