import React from "react";
import { Box, BoxGroupHeader, BoxGroupSection } from "../../Box";

export default {
    title: "base/Box/Box",
    component: Box,
    parameters: {
        docs: {
            description: {
                component: "A simple box wrapper element"
            }
        }
    }
};

const Template = args => <Box {...args} />;

export const sampleBox = Template.bind({});

sampleBox.args = {
    children: "This is a Box!"
};

export const clickableBox = Template.bind({});

clickableBox.args = {
    children: "This is a clickable Box!",
    onClick: () => console.log("clicked")
};

const BoxWithElementsTemplate = args => (
    <Box {...args}>
        <BoxGroupHeader {...args}>
            <h2>This is a Box with a header and 3 elements!</h2>
        </BoxGroupHeader>
        <BoxGroupSection>Element 1</BoxGroupSection>
        <BoxGroupSection>Element 2</BoxGroupSection>
        <BoxGroupSection>Element 3</BoxGroupSection>
    </Box>
);

export const exampleBox = BoxWithElementsTemplate.bind({});
