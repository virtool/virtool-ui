import type { Meta, StoryObj } from "@storybook/react-vite";
import NoneFoundBox from "../NoneFoundBox";

const meta: Meta<typeof NoneFoundBox> = {
    title: "base/NoneFound/NoneFoundBox",
    component: NoneFoundBox,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const noneFoundBox: Story = {
    args: {
        noun: "items",
    },
};
