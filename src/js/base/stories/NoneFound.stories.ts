import NoneFound from '@base/NoneFound';
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof NoneFound> = {
    title: "base/NoneFound/NoneFound",
    component: NoneFound,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ExampleNoneFound: Story = {
    args: {
        noun: "{plural nouns}",
    },
};

export const SampleNoneFound: Story = {
    args: {
        noun: "samples",
    },
};
