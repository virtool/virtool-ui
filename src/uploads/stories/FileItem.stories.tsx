import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import FileItem from "../components/FileItem";

const meta: Meta<typeof FileItem> = {
    title: "Files/FileItem",
    component: FileItem,
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
        id: "babbdbhd",
        name: "sample_189a.fq.gz",
        size: 94209313,
        uploaded_at: new Date().toISOString(),
        user: {
            id: "23",
            handle: "Bill",
        },
    },

    render: (args) => <FileItem {...args} />,
};

export const Default: Story = Template;

export const NoUser: Story = {
    ...Template,
    args: {
        ...Template.args,
        user: null,
    },
};
