import React from "react";
import { BoxGroupSection, BoxGroup, BoxGroupHeader } from "../../Box";

export default {
    title: "base/Box/BoxGroupSection",
    component: BoxGroupSection,
    parameters: {
        docs: {
            description: {
                component:
                    "A wrapper for elements contained inside a box or boxgroup. Helps to ensure visual consistency and prevents double borders from occuring."
            }
        }
    }
};

const Template = args => (
    <BoxGroup>
        <BoxGroupHeader>These are BoxGroupSections!</BoxGroupHeader>
        <BoxGroupSection {...args} />
        <BoxGroupSection>Second BoxGroupSection</BoxGroupSection>
        <BoxGroupSection>Third BoxGroupSection</BoxGroupSection>
    </BoxGroup>
);

const clickableTemplate = args => (
    <BoxGroup>
        <BoxGroupHeader>These are clickable BoxGroupSections!</BoxGroupHeader>
        <BoxGroupSection {...args}>First BoxGroupSection</BoxGroupSection>
        <BoxGroupSection {...args}>Second BoxGroupSection</BoxGroupSection>
        <BoxGroupSection {...args}>Third BoxGroupSection</BoxGroupSection>
    </BoxGroup>
);

export const testBoxGroupSection = Template.bind({});

testBoxGroupSection.args = {
    children: "First BoxGroupSection"
};

export const clickableBoxGroupSection = clickableTemplate.bind({});

clickableBoxGroupSection.args = {
    onClick: () => console.log("Click Here!")
};
