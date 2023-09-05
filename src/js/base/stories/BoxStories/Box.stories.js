import React from "react";
import { Box } from "../../Box";

export default {
    title: "base/Box/Box",
    component: Box,
    parameters: {
        docs: {
            description: {
                component:
                    "A box wrapper element that is useful for building custom wrapping elements or when a simple box is needed.",
            },
        },
    },
};

const Template = args => <Box {...args} />;

export const sampleBox = Template.bind({});

sampleBox.args = {
    children: "This is a Box!",
};

export const clickableBox = Template.bind({});

clickableBox.args = {
    children: "This is a clickable Box!",
    onClick: () => console.log("clicked"),
};
