import { BoxGroupSection } from "@base";
import { ScrollArea } from "@base/ScrollArea";
import type { Meta, StoryObj } from "@storybook/react";
import { map } from "lodash";
import React from "react";

const meta: Meta<typeof ScrollArea> = {
    title: "base/ScrollArea",
    component: ScrollArea,
};

export default meta;

type Story = StoryObj<typeof meta>;

function Template(args) {
    const items = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);

    return (
        <ScrollArea className={args.className}>
            {map(items, (item, index) => (
                <BoxGroupSection key={index}>{item}</BoxGroupSection>
            ))}
        </ScrollArea>
    );
}

export const scrollArea: Story = {
    render: Template,
    args: {
        className: "h-52",
    },
};
