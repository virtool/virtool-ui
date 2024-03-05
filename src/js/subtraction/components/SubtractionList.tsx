import { map } from "lodash";
import React from "react";
import { Badge, BoxGroup, LoadingPlaceholder, NoneFoundBox, Pagination, ViewHeader, ViewHeaderTitle } from "../../base";
import { useUrlSearchParams } from "../../utils/hooks";
import { useFindSubtractions } from "../queries";
import { SubtractionItem } from "./SubtractionItem";
import SubtractionToolbar from "./SubtractionToolbar";

/**
 * A list of subtractions
 */
export default function SubtractionList() {
    const [term, setTerm] = useUrlSearchParams("find");
    const [urlPage] = useUrlSearchParams("page");
    const { data, isLoading } = useFindSubtractions(Number(urlPage) || 1, 25, term);

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    function handleChange(e) {
        setTerm(e.target.value);
    }

    const { documents, total_count, page, page_count } = data;

    return (
        <>
            <ViewHeader title="Subtractions">
                <ViewHeaderTitle>
                    Subtractions <Badge>{total_count}</Badge>
                </ViewHeaderTitle>
            </ViewHeader>

            <SubtractionToolbar term={term} handleChange={handleChange} />

            {!documents.length ? (
                <NoneFoundBox key="noSample" noun="samples" />
            ) : (
                <Pagination
                    items={documents}
                    storedPage={page}
                    currentPage={Number(urlPage) || 1}
                    pageCount={page_count}
                >
                    <BoxGroup>
                        {map(documents, document => (
                            <SubtractionItem key={document.id} {...document} />
                        ))}{" "}
                    </BoxGroup>
                </Pagination>
            )}
        </>
    );
}
