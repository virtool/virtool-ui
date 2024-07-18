import { BoxGroup, ContainerNarrow, LoadingPlaceholder, NoneFoundBox, Pagination } from "@base";
import { useGetReference } from "@references/queries";
import { useUrlSearchParams } from "@utils/hooks";
import { map } from "lodash";
import React from "react";
import { match } from "react-router-dom";
import RebuildAlert from "../../indexes/components/RebuildAlert";
import { useListOTUs } from "../queries";
import CreateOTU from "./CreateOTU";
import OTUItem from "./OTUItem";
import OTUToolbar from "./OTUToolbar";

type OTUListProps = {
    /** Match object containing path information */
    match: match<{ refId: string }>;
};

/**
 * A list of OTUs with filtering
 */
export default function OTUList({ match }: OTUListProps) {
    const { refId } = match.params;
    const [term, setTerm] = useUrlSearchParams<string>("find");
    const [urlPage] = useUrlSearchParams<number>("page");
    const { data: reference, isLoading: isLoadingReference } = useGetReference(refId);
    const { data: otus, isLoading: isLoadingOTUs } = useListOTUs(refId, Number(urlPage) || 1, 25, term);

    if (isLoadingOTUs || isLoadingReference) {
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
