import BoxGroup from "@base/BoxGroup";
import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import Pagination from "@base/Pagination";
import { map } from "lodash";
import React from "react";
import {
    usePageParam,
    usePathParams,
    useUrlSearchParam,
} from "../../app/hooks";
import RebuildAlert from "../../indexes/components/RebuildAlert";
import { useGetReference } from "../../references/queries";
import { useListOTUs } from "../queries";
import CreateOTU from "./CreateOTU";
import OTUItem from "./OTUItem";
import OTUToolbar from "./OTUToolbar";

/**
 * A list of OTUs with filtering
 */
export default function OTUList() {
    const { refId } = usePathParams<{ refId: string }>();
    const { value: term, setValue: setTerm } =
        useUrlSearchParam<string>("find");
    const { page } = usePageParam();
    const { data: reference, isPending: isPendingReference } =
        useGetReference(refId);
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
            <OTUToolbar
                term={term}
                onChange={(e) => setTerm(e.target.value)}
                refId={refId}
                remotesFrom={reference.remotes_from}
            />
            <CreateOTU refId={refId} />

            {documents.length ? (
                <Pagination
                    items={documents}
                    storedPage={storedPage}
                    currentPage={page}
                    pageCount={page_count}
                >
                    <BoxGroup>
                        {map(documents, (document) => (
                            <OTUItem
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
