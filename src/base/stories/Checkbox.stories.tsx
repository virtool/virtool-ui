import { useArgs } from "storybook/preview-api";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import Checkbox from "../Checkbox";

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
    const [{ checked }, updateArgs] = useArgs();

    return (
        <Checkbox
            checked={checked}
            id="example-cb1"
            onClick={() => updateArgs({ checked: !checked })}
            {...args}
        />
    );
}

export const SampleCheckbox: Story = {
    args: {
        checked: false,
        disabled: false,
        label: "Checkbox",
    },
    render: Template,
};
