import React from "react";
import { BoxGroupHeader } from "../../Box";

export default {
    title: "base/Box/BoxGroupHeader",
    component: BoxGroupHeader
};

const Template = args => (
    <BoxGroupHeader {...args}>
        <h2>test</h2>
        <p>test paragraph</p>
    </BoxGroupHeader>
);

export const testBoxGroupHeader = Template.bind({});
