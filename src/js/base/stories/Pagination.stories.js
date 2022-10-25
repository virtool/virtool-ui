import React from "react";
import { Pagination } from "../Pagination";

export default {
    title: "base/pagination",
    component: Pagination,
    parameters: {
        docs: {
            description: {
                component:
                    "A pagination component useful for dividing large amounts of content into smaller sections across multiple pages."
            }
        }
    },
    argTypes: {
        color: {
            options: ["blue", "grey", "orange", "green"],
            control: { type: "radio" },
            defaultValue: "blue"
        }
    }
};

const Template = args => <Pagination {...args} />;

export const testPagination = Template.bind({});

testPagination.args = {
    itemsPerPage: 5,
    totalItems: 100,
    color: "blue"
};
