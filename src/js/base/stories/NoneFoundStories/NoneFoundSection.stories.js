import React from "react";
import { NoneFoundSection } from "../../NoneFound";

export default {
    title: "base/NoneFound/NoneFoundSection",
    component: NoneFoundSection,
    args: {
        noun: "testNoun"
    }
};

const Template = args => <NoneFoundSection {...args} />;

export const testNoneFoundSection = Template.bind({});

export const NoneFoundSectionWithChild = Template.bind({});

NoneFoundSectionWithChild.args = {
    children: "test"
};
