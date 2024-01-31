import { useArgs } from "@storybook/preview-api";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { BoxGroup } from "../BoxGroup";
import { BoxGroupHeader } from "../BoxGroupHeader";
import { BoxGroupSearch } from "../BoxGroupSearch";

const meta: Meta<typeof BoxGroupSearch> = {
    title: "base/BoxGroupSearch",
    component: BoxGroupSearch,
    args: {
        label: "Filter Samples",
        placeholder: "Filter Samples",
    },
    parameters: {
        controls: { expanded: true },
    },
};

export default meta;

type Story = StoryObj<typeof BoxGroupSearch>;

export const Default: Story = {
    render: function Render(args) {
        const [{ value }, updateArgs] = useArgs();

        function setValue(newValue) {
            updateArgs({ value: newValue });
        }

        return (
            <BoxGroup>
                <BoxGroupHeader>Manage Samples</BoxGroupHeader>
                <BoxGroupSearch {...args} value={value} onChange={setValue} />
            </BoxGroup>
        );
    },
};
