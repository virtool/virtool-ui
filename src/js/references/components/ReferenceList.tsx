import { flatMap } from "lodash-es";
import React from "react";
import { Badge, ContainerNarrow, LoadingPlaceholder, ViewHeader, ViewHeaderTitle } from "../../base";
import { ScrollList } from "../../base/ScrollList";
import { useUrlSearchParams } from "../../utils/hooks";
import { useInfiniteFindReferences } from "../querys";
import { ReferenceMinimal, ReferenceSearchResult } from "../types";
import Clone from "./Clone";
import ReferenceItem from "./Item/ReferenceItem";
import ReferenceOfficial from "./Official";
import ReferenceToolbar from "./Toolbar";

const renderRow = (reference: ReferenceMinimal) => <ReferenceItem key={reference.id} reference={reference} />;

export default function ReferenceList() {
    const [term] = useUrlSearchParams("term");

    const { data, isLoading, fetchNextPage, isFetchingNextPage } = useInfiniteFindReferences(term);

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
                <ScrollList
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    isLoading={isLoading}
                    items={references}
                    renderRow={renderRow}
                />
            </ContainerNarrow>
            <Clone />
        </>
    );
}
