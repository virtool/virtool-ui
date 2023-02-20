import React from "react";
import { NoneFoundBox } from "../../NoneFoundBox";

export default {
    title: "base/NoneFound/NoneFoundBox",
    component: NoneFoundBox
};

const Template = args => <NoneFoundBox {...args} />;

export const testBox1 = Template.bind({});

testBox1.args = {
    noun: "items"
};
