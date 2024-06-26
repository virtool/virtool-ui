import { AttributionWithName } from "@base";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof AttributionWithName> = {
    title: "base/Attribution/NameAttribution",
    component: AttributionWithName,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const NameAttribution: Story = {
    args: {
        user: "James Smith",
    },
};
