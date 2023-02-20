import React from "react";
import { Link } from "react-router-dom";
import { NoneFoundSection } from "../../NoneFoundSection";

export default {
    title: "base/NoneFound/NoneFoundSection",
    component: NoneFoundSection,
    args: {
        noun: "items"
    }
};

const Template = args => (
    <NoneFoundSection {...args}>{args.displayLink && <Link to="#">Click here to create one</Link>}</NoneFoundSection>
);

export const testNoneFoundSection = Template.bind({});

export const NoneFoundSectionWithChild = Template.bind({});

NoneFoundSectionWithChild.args = {
    displayLink: true
};
