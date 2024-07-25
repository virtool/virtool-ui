import { BoxGroup, LoadingPlaceholder, NoneFoundBox } from "@base";
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

    return (
        <>
            <RebuildAlert refId={refId} />
            <RebuildIndex refId={refId} />
            {items.length ? (
                <BoxGroup>
                    <ScrollList
                        className="my-0"
                        fetchNextPage={fetchNextPage}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        isLoading={isLoading}
                        items={items}
                        renderRow={renderRow(refId, get(find(items, { ready: true, has_files: true }), "id"))}
                    />
                </BoxGroup>
            ) : (
                <NoneFoundBox noun="indexes" />
            )}
        </>
    );
}
