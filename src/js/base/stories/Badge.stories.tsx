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
    argTypes: {
        color: {
            options: ["grayDark", "blue", "orange", "purple", "red"],
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
    render: ({ children, color }) => (
        <StyledBadgeHeader>
            <strong>Files Uploaded</strong>
            <Badge color={color}>{children}</Badge>
        </StyledBadgeHeader>
    ),
    args: {
        children: 10,
        color: "grayDark",
    },
};
