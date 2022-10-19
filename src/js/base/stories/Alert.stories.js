import React from "react";
import { Alert } from "../Alert";

export default {
    title: "base/Alert",
    component: Alert
};

const Template = args => <Alert {...args} />;

export const greenAlert = Template.bind({});

greenAlert.args = {
    children: "test alert",
    color: "green",
    level: true
};
