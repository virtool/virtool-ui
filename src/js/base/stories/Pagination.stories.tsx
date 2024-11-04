import { Box, Pagination } from "@base";
import { faker } from "@faker-js/faker";
import { useArgs } from "@storybook/preview-api";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserItem } from "@users/components/UserItem";
import { map } from "lodash-es";
import React, { useMemo } from "react";

const queryClient = new QueryClient();

const meta: Meta<typeof Pagination> = {
    title: "base/Pagination",
    component: Pagination,
    decorators: [Story => <QueryClientProvider client={queryClient}>{Story()}</QueryClientProvider>],
    parameters: {
        docs: {
            description: {
                component:
                    "A pagination component useful for dividing large amounts of content into smaller sections across multiple pages.",
            },
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

function Template(args) {
    const [, updateArgs] = useArgs();
    const items = useMemo(() => fakeUserListFactory(args.storedPage, 7), [args.storedPage]);
    function onLoadNextPage(page) {
        updateArgs({ currentPage: page, storedPage: page });
    }

    return (
        <Box>
            <Pagination onLoadNextPage={onLoadNextPage} renderRow={UserItem} items={items} {...args} />
        </Box>
    );
}

export const SamplePagination: Story = {
    args: {
        pageCount: 10,
        currentPage: 1,
        storedPage: 1,
    },
    render: Template,
};

function fakeUserListFactory(seed: number, numItems: number) {
    faker.seed(seed);
    const userList = Array(numItems);
    return map(userList, () => fakeUserFactory());
}

function fakeUserFactory() {
    return {
        id: faker.random.alphaNumeric(6),
        handle: `${faker.name.firstName()}${faker.name.lastName()}`,
    };
}
