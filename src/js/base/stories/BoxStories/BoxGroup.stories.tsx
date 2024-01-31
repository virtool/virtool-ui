import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { BoxGroup } from "../../BoxGroup";
import { BoxGroupHeader } from "../../BoxGroupHeader";
import { BoxGroupSection } from "../../BoxGroupSection";

const meta: Meta<typeof BoxGroup> = {
    title: "base/Box/BoxGroup",
    component: BoxGroup,
    parameters: {
        docs: {
            description: {
                component:
                    "Similar to a box but adds additional styling for visual consistency. This styling targets children and prevents double borders from occuring at the top.",
            },
        },
        controls: { hideNoControlsWarning: true },
    },
};

export default meta;

type Story = StoryObj<typeof BoxGroup>;

export const Default: Story = {
    render: function Render(args) {
        return (
            <BoxGroup>
                <BoxGroupHeader>
                    <h2>This is an h2 element in a BoxGroupHeader</h2>
                </BoxGroupHeader>
                <BoxGroupSection>This is section 1</BoxGroupSection>
                <BoxGroupSection>This is section 2</BoxGroupSection>
                <BoxGroupSection>This is section 3</BoxGroupSection>
                <BoxGroupSection>This is section 4</BoxGroupSection>
                <BoxGroupSection>This is section 5</BoxGroupSection>
            </BoxGroup>
        );
    },
};
