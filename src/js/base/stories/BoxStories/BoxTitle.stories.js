import React from "react";
import { BoxTitle } from "../../Box";

export default {
    title: "base/Box/BoxTitle",
    component: BoxTitle
};

const Template = args => <BoxTitle {...args} />;

export const testBoxTitle = Template.bind({});

testBoxTitle.args = {
    children: "Test Title"
};
