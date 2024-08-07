import { BoxGroupSearch, BoxGroupSection, Button } from "@base";
import { Popover } from "@base/Popover";
import type { Meta, StoryObj } from "@storybook/react";
import { map } from "lodash";
import React, { useState } from "react";

const meta: Meta<typeof Popover> = {
    title: "base/Popover",
    component: Popover,
};

export default meta;

type Story = StoryObj<typeof meta>;

function Template(args) {
    const [term, setTerm] = useState("");
    const items = Array.from({ length: 5 }, (_, i) => `Item ${i + 1}`);

    return (
        <div className="flex justify-center">
            <Popover
                align={args.align}
                trigger={
                    <a>
                        <Button color="blue">Click Here</Button>
                    </a>
                }
            >
                <BoxGroupSearch placeholder="Filter items" label="Filter items" value={term} onChange={setTerm} />
                <div className="overflow-y-auto flex flex-col">
                    {map(items, item => (
                        <BoxGroupSection>{item}</BoxGroupSection>
                    ))}
                </div>
            </Popover>
        </div>
    );
}

export const SamplePopover: Story = {
    args: { align: "center" },
    render: Template,
};
