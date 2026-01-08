import { useListSearchParam, usePageParam } from "@app/hooks";
import { getFontWeight } from "@app/theme";
import Box from "@base/Box";
import BoxGroup from "@base/BoxGroup";
import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import Pagination from "@base/Pagination";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { ReactElement } from "react";
import styled from "styled-components";
import { useFindJobs } from "../queries";
import { JobState } from "../types";
import { JobFilters } from "./Filters/JobFilters";
import JobItem from "./JobItem";

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

const initialState: JobState[] = ["pending", "running"];

export default function JobsList() {
    const { values: states } = useListSearchParam<JobState>(
        "state",
        initialState,
    );
    const { page } = usePageParam();
    const result = useFindJobs(page, 25, states);

    console.log("useFindJobs result:", result);

    const { data, isPending } = result;

    if (isPending || !data) {
        return <LoadingPlaceholder />;
    }

    const {
        items,
        page: storedPage,
        pageCount,
        counts,
        foundCount,
        totalCount,
    } = data;

    let inner: ReactElement;

    if (totalCount === 0) {
        inner = (
            <JobsListEmpty>
                <h3>No jobs found</h3>
            </JobsListEmpty>
        );
    } else if (foundCount === 0) {
        inner = (
            <JobsListEmpty>
                <h3>No jobs matching filters</h3>
            </JobsListEmpty>
        );
    } else {
        inner = (
            <Pagination
                items={items}
                storedPage={storedPage}
                currentPage={page}
                pageCount={pageCount}
            >
                <BoxGroup>
                    {items.map((item) => (
                        <JobItem key={item.id} {...item} />
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
