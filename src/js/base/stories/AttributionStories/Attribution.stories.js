import React from "react";
import { Attribution } from "../../Attribution";

export default {
    title: "base/Attribution/Attribution",
    component: Attribution,
    args: {
        time: "2021-12-17T03:24:00"
    }
};

const Template = args => <Attribution {...args} />;

export const NoUserAttribution = Template.bind({});

export const TestUserAttribution = Template.bind({});

TestUserAttribution.args = {
    user: "test user"
};
