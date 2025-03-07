import { usePageParam, useUrlSearchParam } from "@/hooks";
import {
    LoadingPlaceholder,
    NoneFoundBox,
    Pagination,
    ViewHeader,
    ViewHeaderTitle,
} from "@base";
import BoxGroup from "@base/BoxGroup";
import { ViewHeaderTitleBadge } from "@base/ViewHeaderTitleBadge";
import { map } from "lodash";
import React from "react";
import { useFindSubtractions } from "../queries";
import { SubtractionItem } from "./SubtractionItem";
import SubtractionToolbar from "./SubtractionToolbar";

/**
 * A list of subtractions.
 */
export default function SubtractionList() {
    const { value: term, setValue: setTerm } =
        useUrlSearchParam<string>("find");
    const { page } = usePageParam();

    const { data, isPending } = useFindSubtractions(page, 25, term);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    function handleChange(e) {
        setTerm(e.target.value);
    }

    const { documents, total_count, page: storedPage, page_count } = data;

    return (
        <>
            <ViewHeader title="Subtractions">
                <ViewHeaderTitle>
                    Subtractions{" "}
                    <ViewHeaderTitleBadge>{total_count}</ViewHeaderTitleBadge>
                </ViewHeaderTitle>
            </ViewHeader>

            <SubtractionToolbar term={term} handleChange={handleChange} />

            {!documents.length ? (
                <NoneFoundBox key="subtractions" noun="subtractions" />
            ) : (
                <Pagination
                    items={documents}
                    storedPage={storedPage}
                    currentPage={page}
                    pageCount={page_count}
                >
                    <BoxGroup>
                        {map(documents, (document) => (
                            <SubtractionItem key={document.id} {...document} />
                        ))}
                    </BoxGroup>
                </Pagination>
            )}
        </>
    );
}
