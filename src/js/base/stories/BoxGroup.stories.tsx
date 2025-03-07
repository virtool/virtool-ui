import Input from '@base/Input';
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import Button from "@base/Button";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import styled from "styled-components";

const StyledButton = styled(Button)`
    margin-top: 10px;
`;

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

function Template(args) {
    const [term, setTerm] = useState("");

    const { children, ...rest } = args;

    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2 {...rest}>{children}</h2>
            </BoxGroupHeader>
            <BoxGroupSection>
                <Input
                    type="text"
                    placeholder="Enter a valid email here!"
                    value={term}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTerm(e.target.value)
                    }
                />
                <StyledButton type="submit" color="blue">
                    Submit
                </StyledButton>
            </BoxGroupSection>
        </BoxGroup>
    );
}

export default meta;

type Story = StoryObj<typeof meta>;

export const ExampleBoxGroup: Story = {
    args: {
        children: "This is a BoxGroup",
    },
    render: Template,
};

function BoxWithElementsTemplate(args) {
    return (
        <BoxGroup {...args}>
            <BoxGroupHeader {...args}>
                <h2>This is a BoxGroup with a header and 3 elements!</h2>
            </BoxGroupHeader>
            <BoxGroupSection>Element 1</BoxGroupSection>
            <BoxGroupSection>Element 2</BoxGroupSection>
            <BoxGroupSection>Element 3</BoxGroupSection>
        </BoxGroup>
    );
}

export const ExampleBox: Story = {
    render: BoxWithElementsTemplate,
};
