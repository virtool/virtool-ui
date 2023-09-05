import React from "react";
import styled from "styled-components";
import { Badge } from "../Badge";

const StyledBadgeHeader = styled.div`
    align-items: center;
    display: flex;
    strong {
        margin-right: 5px;
    }
`;

export default {
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
            options: ["greyDark", "blue", "orange", "purple", "red"],
            control: { type: "radio" },
            defaultValue: "greyDark",
        },
        children: {
            type: "number",
            defaultValue: 10,
        },
    },
};

const Template = args => (
    <StyledBadgeHeader>
        <strong>Files Uploaded</strong>
        <Badge {...args} />
    </StyledBadgeHeader>
);

export const sampleBadge = Template.bind({});
