import { UploaderItem } from "@files/components/UploaderItem";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta<typeof UploaderItem> = {
    title: "Files/UploaderItem",
    component: UploaderItem,
    argTypes: {
        failed: {
            control: {
                type: "boolean",
            },
            description: "Whether the upload failed",
        },
        progress: {
            control: {
                type: "range",
                min: 0,
                max: 100,
            },
            description: "Progress of the upload in percentage",
        },
    },
    parameters: {
        docs: {
            description: {
                component: "An item in the uploader dialog.",
            },
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = {
    args: {
        failed: false,
        localId: "babbdbhd",
        name: "ab78911.fq.gz",
        progress: 50,
        size: 94209313,
    },

    render: args => (
        <div className="bg-white w-1/2">
            <UploaderItem {...args} />
        </div>
    ),
};

export const Default: Story = Template;

export const Failed = {
    ...Template,

    args: {
        ...Template.args,
        failed: true,
    },
};

export const Finishing: Story = {
    ...Template,

    args: {
        ...Template.args,
        progress: 100,
    },
};
