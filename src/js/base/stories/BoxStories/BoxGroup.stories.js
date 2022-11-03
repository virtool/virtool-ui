import React from "react";
import { BoxGroup, BoxGroupHeader, BoxGroupSection } from "../../Box";
import { Input } from "../../Input";
import { Button } from "../../Button";
import styled from "styled-components";

const StyledButton = styled(Button)`
    margin-top: 10px;
`;

export default {
    title: "base/Box/BoxGroup",
    component: BoxGroup,
    parameters: {
        docs: {
            description: {
                component:
                    "Similar to a box but adds additional styling for visual consistency. This styling targets children and prevents double borders from occuring at the top."
            }
        },
        controls: { hideNoControlsWarning: true }
    }
};

const Template = args => (
    <BoxGroup>
        <BoxGroupHeader>
            <h2 {...args} />
        </BoxGroupHeader>
        <BoxGroupSection>
            <Input type="text" placeholder="Enter a valid email here!" />
            <StyledButton type="submit" color="blue">
                Submit
            </StyledButton>
        </BoxGroupSection>
    </BoxGroup>
);

export const exampleBoxGroup = Template.bind({});

exampleBoxGroup.args = {
    children: "This is a BoxGroup"
};

const BoxWithElementsTemplate = args => (
    <BoxGroup {...args}>
        <BoxGroupHeader {...args}>
            <h2>This is a BoxGroup with a header and 3 elements!</h2>
        </BoxGroupHeader>
        <BoxGroupSection>Element 1</BoxGroupSection>
        <BoxGroupSection>Element 2</BoxGroupSection>
        <BoxGroupSection>Element 3</BoxGroupSection>
    </BoxGroup>
);

export const exampleBox = BoxWithElementsTemplate.bind({});
