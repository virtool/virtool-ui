import { Attribution } from "@base";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Attribution> = {
    title: "base/Attribution/Attribution",
    component: Attribution,
    tags: ["autodocs"],
    args: {
        time: "2021-12-17T03:24:00",
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const SampleAttribution: Story = {
    args: {
        user: "James Smith",
    },
};
// export const attributionWithUsername = Template.bind({});
//
// attributionWithUsername.args = {
//     user: "James Smith",
// };
//
// export const attributionWithNoUsername = Template.bind({});
