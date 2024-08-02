import { useListHmms } from "@/hmm/queries";
import { LoadingPlaceholder, NoneFoundBox, Pagination, ViewHeader, ViewHeaderTitle } from "@base";
import { ViewHeaderTitleBadge } from "@base/ViewHeaderTitleBadge";
import { useListIndexes } from "@indexes/queries";
import { useFetchLabels } from "@labels/queries";
import { useFindModels } from "@ml/queries";
import { useFetchSubtractionsShortlist } from "@subtraction/queries";
import { useUrlSearchParams, useUrlSearchParamsList } from "@utils/hooks";
import { groupBy, intersectionWith, maxBy, union, xor } from "lodash-es";
import { map } from "lodash-es/lodash";
import React, { useState } from "react";
import styled from "styled-components";
import QuickAnalysis from "../../analyses/components/Create/QuickAnalyze";
import { useListSamples } from "../queries";
import { SampleMinimal } from "../types";
import { SampleFilters } from "./Filter/SampleFilters";
import SampleItem from "./Item/SampleItem";
import SampleToolbar from "./SamplesToolbar";
import SampleLabels from "./Sidebar/ManageLabels";

const SamplesListHeader = styled.div`
    grid-column: 1;
`;

const SamplesListContent = styled.div`
    grid-row: 2;
    min-width: 550px;
`;

const StyledSamplesList = styled.div`
    display: grid;
    grid-column-gap: ${props => props.theme.gap.column};
    grid-template-columns: minmax(auto, 1150px) max(320px, 10%);
`;

/**
 * A list of samples with filtering
 */
export default function SamplesList() {
    const [urlPage] = useUrlSearchParams<string>("page");
    const [term, setTerm] = useUrlSearchParams<string>("find");
    const [filterLabels, setFilterLabels] = useUrlSearchParamsList("labels");
    const [filterWorkflows, setFilterWorkflows] = useUrlSearchParamsList("workflows");

    const { data: samples, isLoading: isSamplesLoading } = useListSamples(
        Number(urlPage) || 1,
        25,
        term,
        filterLabels,
        filterWorkflows
    );
    const { data: labels, isLoading: isLabelsLoading } = useFetchLabels();
    const { data: hmms, isLoading: isLoadingHmms } = useListHmms(1, 25);
    const { data: indexes, isLoading: isLoadingIndexes } = useListIndexes(true);
    const { data: subtractionShortlist, isLoading: isLoadingSubtractionShortlist } =
        useFetchSubtractionsShortlist(true);
    const { data: mlModels, isLoading: isLoadingMLModels } = useFindModels();

    const [selected, setSelected] = useState([]);

    if (
        isSamplesLoading ||
        isLabelsLoading ||
        isLoadingHmms ||
        isLoadingIndexes ||
        isLoadingSubtractionShortlist ||
        isLoadingMLModels
    ) {
        return <LoadingPlaceholder />;
    }

    const filteredIndexes = map(groupBy(indexes, "reference.id"), group => maxBy(group, "version"));

    const { documents, page, page_count, total_count } = samples;

    function renderRow(document: SampleMinimal) {
        function handleSelect() {
            setSelected(xor(selected, [document.id]));
        }

        function selectOnQuickAnalyze() {
            if (!selected.includes(document.id)) {
                setSelected(union(selected, [document.id]));
            }
        }

        return (
            <SampleItem
                key={document.id}
                sample={document}
                checked={selected.includes(document.id)}
                handleSelect={handleSelect}
                selectOnQuickAnalyze={selectOnQuickAnalyze}
            />
        );
    }

    return (
        <>
            <QuickAnalysis
                hmms={hmms}
                indexes={filteredIndexes}
                mlModels={mlModels}
                onClear={() => setSelected([])}
                samples={intersectionWith(documents, selected, (document, id) => document.id === id)}
                subtractionOptions={subtractionShortlist}
            />
            <StyledSamplesList>
                <SamplesListHeader>
                    <ViewHeader title="Samples">
                        <ViewHeaderTitle>
                            Samples <ViewHeaderTitleBadge>{total_count}</ViewHeaderTitleBadge>
                        </ViewHeaderTitle>
                    </ViewHeader>
                    <SampleToolbar
                        selected={selected}
                        onClear={() => setSelected([])}
                        term={term}
                        onChange={e => setTerm(e.target.value)}
                    />
                </SamplesListHeader>
                <SamplesListContent>
                    {!documents.length ? (
                        <NoneFoundBox key="noSample" noun="samples" />
                    ) : (
                        <Pagination
                            items={documents}
                            storedPage={page}
                            currentPage={Number(urlPage) || 1}
                            renderRow={renderRow}
                            pageCount={page_count}
                        />
                    )}
                </SamplesListContent>
                {selected.length ? (
                    <SampleLabels
                        labels={labels}
                        selectedSamples={intersectionWith(documents, selected, (document, id) => document.id === id)}
                    />
                ) : (
                    <SampleFilters
                        labels={labels}
                        onClickLabels={e => setFilterLabels(xor(filterLabels, [e.toString()]))}
                        selectedLabels={filterLabels}
                        selectedWorkflows={filterWorkflows}
                        onClickWorkflows={setFilterWorkflows}
                    />
                )}
            </StyledSamplesList>
        </>
    );
}
