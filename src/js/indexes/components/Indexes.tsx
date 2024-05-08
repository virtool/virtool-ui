import { LoadingPlaceholder, NoneFoundBox } from "@base";
import { ScrollList } from "@base/ScrollList";
import { reduce } from "lodash-es";
import { find, get } from "lodash-es/lodash";
import React from "react";
import { match } from "react-router-dom";
import { useInfiniteFindIndexes } from "../queries";
import { IndexMinimal } from "../types";
import { IndexItem } from "./Item/IndexItem";
import RebuildAlert from "./RebuildAlert";
import RebuildIndex from "./RebuildIndex";

function renderRow(refId: string, activeId: string) {
    return (index: IndexMinimal) => <IndexItem index={index} refId={refId} activeId={activeId} />;
}

type IndexesProps = {
    /** Match object containing path information */
    match: match<{ refId: string }>;
};

/**
 * Displays a list of reference indexes
 */
export default function Indexes({ match }: IndexesProps) {
    const { refId } = match.params;
    const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteFindIndexes(refId);

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    const items = reduce(data.pages, (acc, page) => [...acc, ...page.documents], []);

    const noIndexes = items.length ? null : <NoneFoundBox noun="indexes" />;

    return (
        <>
            <RebuildAlert refId={refId} />
            <RebuildIndex refId={refId} />
            {noIndexes}
            <ScrollList
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                items={items}
                renderRow={renderRow(refId, get(find(items, { ready: true, has_files: true }), "id"))}
            />
        </>
    );
}
