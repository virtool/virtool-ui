import React from "react";
import { BoxGroup } from "../../Box";

export default {
    title: "base/Box/BoxGroup",
    component: BoxGroup
};

const Template = args => <BoxGroup {...args} />;

export const testBoxGroup = Template.bind({});

testBoxGroup.args = {
    children: "test"
};
