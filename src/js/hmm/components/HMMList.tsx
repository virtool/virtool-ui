import {
    BoxGroup,
    LoadingPlaceholder,
    NoneFoundBox,
    Pagination,
    ViewHeader,
    ViewHeaderTitle,
} from "@/base";
import { ViewHeaderTitleBadge } from "@base/ViewHeaderTitleBadge";
import { usePageParam, useUrlSearchParam } from "@utils/hooks";
import { map } from "lodash";
import React from "react";
import { useListHmms } from "../queries";
import { HMMInstaller } from "./HMMInstaller";
import HMMItem from "./HMMItem";
import HMMToolbar from "./HMMToolbar";

/**
 * A list of HMMs with filtering options
 */
export default function HMMList() {
    const { page } = usePageParam();
    const { value: term, setValue: setTerm } =
        useUrlSearchParam<string>("find");
    const { data, isPending } = useListHmms(page, 25, term);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const {
        documents,
        page: storedPage,
        page_count,
        found_count,
        total_count,
        status,
    } = data;

    return (
        <div>
            <ViewHeader title="HMMs">
                <ViewHeaderTitle>
                    HMMs{" "}
                    {status.task?.complete && (
                        <ViewHeaderTitleBadge>
                            {found_count}
                        </ViewHeaderTitleBadge>
                    )}
                </ViewHeaderTitle>
            </ViewHeader>

            {total_count ? (
                <>
                    <HMMToolbar
                        term={term}
                        onChange={(e) => setTerm(e.target.value)}
                    />
                    {documents.length ? (
                        <Pagination
                            items={documents}
                            storedPage={storedPage}
                            currentPage={page}
                            pageCount={page_count}
                        >
                            <BoxGroup>
                                {map(documents, (document) => (
                                    <HMMItem key={document.id} hmm={document} />
                                ))}
                            </BoxGroup>
                        </Pagination>
                    ) : (
                        <NoneFoundBox noun="HMMs" />
                    )}
                </>
            ) : (
                <HMMInstaller />
            )}
        </div>
    );
}
