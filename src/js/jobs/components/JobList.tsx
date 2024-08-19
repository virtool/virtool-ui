import { getFontWeight } from "@app/theme";
import { Box, BoxGroup, ContainerNarrow, LoadingPlaceholder, Pagination, ViewHeader, ViewHeaderTitle } from "@base";
import { useFindJobs } from "@jobs/queries";
import { useUrlSearchParams, useUrlSearchParamsList } from "@utils/hooks";
import { map } from "lodash";
import React from "react";
import styled from "styled-components";
import { JobFilters } from "./Filters/JobFilters";
import Job from "./Item/JobItem";

const JobsListViewContainer = styled.div`
    display: flex;
    gap: ${props => props.theme.gap.column};
    justify-content: start;
`;

const JobsListEmpty = styled(Box)`
    align-items: center;
    color: ${props => props.theme.color.greyDark};
    display: flex;
    justify-content: center;
    height: 100%;

    h3 {
        font-weight: ${getFontWeight("thick")};
    }
`;

const initialState = ["preparing", "running"];

/**
 * A list of jobs with filtering options
 */
export default function JobsList() {
    const [states] = useUrlSearchParamsList("state", initialState);
    const [urlPage] = useUrlSearchParams<number>("page");
    const { data, isPending } = useFindJobs(Number(urlPage) || 1, 25, states);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const { documents, page, page_count, counts, found_count, total_count } = data;
    let inner;

    if (total_count === 0) {
        inner = (
            <JobsListEmpty>
                <h3>No jobs found</h3>
            </JobsListEmpty>
        );
    } else if (found_count === 0) {
        inner = (
            <JobsListEmpty>
                <h3>No jobs matching filters</h3>
            </JobsListEmpty>
        );
    } else {
        inner = (
            <Pagination items={documents} storedPage={page} currentPage={Number(urlPage) || 1} pageCount={page_count}>
                <BoxGroup>
                    {map(documents, document => (
                        <Job key={document.id} {...document} />
                    ))}
                </BoxGroup>
            </Pagination>
        );
    }

    return (
        <>
            <ViewHeader title="Jobs">
                <ViewHeaderTitle>Jobs</ViewHeaderTitle>
            </ViewHeader>
            <JobsListViewContainer>
                <ContainerNarrow>{inner}</ContainerNarrow>
                <JobFilters counts={counts} />
            </JobsListViewContainer>
        </>
    );
}
