import { map } from "lodash";
import React, { useEffect } from "react";
import { Badge, LoadingPlaceholder, NoneFoundBox, ViewHeader, ViewHeaderTitle } from "../../base";
import { useUrlSearchParams } from "../../utils/hooks";
import { useFetchSubtractions } from "../querys";
import { SubtractionMinimal } from "../types";
import { SubtractionItem } from "./SubtractionItem";
import SubtractionToolbar from "./SubtractionToolbar";

function renderRow({ created_at, user, name, id, ready, job }: SubtractionMinimal) {
    return <SubtractionItem key={id} id={id} user={user} name={name} created_at={created_at} ready={ready} job={job} />;
}

/**
 * A list of subtractions
 */
export default function SubtractionList() {
    const [value, setValue] = useUrlSearchParams("find");
    const { data, isLoading, refetch } = useFetchSubtractions(value, 1);

    useEffect(() => {
        refetch();
    }, [value, refetch]);

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    function handleChange(e) {
        const searchValue = e.target.value;
        setValue(searchValue);
    }

    const { documents, total_count } = data;

    const subtractionComponents = documents.length ? map(documents, renderRow) : <NoneFoundBox noun="subtractions" />;

    return (
        <>
            <ViewHeader title="Subtractions">
                <ViewHeaderTitle>
                    Subtractions <Badge>{total_count}</Badge>
                </ViewHeaderTitle>
            </ViewHeader>

            <SubtractionToolbar term={value} handleChange={handleChange} />

            {subtractionComponents}
        </>
    );
}
