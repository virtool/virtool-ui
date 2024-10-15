import { BoxGroup, LoadingPlaceholder, NoneFoundBox, Pagination } from "@base";
import { IndexItem } from "@indexes/components/Item/IndexItem";
import { useSearchParams, useUrlSearchParams } from "@utils/hooks";
import { map } from "lodash";
import { find, get } from "lodash-es/lodash";
import React from "react";
import { useFindIndexes } from "../queries";
import RebuildAlert from "./RebuildAlert";
import RebuildIndex from "./RebuildIndex";

/**
 * Displays a list of reference indexes
 */
export default function Indexes() {
    const { refId } = useSearchParams<{ refId: string }>();
    const [urlPage] = useUrlSearchParams("page");
    const { data, isPending } = useFindIndexes(Number(urlPage) || 1, 25, refId);

    if (isPending) {
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
