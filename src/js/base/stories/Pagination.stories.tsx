import { Pagination } from "@base";
import { faker } from "@faker-js/faker";
import { useArgs } from "@storybook/preview-api";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserItem } from "@users/components/UserItem";
import { map } from "lodash-es";
import React, { useMemo } from "react";
import { Box } from "../";

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
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

function Template(args) {
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
}

export const SamplePagination: Story = {
    args: {
        pageCount: 10,
        currentPage: 1,
        storedPage: 1,
    },
    render: Template,
};

function fakeUserListFactory(seed, numItems) {
    faker.seed(seed);
    let userList = Array(numItems);
    return map(userList, () => fakeUserFactory());
}

const fakeUserFactory = () => ({
    id: faker.random.alphaNumeric(6),
    handle: `${faker.name.firstName()}${faker.name.lastName()}`,
});
