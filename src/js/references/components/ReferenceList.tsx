import { BoxGroup, ContainerNarrow, LoadingPlaceholder, Pagination, ViewHeader, ViewHeaderTitle } from "@base";
import { ViewHeaderTitleBadge } from "@base/ViewHeaderTitleBadge";
import { CreateReference } from "@references/components/CreateReference";
import { ReferenceItem } from "@references/components/Item/ReferenceItem";
import { useUrlSearchParams } from "@utils/hooks";
import { map } from "lodash";
import React from "react";
import { useFindReferences } from "../queries";
import Clone from "./CloneReference";
import ReferenceOfficial from "./ReferenceOfficial";
import ReferenceToolbar from "./ReferenceToolbar";

/**
 * A list of references with filtering options
 */
export default function ReferenceList() {
    const [urlPage] = useUrlSearchParams<number>("page");
    const [term] = useUrlSearchParams<string>("find");
    const { data, isPending } = useFindReferences(Number(urlPage) || 1, 25, term);

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
                    <Pagination
                        items={documents}
                        storedPage={page}
                        currentPage={Number(urlPage) || 1}
                        pageCount={page_count}
                    >
                        <BoxGroup>
                            {map(documents, document => (
                                <ReferenceItem key={document.id} reference={document} />
                            ))}
                        </BoxGroup>
                    </Pagination>
                )}
            </ContainerNarrow>
            <Clone references={documents} />
        </>
    );
}
