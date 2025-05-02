import BoxGroup from "../BoxGroup";
import BoxGroupHeader from "../BoxGroupHeader";
import BoxGroupSearch from "../BoxGroupSearch";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

const meta: Meta<typeof BoxGroupSearch> = {
    title: "base/BoxGroupSearch",
    component: BoxGroupSearch,
    parameters: {
        docs: {
            description: {
                component:
                    "A search bar component useful for filtering or searching for items.",
            },
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

function Template(args) {
    const [value, setValue] = useState("");
    return (
        <BoxGroup>
            <BoxGroupHeader>Manage Samples</BoxGroupHeader>
            <BoxGroupSearch {...args} value={value} onChange={setValue} />
        </BoxGroup>
    );
}

export const SampleBoxGroupSearch: Story = {
    render: Template,
    args: {
        placeholder: "Filter Samples",
        autoFocus: false,
    },
};
