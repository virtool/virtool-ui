import type { Meta, StoryObj } from "@storybook/react";
import AttributionWithName from "../AttributionWithName";

const meta: Meta<typeof AttributionWithName> = {
    title: "base/Attribution/NameAttribution",
    component: AttributionWithName,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const NameAttribution: Story = {
    args: {
        user: "James Smith",
    },
};
