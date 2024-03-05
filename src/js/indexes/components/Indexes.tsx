import { reduce } from "lodash-es";
import { find, get } from "lodash-es/lodash";
import React from "react";
import { connect } from "react-redux";
import { LoadingPlaceholder, NoneFoundBox } from "../../base";
import { ScrollList } from "../../base/ScrollList";
import { useInfiniteFindIndexes } from "../queries";
import { IndexMinimal } from "../types";
import { IndexItem } from "./Item/IndexItem";
import RebuildIndex from "./Rebuild";
import RebuildAlert from "./RebuildAlert";

function renderRow(refId: string, activeId: string) {
    return (index: IndexMinimal) => <IndexItem index={index} refId={refId} activeId={activeId} />;
}

/**
 * A list of reference indexes.
 *
 * @param refId - The unique identifier of the parent reference
 * @returns A list of indexes
 */
export function Indexes({ refId }: { refId: string }) {
    const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteFindIndexes(refId);
    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    const items = reduce(data.pages, (acc, page) => [...acc, ...page.documents], []);

    const noIndexes = items.length ? null : <NoneFoundBox noun="indexes" />;

    return (
        <>
            <RebuildAlert />
            <RebuildIndex />
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

function mapStateToProps(state) {
    return {
        refId: state.references.detail.id,
    };
}

export default connect(mapStateToProps)(Indexes);
