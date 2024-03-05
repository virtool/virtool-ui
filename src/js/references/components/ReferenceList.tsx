import { flatMap } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { Badge, BoxGroup, ContainerNarrow, LoadingPlaceholder, ViewHeader, ViewHeaderTitle } from "../../base";
import { ScrollList } from "../../base/ScrollList";
import { useUrlSearchParams } from "../../utils/hooks";
import { useInfiniteFindReferences } from "../queries";
import { ReferenceMinimal, ReferenceSearchResult } from "../types";
import Clone from "./CloneReference";
import { ReferenceItem } from "./Item/ReferenceItem";
import ReferenceOfficial from "./Official";
import ReferenceToolbar from "./ReferenceToolbar";

function renderRow(reference: ReferenceMinimal) {
    return <ReferenceItem key={reference.id} reference={reference} />;
}

const StyledScrollList = styled(ScrollList)`
    margin-bottom: 0;
`;

/**
 * A list of references with filtering options
 */
export default function ReferenceList() {
    const [term] = useUrlSearchParams("find");

    const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteFindReferences(term);

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    const { total_count, official_installed } = data.pages[0];
    const references: ReferenceMinimal[] = flatMap(data.pages, (page: ReferenceSearchResult) => page.documents);

    return (
        <>
            <ContainerNarrow>
                <ViewHeader title="References">
                    <ViewHeaderTitle>
                        References <Badge>{total_count}</Badge>
                    </ViewHeaderTitle>
                </ViewHeader>
                <ReferenceToolbar />
                <ReferenceOfficial officialInstalled={official_installed} />
                {total_count !== 0 && (
                    <BoxGroup>
                        <StyledScrollList
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            isLoading={isLoading}
                            items={references}
                            renderRow={renderRow}
                        />
                    </BoxGroup>
                )}
            </ContainerNarrow>
            <Clone references={references} />
        </>
    );
}
