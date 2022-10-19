import React from "react";
import { NameAttribution } from "../../Attribution";

export default {
    title: "base/Attribution/NameAttribution",
    component: NameAttribution
};

const Template = args => <NameAttribution {...args} />;

export const TestUserAttribution = Template.bind({});

TestUserAttribution.args = {
    user: "test user"
};
