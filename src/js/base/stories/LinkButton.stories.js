import React from "react";
import { LinkButton } from "../Button";

export default {
    title: "base/Button/LinkButton",
    component: LinkButton
};

const Template = args => <LinkButton {...args} />;

export const greenLinkButton = Template.bind({});

greenLinkButton.args = {
    color: "green",
    to: "/",
    children: "this is a green link button"
};

export const extremelyLongLinkButton = Template.bind({});

extremelyLongLinkButton.args = {
    color: "blue",
    to: "/",
    children:
        "this is an exxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxtremely long linnnnnnnnnnnnk buttttttttttttttton"
};
