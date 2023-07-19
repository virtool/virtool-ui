import { reduce } from "lodash-es";
import React from "react";
import { useInfiniteFindUsers } from "../../administration/querys";
import { LoadingPlaceholder, NoneFoundBox } from "../../base";
import { StreamlinedScrollList } from "../../base/ScrollList";
import { User } from "../types";
import { UserItem } from "./Item";

function renderRow(item: User) {
    return <UserItem key={item.id} id={item.id} handle={item.handle} administrator_role={item.administrator_role} />;
}

type UsersListProps = {
    term: string;
};

export function UsersList({ term }: UsersListProps) {
    const { data, isLoading, fetchNextPage, isFetchingNextPage } = useInfiniteFindUsers(25, term);

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    const items = reduce(data.pages, (acc, page) => [...acc, ...page.items], []);

    if (items.length) {
        return (
            <StreamlinedScrollList
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                items={items}
                renderRow={renderRow}
            />
        );
    }

    return <NoneFoundBox noun="users" />;
}
