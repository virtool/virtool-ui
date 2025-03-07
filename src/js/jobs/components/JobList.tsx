import { useListSearchParam, usePageParam } from "@/hooks";
import { getFontWeight } from "@app/theme";
import Box from "@base/Box";
import BoxGroup from "@base/BoxGroup";
import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import Pagination from "@base/Pagination";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { useFindJobs } from "@jobs/queries";
import { map } from "lodash";
import React from "react";
import styled from "styled-components";
import { JobFilters } from "./Filters/JobFilters";
import Job from "./Item/JobItem";

const JobsListViewContainer = styled.div`
    display: flex;
    gap: ${(props) => props.theme.gap.column};
    justify-content: start;
`;

const JobsListEmpty = styled(Box)`
    align-items: center;
    color: ${(props) => props.theme.color.greyDark};
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
    const { values: states } = useListSearchParam("state", initialState);
    const { page } = usePageParam();
    const { data, isPending } = useFindJobs(page, 25, states);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const {
        documents,
        page: storedPage,
        page_count,
        counts,
        found_count,
        total_count,
    } = data;

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
            <Pagination
                items={documents}
                storedPage={storedPage}
                currentPage={page}
                pageCount={page_count}
            >
                <BoxGroup>
                    {map(documents, (document) => (
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
