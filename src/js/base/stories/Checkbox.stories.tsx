import { useArgs } from "@storybook/preview-api";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Checkbox } from "../Checkbox";

const meta: Meta<typeof Checkbox> = {
    title: "base/Checkbox",
    component: Checkbox,
    args: {
        checked: false,
        disabled: false,
        label: "Checkbox",
    },
    argTypes: {
        checked: { control: "boolean" },
        disabled: { control: "boolean" },
        label: { control: "text" },
    },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
    render: function Render(args) {
        const [{ checked }, updateArgs] = useArgs();

        function onClick() {
            updateArgs({ checked: !checked });
        }

        return <Checkbox {...args} checked={checked} onClick={onClick} />;
    },
};
