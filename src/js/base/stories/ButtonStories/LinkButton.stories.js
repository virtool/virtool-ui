import React from "react";
import { LinkButton } from "../../Button";

export default {
    title: "base/Button/LinkButton",
    component: LinkButton
};

const Template = args => <LinkButton {...args} />;

export const greenLinkButton = Template.bind({});

greenLinkButton.args = {
    color: "green",
    to: "#",
    children: "Link Button"
};
