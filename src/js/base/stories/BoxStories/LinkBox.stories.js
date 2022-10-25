import React from "react";
import { LinkBox } from "../../Box";

export default {
    title: "base/Box/LinkBox",
    component: LinkBox
};

const Template = args => <LinkBox {...args} />;

export const testLinkBox = Template.bind({});

testLinkBox.args = {
    children: "Virtool Samples Page",
    to: "#"
};
