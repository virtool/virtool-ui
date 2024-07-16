import { Checkbox } from "@base";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

const meta: Meta<typeof Checkbox> = {
    title: "base/Checkbox",
    component: Checkbox,
    argTypes: {
        checked: { control: "boolean" },
        disabled: { control: "boolean" },
        label: { control: "text" },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

function Template(args) {
    const [checked, setChecked] = useState(false);
    return <Checkbox checked={checked} onClick={() => setChecked(!checked)} {...args} />;
}

export const SampleCheckbox: Story = {
    args: {
        checked: false,
        disabled: false,
        label: "Checkbox",
    },
    render: Template,
};
