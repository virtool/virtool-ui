import React from "react";
import { BoxGroup, BoxGroupHeader } from "../../Box";
import { Input } from "../../Input";
import { Button } from "../../Button";
import styled from "styled-components";

const StyledDiv = styled.div`
    button {
        margin: 5px;
    }
    input {
        margin: 5px 0px 0px 5px;
        width: 50%;
    }
`;

export default {
    title: "base/Box/BoxGroup",
    component: BoxGroup,
    parameters: {
        docs: {
            description: {
                component: "A wrapper element designed to contain children"
            }
        }
    }
};

const Template = args => (
    <StyledDiv>
        <BoxGroup {...args}>
            <BoxGroupHeader>
                <h2>This is a BoxGroup</h2>
            </BoxGroupHeader>
            <Input type="text" placeholder="Enter a valid email here!" />
            <Button type="submit" color="blue">
                Submit
            </Button>
        </BoxGroup>
    </StyledDiv>
);

export const exampleBoxGroup = Template.bind({});

const PlainTemplate = args => <BoxGroup {...args} />;

export const emptyBoxGroup = PlainTemplate.bind({});

emptyBoxGroup.args = {
    children: "Empty BoxGroup"
};
