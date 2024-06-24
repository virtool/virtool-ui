import { BoxGroup, BoxGroupHeader, BoxGroupSearch } from "@base";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

const meta: Meta<typeof BoxGroupSearch> = {
    title: "base/BoxGroupSearch",
    component: BoxGroupSearch,
    parameters: {
        docs: {
            description: {
                component: "A search bar component useful for filtering or searching for items.",
            },
        },
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

function BoxGroupSearchTemplate(args) {
    const [value, setValue] = useState("");
    return (
        <BoxGroup>
            <BoxGroupHeader>Manage Samples</BoxGroupHeader>
            <BoxGroupSearch {...args} value={value} onChange={setValue} />
        </BoxGroup>
    );
}

export const SampleBoxGroupSearch: Story = {
    render: BoxGroupSearchTemplate,
    args: {
        placeholder: "Filter Samples",
        autoFocus: false,
    },
};
