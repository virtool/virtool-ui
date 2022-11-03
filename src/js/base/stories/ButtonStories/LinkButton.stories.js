import React from "react";
import { LinkButton } from "../../Button";

export default {
    title: "base/Button/LinkButton",
    component: LinkButton,
    parameters: {
        controls: {
            exclude: ["tipPlacement", "replace"]
        }
    },
    argTypes: {
        color: {
            options: ["black", "blue", "orange", "purple", "red"],
            control: { type: "radio" },
            defaultValue: "blue"
        },
        tip: {
            type: "string",
            defaultValue: "Visit Page"
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
