import { flatMap } from "lodash-es";
import React from "react";
import { match } from "react-router-dom";
import styled from "styled-components";
import {
    BoxGroup,
    ContainerNarrow,
    LoadingPlaceholder,
    NoneFoundBox,
} from "../../base";
import { ScrollList } from "../../base/ScrollList";
import RebuildAlert from "../../indexes/components/RebuildAlert";
import { useGetReference } from "../../references/hooks";
import { useUrlSearchParams } from "../../utils/hooks";
import { useInfiniteFindOTUS } from "../querys";
import { OTUMinimal } from "../types";
import CreateOTU from "./Create";
import OTUItem from "./OTUItem";
import OTUToolbar from "./OTUToolbar";

const StyledScrollList = styled(ScrollList)`
    margin-bottom: 0;
`;

type OTUListProps = {
    /** Match object containing path information */
    match: match<{ refId: string }>;
};

/**
 * A list of OTUs with filtering
 */
export default function OTUList({ match }: OTUListProps) {
    const { refId } = match.params;
    const { data: reference, isLoading: isLoadingReference } =
        useGetReference(refId);
    const [term, setTerm] = useUrlSearchParams("find");
    const {
        data: otu,
        isLoading: isLoadingOTUs,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteFindOTUS(refId, term);

    if (isLoadingOTUs || isLoadingReference) {
        return <LoadingPlaceholder />;
    }

    function renderRow(document: OTUMinimal) {
        return <OTUItem {...document} refId={refId} />;
    }

    const items = flatMap(otu.pages, page => page.documents);

    return (
        <ContainerNarrow>
            <RebuildAlert />
            <OTUToolbar
                term={term}
                onChange={e => setTerm(e.target.value)}
                remotesFrom={reference.remotes_from}
            />
            <CreateOTU />

            {items.length ? (
                <BoxGroup>
                    <StyledScrollList
                        fetchNextPage={fetchNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        isLoading={isLoadingOTUs}
                        items={items}
                        renderRow={renderRow}
                    />
                </BoxGroup>
            ) : (
                <NoneFoundBox noun="OTUs" />
            )}
        </ContainerNarrow>
    );
}
