import { usePageParam, usePathParams } from "@app/hooks";
import BoxGroup from "@base/BoxGroup";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import Pagination from "@base/Pagination";
import { useFindIndexes } from "../queries";
import { IndexItem } from "./Item/IndexItem";
import RebuildAlert from "./RebuildAlert";
import RebuildIndex from "./RebuildIndex";

/**
 * Displays a list of reference indexes
 */
export default function Indexes() {
    const { refId } = usePathParams<{ refId: string }>();
    const { page } = usePageParam();
    const { data, isPending } = useFindIndexes(page, 25, refId);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const { documents, page: storedPage, page_count } = data;

    return (
        <>
            <RebuildAlert refId={refId} />
            <RebuildIndex refId={refId} />
            {documents.length ? (
                <Pagination
                    items={documents}
                    storedPage={storedPage}
                    currentPage={page}
                    pageCount={page_count}
                >
                    <BoxGroup>
                        {documents.map((document) => (
                            <IndexItem
                                key={document.id}
                                index={document}
                                refId={refId}
                                activeId={
                                    documents.find(
                                        (doc) => doc.ready && doc.has_files,
                                    )?.id
                                }
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
