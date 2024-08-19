import { ViewHeaderTitleBadge } from "@base/ViewHeaderTitleBadge";
import { CreateReference } from "@references/components/CreateReference";
import { useUrlSearchParams } from "@utils/hooks";
import { map } from "lodash";
import React from "react";
import { BoxGroup, ContainerNarrow, LoadingPlaceholder, Pagination, ViewHeader, ViewHeaderTitle } from "../../base";
import { useListReferences } from "../queries";
import Clone from "./CloneReference";
import { ReferenceItem } from "./Item/ReferenceItem";
import ReferenceOfficial from "./ReferenceOfficial";
import ReferenceToolbar from "./ReferenceToolbar";

/**
 * A list of references with filtering options
 */
export default function ReferenceList() {
    const [urlPage] = useUrlSearchParams<number>("page");
    const [term] = useUrlSearchParams<string>("find");

    const { data, isPending, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteFindReferences(term);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const { documents, page, page_count, total_count, official_installed } = data;

    return (
        <>
            <ContainerNarrow>
                <ViewHeader title="References">
                    <ViewHeaderTitle>
                        References <ViewHeaderTitleBadge>{total_count}</ViewHeaderTitleBadge>
                    </ViewHeaderTitle>
                </ViewHeader>
                <ReferenceToolbar />
                <CreateReference />
                <ReferenceOfficial officialInstalled={official_installed} />
                {total_count !== 0 && (
                    <BoxGroup>
                        <ScrollList
                            className="mb-0"
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            isPending={isPending}
                            items={references}
                            renderRow={renderRow}
                        />
                    </BoxGroup>
                )}
            </ContainerNarrow>
            <Clone references={documents} />
        </>
    );
}
