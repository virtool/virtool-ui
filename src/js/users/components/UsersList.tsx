import { useInfiniteFindUsers } from "@administration/queries";
import { BoxGroup, LoadingPlaceholder, NoneFoundBox } from "@base";
import { ScrollList } from "@base/ScrollList";
import { useUrlSearchParams } from "@utils/hooks";
import { flatMap } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { User } from "../types";
import { UserItem } from "./UserItem";

function renderRow(item: User) {
    return (
        <UserItem
            key={item.id}
            active={item.active}
            administratorRole={item.administrator_role}
            handle={item.handle}
            id={item.id}
            primary_group={item.primary_group}
        />
    );
}

const StyledScrollList = styled(ScrollList)`
    margin-bottom: 0;
`;

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
    const [active] = useUrlSearchParams("active");
    const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteFindUsers(
        25,
        term,
        false,
        Boolean(active),
    );

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    const items = flatMap(data.pages, page => page.items);

    return items.length ? (
        <BoxGroup>
            <StyledScrollList
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                items={items}
                renderRow={renderRow}
            />
        </BoxGroup>
    ) : (
        <NoneFoundBox noun="users" />
    );
}
