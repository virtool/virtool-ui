import React from "react";
import { Button } from "../../Button";

export default {
    title: "base/Button/Button",
    component: Button,
    args: {
        children: "Click Here"
    },
    argTypes: {
        color: {
            options: ["red", "orange", "purple", "blue", "black"],
            control: { type: "radio" },
            defaultValue: "blue"
        }
    }
};

const Template = args => <Button {...args} />;

export const basicButton = Template.bind({});

basicButton.args = {
    active: false
};
