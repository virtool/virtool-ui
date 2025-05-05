import { map } from "lodash";
import React from "react";
import { usePageParam, useUrlSearchParam } from "../../app/hooks";
import BoxGroup from "../../base/BoxGroup";
import ContainerNarrow from "../../base/ContainerNarrow";
import LoadingPlaceholder from "../../base/LoadingPlaceholder";
import Pagination from "../../base/Pagination";
import ViewHeader from "../../base/ViewHeader";
import ViewHeaderTitle from "../../base/ViewHeaderTitle";
import ViewHeaderTitleBadge from "../../base/ViewHeaderTitleBadge";
import { useFindReferences } from "../queries";
import Clone from "./CloneReference";
import { CreateReference } from "./CreateReference";
import { ReferenceItem } from "./ReferenceItem";
import ReferenceOfficial from "./ReferenceOfficial";
import ReferenceToolbar from "./ReferenceToolbar";

/**
 * A list of references with filtering options
 */
export default function ReferenceList() {
    const { page } = usePageParam();
    const { value: term } = useUrlSearchParam<string>("find");
    const { data, isPending } = useFindReferences(page, 25, term);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const {
        documents,
        page: storedPage,
        page_count,
        total_count,
        official_installed,
    } = data;

    return (
        <>
            <ContainerNarrow>
                <ViewHeader title="References">
                    <ViewHeaderTitle>
                        References{" "}
                        <ViewHeaderTitleBadge>
                            {total_count}
                        </ViewHeaderTitleBadge>
                    </ViewHeaderTitle>
                </ViewHeader>
                <ReferenceToolbar />
                <CreateReference />
                <ReferenceOfficial officialInstalled={official_installed} />
                {total_count !== 0 && (
                    <Pagination
                        items={documents}
                        storedPage={storedPage}
                        currentPage={page}
                        pageCount={page_count}
                    >
                        <BoxGroup>
                            {map(documents, (document) => (
                                <ReferenceItem
                                    key={document.id}
                                    reference={document}
                                />
                            ))}
                        </BoxGroup>
                    </Pagination>
                )}
            </ContainerNarrow>
            <Clone references={documents} />
        </>
    );
}
