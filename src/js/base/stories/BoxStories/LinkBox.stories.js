import React from "react";
import { BoxLink } from "../../BoxLink";

export default {
    title: "base/Box/LinkBox",
    component: BoxLink
};

const Template = args => <BoxLink {...args} />;

export const testLinkBox = Template.bind({});

testLinkBox.args = {
    children: "Virtool Samples Page",
    to: "#"
};
