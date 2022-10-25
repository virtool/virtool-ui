import React from "react";
import { LinkButton } from "../../Button";

export default {
    title: "base/Button/LinkButton",
    component: LinkButton,
    argTypes: {
        color: {
            options: ["red", "orange", "purple", "blue", "black"],
            control: { type: "radio" },
            defaultValue: "blue"
        }
    },
    args: {
        children: "Virtool Samples Page"
    }
};

const Template = args => <LinkButton {...args} />;

export const linkButton = Template.bind({});

linkButton.args = {
    to: "#"
};
