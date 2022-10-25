import React from "react";
import { NoneFound } from "../../NoneFound";

export default {
    title: "base/NoneFound/NoneFound",
    component: NoneFound
};

const Template = args => <NoneFound {...args} />;

export const exampleNoneFound = Template.bind({});

exampleNoneFound.args = {
    noun: "{plural nouns}"
};

export const sampleNoneFound = Template.bind({});

sampleNoneFound.args = {
    noun: "samples"
};
