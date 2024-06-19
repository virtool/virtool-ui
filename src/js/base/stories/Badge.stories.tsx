import { Badge } from "@base";
import { Meta, type StoryObj } from "@storybook/react";
import React from "react";
import styled from "styled-components";

const StyledBadgeHeader = styled.div`
    align-items: center;
    display: flex;
    strong {
        margin-right: 5px;
    }
`;

const meta: Meta<typeof Badge> = {
    title: "base/Badge",
    component: Badge,
    parameters: {
        docs: {
            description: {
                component: "Useful for highlighting the status or quantity of an item.",
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        color: {
            options: ["greyDark", "blue", "orange", "purple", "red"],
            control: { type: "radio" },
        },
        children: {
            type: "number",
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const SampleBadge: Story = {
    render: args => (
        <StyledBadgeHeader>
            <strong>Files Uploaded</strong>
            <Badge {...args} />
        </StyledBadgeHeader>
    ),
    args: {
        children: 10,
        color: "greyDark",
    },
};
