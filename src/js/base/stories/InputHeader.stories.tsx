import { useArgs } from "@storybook/preview-api";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { InputHeader } from "../InputHeader";

const meta: Meta<typeof InputHeader> = {
    title: "base/InputHeader",
    component: InputHeader,
    parameters: {},
    args: {
        value: "Header 1",
    },
    argTypes: {},
};

export default meta;

type Story = StoryObj<typeof InputHeader>;

export const Default: Story = {
    render: function Render(args) {
        const [{ value }, updateArgs] = useArgs();

        function onSubmit(newValue) {
            updateArgs({ value: newValue });
        }

        return <InputHeader {...args} id="name" value={value} onSubmit={onSubmit} />;
    },
};
