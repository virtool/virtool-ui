import React, { useMemo } from "react";
import { Pagination } from "../Pagination";
import { useArgs } from "@storybook/client-api";
import { faker } from "@faker-js/faker";
import { map } from "lodash-es";
import { UserItem } from "../../users/components/Item";
import { Box } from "../";

export default {
    title: "base/Pagination",
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
    const [_, updateArgs] = useArgs();
    const items = useMemo(() => fakeUserListFactory(args.storedPage, 7), [args.storedPage]);
    const onLoadNextPage = page => {
        updateArgs({ currentPage: page, storedPage: page });
    };

    return (
        <Box>
            <Pagination onLoadNextPage={onLoadNextPage} renderRow={UserItem} items={items} {...args} />
        </Box>
    );
};

export const ExamplePagination = Template.bind({});

ExamplePagination.args = {
    pageCount: 10,
    currentPage: 1,
    storedPage: 1
};

const fakeUserListFactory = (seed, numItems) => {
    faker.seed(seed);
    let userList = Array(numItems);
    return map(userList, () => fakeUserFactory());
};

const fakeUserFactory = () => ({
    id: faker.random.alphaNumeric(6),
    handle: `${faker.name.firstName()}${faker.name.lastName()}`,
    administrator: false
});
