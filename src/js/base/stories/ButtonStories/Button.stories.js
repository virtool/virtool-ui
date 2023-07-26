import React from "react";
import { Button } from "../../Button";

export default {
    title: "base/Button/Button",
    component: Button,
    parameters: {
        controls: {
            exclude: ["tipPlacement", "type", "onBlur"],
        },
    },
    args: {
        children: "Click Here",
    },
    argTypes: {
        color: {
            options: ["black", "blue", "orange", "purple", "red"],
            control: { type: "radio" },
            defaultValue: "blue",
        },
        tip: {
            type: "string",
            defaultValue: "Display Form",
        },
    },
};

const Template = args => <Button onClick={() => console.log("clicked")} {...args} />;

export const basicButton = Template.bind({});

basicButton.args = {
    active: false,
};
