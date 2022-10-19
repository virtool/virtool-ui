import React from "react";
import { SelectBoxGroupSection } from "../../Box";

export default {
    title: "base/Box/SelectBoxGroupSection",
    component: SelectBoxGroupSection
};

const Template = args => <SelectBoxGroupSection {...args} />;

export const testSelectBoxGroupSection = Template.bind({});

testSelectBoxGroupSection.args = {
    active: true,
    children: "test",
    onClick: () => console.log("clicked")
};
