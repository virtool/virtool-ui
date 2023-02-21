import React from "react";
import { BoxGroup } from "../../BoxGroup";
import { BoxGroupHeader } from "../../BoxGroupHeader";

export default {
    title: "base/Box/BoxGroupHeader",
    component: BoxGroupHeader,
    parameters: {
        controls: {
            hideNoControlsWarning: true
        }
    },
    argTypes: {
        children: {
            type: "string",
            defaultValue: "This is a BoxGroupHeader!"
        }
    }
};

const Template = args => (
    <BoxGroup>
        <BoxGroupHeader>
            <h2 {...args} />
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
            </p>
        </BoxGroupHeader>
    </BoxGroup>
);

export const testBoxGroupHeader = Template.bind({});

testBoxGroupHeader.args = {};
