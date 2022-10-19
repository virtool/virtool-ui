import React from "react";
import { Box } from "../../Box";

export default {
    title: "base/Box/Box",
    component: Box,
    args: {
        children: "test"
    }
};

const Template = args => <Box {...args} />;

export const sampleBox = Template.bind({});

export const boxWithOnClick = Template.bind({});

boxWithOnClick.args = {
    onClick: () => console.log("clicked")
};
