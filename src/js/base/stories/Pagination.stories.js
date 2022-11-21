import React, { useState } from "react";
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
    }
};

const Template = args => {
    const [currentPage, setCurrentPage] = useState(1);
    return <Pagination onLoadNextPage={page => setCurrentPage(page)} currentPage={currentPage} {...args} />;
};

export const testPagination = Template.bind({});

testPagination.args = {
    pageCount: 10,
    currentPage: 1
};
