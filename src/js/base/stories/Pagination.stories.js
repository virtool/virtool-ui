import React from "react";
import { Pagination } from "../Pagination";
import { useArgs } from "@storybook/client-api";

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
    }
};

const Template = args => {
    const [{ currentPage }, updateArgs] = useArgs(1);
    return <Pagination onPageChange={page => updateArgs({ currentPage: page })} currentPage={currentPage} {...args} />;
};

export const testPagination = Template.bind({});

testPagination.args = {
    pageCount: 10,
    currentPage: 1
};
