import React from "react";
import { SelectBoxGroupSection, BoxGroup } from "../../Box";
import { Checkbox } from "../../Checkbox";
import { useArgs } from "@storybook/client-api";

export default {
    title: "base/Box/SelectBoxGroupSection",
    component: SelectBoxGroupSection,
    subcomponents: Checkbox,
    args: {
        active: false
    },
    parameters: {
        docs: {
            description: {
                component:
                    "A wrapper element for elements contained inside a box or boxgroup. Usually accompanied by a checkbox."
            }
        }
    }
};

const Template = args => (
    <BoxGroup>
        <SelectBoxGroupSection {...args} />
    </BoxGroup>
);

export const testSelectBoxGroupSection = Template.bind({});

testSelectBoxGroupSection.args = {
    children: "This is a SelectBoxGroupSection!",
    onClick: () => console.log("clicked")
};

const Template2 = args => {
    const [{ active }, updateArgs] = useArgs(false);
    return (
        <BoxGroup>
            <SelectBoxGroupSection {...args} onClick={() => updateArgs({ active: !active })}>
                <Checkbox checked={active} label="this is a SelectBoxGroupSection with a Checkbox!" />
            </SelectBoxGroupSection>
        </BoxGroup>
    );
};

export const selectBoxGroupSectionWithCheckbox = Template2.bind({});
