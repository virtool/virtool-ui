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
    const [urlPage] = useUrlSearchParams<number>("page");
    const { data, isLoading } = useFindIndexes(Number(urlPage) || 1, 25, refId);

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    const { documents, page, page_count } = data;

    return (
        <>
            <RebuildAlert refId={refId} />
            <RebuildIndex refId={refId} />
            {documents.length ? (
                <Pagination
                    items={documents}
                    storedPage={page}
                    currentPage={Number(urlPage) || 1}
                    pageCount={page_count}
                >
                    <BoxGroup>
                        {map(documents, document => (
                            <IndexItem
                                index={document}
                                refId={refId}
                                activeId={get(find(documents, { ready: true, has_files: true }), "id")}
                            />
                        ))}
                    </BoxGroup>
                </Pagination>
            ) : (
                <NoneFoundBox noun="indexes" />
            )}
        </>
    );
}
