import UploaderDialog from "@files/components/UploaderDialog";
import { FileType } from "@files/types";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta<typeof UploaderDialog> = {
    title: "Files/UploaderDialog",
    parameters: {
        docs: {
            description: {
                component: "A dialog that displays the progress of file uploads.",
            },
            story: {
                iframeHeight: 500,
            },
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = {
    args: {
        remaining: 302,
        speed: 123456,
        uploads: [
            {
                failed: false,
                fileType: FileType.reads,
                localId: "file001",
                name: "sample_ab.fastq",
                progress: 75,
                size: 2500000,
                loaded: 231313,
            },

            {
                failed: true,
                fileType: FileType.reads,
                localId: "file001",
                name: "test_1.fastq",
                progress: 52,
                size: 2873192873,
                loaded: 231313,
            },
            {
                failed: false,
                fileType: FileType.reads,
                localId: "file002",
                name: "reads_1.fq.gz",
                progress: 100,
                size: 4000000,
                loaded: 4000000,
            },
        ],
    },
    render: ({ remaining, speed, uploads }) => {
        return (
            <div className="w-96">
                <UploaderDialog remaining={remaining} speed={speed} uploads={uploads} />
            </div>
        );
    },
};

export const Default: Story = Template;
