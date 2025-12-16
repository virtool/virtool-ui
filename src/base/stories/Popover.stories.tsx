import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import BoxGroupSearch from "../BoxGroupSearch";
import BoxGroupSection from "../BoxGroupSection";
import Button from "../Button";
import Popover from "../Popover";

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
                trigger={<Button color="blue">Click Here</Button>}
            >
                <BoxGroupSearch
                    placeholder="Filter items"
                    label="Filter items"
                    value={term}
                    onChange={setTerm}
                />
                <div className="overflow-y-auto flex flex-col">
                    {items.map((item) => (
                        <BoxGroupSection key={item}>{item}</BoxGroupSection>
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
