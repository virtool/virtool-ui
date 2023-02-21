import React from "react";
import { Checkbox } from "../../Checkbox";
import { useArgs } from "@storybook/client-api";
import { BoxGroup } from "../../BoxGroup";
import { SelectBoxGroupSection } from "../../BoxGroupSectionSelect";

export default {
    title: "base/Box/SelectBoxGroupSection",
    component: SelectBoxGroupSection,
    args: {
        active: false
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Similar to a BoxGroupSection but contains additional styling for handling select functionality. Usually accompanied by a checkbox."
            }
        }
    }
};

const Template = args => {
    const [{ active }, updateArgs] = useArgs(false);
    return (
        <BoxGroup>
            <SelectBoxGroupSection {...args} checked={active} onClick={() => updateArgs({ active: !active })} />
        </BoxGroup>
    );
};

export const testSelectBoxGroupSection = Template.bind({});

testSelectBoxGroupSection.args = {
    children: "This is a SelectBoxGroupSection!"
};

const Template2 = args => {
    const [{ active }, updateArgs] = useArgs(false);
    return (
        <BoxGroup>
            <SelectBoxGroupSection {...args} onClick={() => updateArgs({ active: !active })}>
                <Checkbox checked={active} label="This is a SelectBoxGroupSection with a Checkbox!" />
            </SelectBoxGroupSection>
        </BoxGroup>
    );
};

export const selectBoxGroupSectionWithCheckbox = Template2.bind({});
