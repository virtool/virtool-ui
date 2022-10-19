import React from "react";
import { NoneFound } from "../../NoneFound";

export default {
    title: "base/NoneFound/NoneFound",
    component: NoneFound
};

const Template = args => <NoneFound {...args} />;

export const shortNoneFound = Template.bind({});

shortNoneFound.args = {
    noun: "items"
};

export const noNoneFound = Template.bind({});
