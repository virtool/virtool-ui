import React from "react";
import { AttributionWithName } from "../../AttributionWithName";

export default {
    title: "base/Attribution/NameAttribution",
    component: AttributionWithName,
};

const Template = args => <AttributionWithName {...args} />;

export const nameAttribution = Template.bind({});

nameAttribution.args = {
    user: "James Smith",
};
