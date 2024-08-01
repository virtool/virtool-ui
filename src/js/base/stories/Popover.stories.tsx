import { BoxGroupSearch, BoxGroupSection, Icon, SidebarHeaderButton } from "@base";
import { Popover } from "@base/Popover";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

const meta: Meta<typeof Popover> = {
    title: "base/Popover",
    component: Popover,
};

export default meta;

type Story = StoryObj<typeof meta>;

function Template(args) {
    const [term, setTerm] = useState("");

    return (
        <div className="flex justify-center">
            <Popover
                align={args.align}
                trigger={
                    <SidebarHeaderButton type="button">
                        <Icon name="pen" />
                    </SidebarHeaderButton>
                }
            >
                <BoxGroupSearch placeholder="Filter items" label="Filter items" value={term} onChange={setTerm} />
                <div className="overflow-y-auto flex flex-col">
                    <BoxGroupSection>Item 1</BoxGroupSection>
                    <BoxGroupSection>Item 2</BoxGroupSection>
                    <BoxGroupSection>Item 3</BoxGroupSection>
                    <BoxGroupSection>Item 4</BoxGroupSection>
                    <BoxGroupSection>Item 5</BoxGroupSection>
                </div>
            </Popover>
        </div>
    );
}

export const SamplePopover: Story = {
    args: { align: "center" },
    render: Template,
};
