import AccountGroups from "@account/components/AccountGroups";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { createFakeGroup } from "@tests/fake/groups";

const meta: Meta<typeof AccountGroups> = {
    title: "account/AccountGroups",
    component: AccountGroups,
    tags: ["autodocs"],
};

export default meta;

const groups = [
    {
        ...createFakeGroup(),
        name: "Space Filled Name That Wraps",
    },
    createFakeGroup(),
    createFakeGroup(),
    createFakeGroup(),
    createFakeGroup(),
    createFakeGroup(),
    createFakeGroup(),
    createFakeGroup(),
    createFakeGroup(),
    createFakeGroup(),
    createFakeGroup(),
];

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        groups,
    },
};
