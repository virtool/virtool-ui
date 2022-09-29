import React from "react";
import { NoneFoundBox } from "../NoneFound";

export default {
    title: "base/NoneFound/NoneFoundBox",
    component: NoneFoundBox
};

const Template = args => <NoneFoundBox {...args} />;

export const testBox1 = Template.bind({});

testBox1.args = {
    noun: "hello"
};

export const textBox2 = Template.bind({});

textBox2.args = {
    noun: "test2",
    children: ["testchild1", "testchild2", "testchild3"]
};

export const longNounNoneFoundBox = Template.bind({});

longNounNoneFoundBox.args = {
    noun: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
};
