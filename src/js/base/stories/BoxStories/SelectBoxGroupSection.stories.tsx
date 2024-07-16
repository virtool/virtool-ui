import { BoxGroup, Checkbox, SelectBoxGroupSection } from "@base";
import { useArgs } from "@storybook/preview-api";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta<typeof SelectBoxGroupSection> = {
    title: "base/Box/SelectBoxGroupSection",
    component: SelectBoxGroupSection,
    args: {
        active: false,
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Similar to a BoxGroupSection but contains additional styling for handling select functionality. Usually accompanied by a checkbox.",
            },
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

function Template(args) {
    const [{ active }, updateArgs] = useArgs();
    return (
        <BoxGroup>
            <SelectBoxGroupSection {...args} checked={active} onClick={() => updateArgs({ active: !active })} />
        </BoxGroup>
    );
}

export const TestSelectBoxGroupSection: Story = {
    args: {
        children: "This is a SelectBoxGroupSection!",
    },
    render: Template,
};

function CheckboxTemplate(args) {
    const [{ active }, updateArgs] = useArgs();
    return (
        <BoxGroup>
            <SelectBoxGroupSection {...args} onClick={() => updateArgs({ active: !active })}>
                <Checkbox checked={active} label="This is a SelectBoxGroupSection with a Checkbox!" />
            </SelectBoxGroupSection>
        </BoxGroup>
    );
}

export const SelectBoxGroupSectionWithCheckbox: Story = {
    render: CheckboxTemplate,
};
