import React from "react";
import { BoxGroup, BoxGroupHeader } from "../../Box";

export default {
    title: "base/Box/BoxGroupHeader",
    component: BoxGroupHeader,
    subcomponents: BoxGroup
};

const Template = args => (
    <BoxGroup>
        <BoxGroupHeader {...args}>
            <h2>This is a BoxGroupHeader!</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
            </p>
        </BoxGroupHeader>
    </BoxGroup>
);

export const testBoxGroupHeader = Template.bind({});
