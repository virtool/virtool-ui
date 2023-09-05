import React from "react";
import { RelativeTime } from "../RelativeTime";

const currentDate = new Date();

export default {
    title: "base/RelativeTime",
    component: RelativeTime,
};

const Template = args => <RelativeTime {...args} />;

export const currentRelativeTime = Template.bind({});

currentRelativeTime.args = {
    time: currentDate,
};

export const futureRelativeTime = Template.bind({});

futureRelativeTime.args = {
    time: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 8),
};

export const pastRelativeTime = Template.bind({});

pastRelativeTime.args = {
    time: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6),
};
