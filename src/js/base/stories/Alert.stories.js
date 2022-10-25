import React from "react";
import { Alert } from "../Alert";

export default {
    title: "base/Alert",
    component: Alert,
    argTypes: {
        color: {
            options: ["red", "orange", "purple", "blue", "black"],
            control: { type: "radio" },
            defaultValue: "red"
        }
    }
};

const Template = args => <Alert {...args} />;

export const greenAlert = Template.bind({});

greenAlert.args = {
    children: "This is an example Alert!",
    level: true
};
