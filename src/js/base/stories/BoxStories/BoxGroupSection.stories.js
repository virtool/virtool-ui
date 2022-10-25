import React from "react";
import { BoxGroupSection } from "../../Box";

export default {
    title: "base/Box/BoxGroupSection",
    component: BoxGroupSection,
    parameters: {
        docs: {
            description: {
                component: "A wrapper element for elements contained inside a box or boxgroup."
            }
        }
    }
};

const Template = args => (
    <BoxGroupSection {...args}>
        <label>This is a {args.onClick ? "clickable" : ""} BoxGroupSection!</label>
        <div>First Element</div>
        <div>Second Element</div>
        <div>Third Element</div>
    </BoxGroupSection>
);

export const testBoxGroupSection = Template.bind({});

export const clickableBoxGroupSection = Template.bind({});

clickableBoxGroupSection.args = {
    onClick: () => console.log("Click Here!")
};
