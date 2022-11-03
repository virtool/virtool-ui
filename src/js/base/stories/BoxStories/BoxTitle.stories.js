import React from "react";
import { BoxTitle, Box } from "../../Box";

export default {
    title: "base/Box/BoxTitle",
    component: BoxTitle
};

const Template = args => (
    <Box>
        <BoxTitle {...args} />
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat.
        </p>
    </Box>
);

export const testBoxTitle = Template.bind({});

testBoxTitle.args = {
    children: "This is a BoxTitle!"
};
