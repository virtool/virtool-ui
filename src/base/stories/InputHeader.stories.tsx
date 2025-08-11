import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import InputHeader from "../InputHeader";

const meta: Meta<typeof InputHeader> = {
    title: "base/InputHeader",
    component: InputHeader,
};

export default meta;

type Story = StoryObj<typeof meta>;

function Template(args) {
    const [value, setValue] = useState(args.value);
    return (
        <InputHeader
            id="name"
            value={value}
            onSubmit={(value) => setValue(value)}
        />
    );
}

export const inputHeader: Story = {
    args: { value: "Header 1" },
    render: Template,
};
