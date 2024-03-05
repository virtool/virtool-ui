import { flatMap } from "lodash-es";
import React from "react";
import { useInfiniteFindUsers } from "../../administration/queries";
import { LoadingPlaceholder, NoneFoundBox } from "../../base";
import { ScrollList } from "../../base/ScrollList";
import { User } from "../types";
import { UserItem } from "./UserItem";

function renderRow(item: User) {
    return <UserItem key={item.id} id={item.id} handle={item.handle} administratorRole={item.administrator_role} />;
}

type UsersListProps = {
    term: string;
};

/**
 * An infinitely scrolling list of users
 *
 * @param term - the search term used for filtering users
 * @returns An infinitely scrolling list of users
 */

export function UsersList({ term }: UsersListProps) {
    const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteFindUsers(25, term);

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    const items = flatMap(data.pages, page => page.items);

    if (items.length) {
        return (
            <ScrollList
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                items={items}
                renderRow={renderRow}
            />
        );
    }

    return <NoneFoundBox noun="users" />;
}
