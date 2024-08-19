import { BoxGroup, LoadingPlaceholder, NoneFoundBox, Pagination } from "@base";
import { useUrlSearchParams } from "@utils/hooks";
import { map } from "lodash";
import { find, get } from "lodash-es/lodash";
import React from "react";
import { match } from "react-router-dom";
import { useFindIndexes } from "../queries";
import { IndexItem } from "./Item/IndexItem";
import RebuildAlert from "./RebuildAlert";
import RebuildIndex from "./RebuildIndex";

type IndexesProps = {
    /** Match object containing path information */
    match: match<{ refId: string }>;
};

/**
 * Displays a list of reference indexes
 */
export default function Indexes({ match }: IndexesProps) {
    const { refId } = match.params;
    const { data, isPending, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteFindIndexes(refId);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const { documents, page, page_count } = data;

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
                        isPending={isPending}
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
