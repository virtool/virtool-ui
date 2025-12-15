import { usePageParam, usePathParams, useUrlSearchParam } from "@app/hooks";
import BoxGroup from "@base/BoxGroup";
import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import Pagination from "@base/Pagination";
import RebuildAlert from "@indexes/components/RebuildAlert";
import { useListOTUs } from "@otus/queries";
import { useFetchReference } from "@references/queries";
import { map } from "lodash-es";
import OtuCreate from "./OtuCreate";
import OtuItem from "./OtuItem";
import OtuToolbar from "./OtuToolbar";

/**
 * A list of OTUs with filtering
 */
export default function OtuList() {
    const { refId } = usePathParams<{ refId: string }>();
    const { value: term, setValue: setTerm } =
        useUrlSearchParam<string>("find");
    const { page } = usePageParam();
    const { data: reference, isPending: isPendingReference } =
        useFetchReference(refId);
    const { data: otus, isPending: isPendingOTUs } = useListOTUs(
        refId,
        page,
        25,
        term,
    );

    if (isPendingOTUs || isPendingReference) {
        return <LoadingPlaceholder />;
    }

    const { documents, page: storedPage, page_count } = otus;

    return (
        <ContainerNarrow>
            <RebuildAlert refId={refId} />
            <OtuToolbar
                term={term}
                onChange={(e) => setTerm(e.target.value)}
                refId={refId}
                remotesFrom={reference.remotes_from}
            />
            <OtuCreate refId={refId} />

            {documents.length ? (
                <Pagination
                    items={documents}
                    storedPage={storedPage}
                    currentPage={page}
                    pageCount={page_count}
                >
                    <BoxGroup>
                        {map(documents, (document) => (
                            <OtuItem
                                key={document.id}
                                {...document}
                                refId={refId}
                            />
                        ))}
                    </BoxGroup>
                </Pagination>
            ) : (
                <NoneFoundBox noun="OTUs" />
            )}
        </ContainerNarrow>
    );
}
