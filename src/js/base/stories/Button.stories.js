import React from "react";
import { Button } from "../Button";

export default {
    title: "base/Button/Button",
    component: Button
};

const Template = args => <Button {...args} />;

export const greenBasicButton = Template.bind({});

greenBasicButton.args = {
    color: "green",
    active: true
};

export const redBasicButton = Template.bind({});

redBasicButton.args = {
    color: "red",
    active: true
};

export const buttonWithChildren = Template.bind({});

buttonWithChildren.args = {
    color: "blue",
    active: true,
    children: "hello"
};
