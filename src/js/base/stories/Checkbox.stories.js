import React from "react";
import { Checkbox } from "../Checkbox";
import { useArgs } from "@storybook/client-api";

export default {
    title: "base/Checkbox",
    component: Checkbox,
    argTypes: {
        checked: { control: "boolean" },
        disabled: { control: "boolean" },
        label: { control: "text" }
    }
};

const Template = args => {
    const [{ checked }, updateArgs] = useArgs(false);
    return <Checkbox checked={checked} onClick={() => updateArgs({ checked: !checked })} {...args} />;
};

export const SampleCheckbox = Template.bind({});

SampleCheckbox.args = {
    checked: false,
    disabled: false,
    label: "Checkbox"
};
