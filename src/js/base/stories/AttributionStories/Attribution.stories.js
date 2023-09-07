import React from "react";
import { Attribution } from "../../Attribution";

export default {
    title: "base/Attribution/Attribution",
    component: Attribution,
    args: {
        time: "2021-12-17T03:24:00",
    },
};

const Template = args => <Attribution {...args} />;

export const attributionWithUsername = Template.bind({});

attributionWithUsername.args = {
    user: "James Smith",
};

export const attributionWithNoUsername = Template.bind({});
