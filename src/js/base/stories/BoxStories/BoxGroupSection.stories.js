import React from "react";
import { BoxGroupSection } from "../../Box";

export default {
    title: "base/Box/BoxGroupSection",
    component: BoxGroupSection
};

const Template = args => <BoxGroupSection {...args} />;

export const testBoxGroupSection = Template.bind({});

testBoxGroupSection.args = {
    children: "test",
    onClick: () => console.log("clicked")
};
