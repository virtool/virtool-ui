import React from "react";
import { NoneFound } from "../NoneFound";

export default {
    title: "base/NoneFound/NoneFound",
    component: NoneFound
};

const Template = args => <NoneFound {...args} />;

export const shortNoneFound = Template.bind({});

shortNoneFound.args = {
    noun: "hello"
};

export const longNoneFound = Template.bind({});

longNoneFound.args = {
    noun: "writing a very long none found noun ... writing a very long none found noun ..."
};

export const noNoneFound = Template.bind({});
