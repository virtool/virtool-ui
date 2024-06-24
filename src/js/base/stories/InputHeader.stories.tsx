import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { InputHeader } from "../InputHeader";

const meta: Meta<typeof InputHeader> = {
    title: "base/InputHeader",
    component: InputHeader,
    parameters: {},
    tags: ["autodocs"],
    argTypes: {},
};

export default meta;

type Story = StoryObj<typeof meta>;

function Template(args) {
    const [value, setValue] = useState("Header 1");
    return <InputHeader id="name" value={value} onSubmit={value => setValue(value)} />;
}

export const inputHeader: Story = {
    args: {},
    render: Template,
};
