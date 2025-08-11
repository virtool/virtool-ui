import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import UploadItem, { UploadItemProps } from "../components/UploadItem";

const meta: Meta<typeof UploadItem> = {
    title: "Files/UploadItem",
    component: UploadItem,
    argTypes: {
        canDelete: {
            control: {
                type: "boolean",
            },
            description: "Whether the user is permitted to delete the file.",
        },
    },
    parameters: {
        docs: {
            description: {
                component: "An item in the file manager.",
            },
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = {
    args: {
        canDelete: true,
        failed: false,
        id: "babbdbhd",
        name: "sample_189a.fq.gz",
        size: 94209313,
        uploaded_at: new Date().toISOString(),
        user: {
            id: "23",
            handle: "Bill",
        },
    },

    render: (args: UploadItemProps) => <UploadItem {...args} />,
};

export const Default: Story = Template;

export const NoUser: Story = {
    ...Template,
    args: {
        ...Template.args,
        user: null,
    },
};
