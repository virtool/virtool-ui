import { BoxGroup, BoxGroupSectionSelect, Checkbox } from "@base";
import { useArgs } from "@storybook/preview-api";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta<typeof BoxGroupSectionSelect> = {
    title: "base/Box/BoxGroupSectionSelect",
    component: BoxGroupSectionSelect,
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

function Template({ children }) {
    const [{ active }, updateArgs] = useArgs();
    return (
        <BoxGroup>
            <BoxGroupSectionSelect active={active} onClick={() => updateArgs({ active: !active })}>
                {children}
            </BoxGroupSectionSelect>
        </BoxGroup>
    );
}

export const TestBoxGroupSectionSelect: Story = {
    args: {
        children: "This is a SelectBoxGroupSection!",
    },
    render: Template,
};

function CheckboxTemplate() {
    const [{ active }, updateArgs] = useArgs();
    return (
        <BoxGroup>
            <BoxGroupSectionSelect onClick={() => updateArgs({ active: !active })}>
                <Checkbox checked={active} label="This is a SelectBoxGroupSection with a Checkbox!" />
            </BoxGroupSectionSelect>
        </BoxGroup>
    );
}

export const BoxGroupSectionSelectWithCheckbox: Story = {
    render: CheckboxTemplate,
};
