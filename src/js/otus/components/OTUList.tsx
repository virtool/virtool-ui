import { BoxGroup, ContainerNarrow, LoadingPlaceholder, NoneFoundBox, Pagination } from "@base";
import { useGetReference } from "@references/queries";
import { useSearchParams, useUrlSearchParams } from "@utils/hooks";
import { map } from "lodash";
import React from "react";
import RebuildAlert from "../../indexes/components/RebuildAlert";
import { useListOTUs } from "../queries";
import CreateOTU from "./CreateOTU";
import OTUItem from "./OTUItem";
import OTUToolbar from "./OTUToolbar";

/**
 * A list of OTUs with filtering
 */
export default function OTUList() {
    const { refId } = useSearchParams<{ refId: string }>();
    const [term, setTerm] = useUrlSearchParams("find");
    const [urlPage] = useUrlSearchParams("page");
    const { data: reference, isPending: isPendingReference } = useGetReference(refId);
    const { data: otus, isPending: isPendingOTUs } = useListOTUs(refId, Number(urlPage) || 1, 25, term);

    if (isPendingOTUs || isPendingReference) {
        return <LoadingPlaceholder />;
    }

    const { documents, page, page_count } = otus;

    return (
        <ContainerNarrow>
            <RebuildAlert refId={refId} />
            <OTUToolbar
                term={term}
                onChange={e => setTerm(e.target.value)}
                refId={refId}
                remotesFrom={reference.remotes_from}
            />
            <CreateOTU refId={refId} />

            {documents.length ? (
                <Pagination
                    items={documents}
                    storedPage={page}
                    currentPage={Number(urlPage) || 1}
                    pageCount={page_count}
                >
                    <BoxGroup>
                        {map(documents, document => (
                            <OTUItem key={document.id} {...document} refId={refId} />
                        ))}
                    </BoxGroup>
                </Pagination>
            ) : (
                <NoneFoundBox noun="OTUs" />
            )}
        </ContainerNarrow>
    );
}
