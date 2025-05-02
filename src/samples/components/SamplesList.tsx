import { useListSearchParam, usePageParam, useUrlSearchParam } from "../../app/hooks";
import QuickAnalyze from "../../analyses/components/Create/QuickAnalyze";
import LoadingPlaceholder from "../../base/LoadingPlaceholder";
import NoneFoundBox from "../../base/NoneFoundBox";
import Pagination from "../../base/Pagination";
import ViewHeader from "../../base/ViewHeader";
import ViewHeaderTitle from "../../base/ViewHeaderTitle";
import ViewHeaderTitleBadge from "../../base/ViewHeaderTitleBadge";
import { useListIndexes } from "../../indexes/queries";
import { useFetchLabels } from "../../labels/queries";
import { intersectionWith, union, xor } from "lodash-es";
import React, { useState } from "react";
import styled from "styled-components";
import { useListSamples } from "../queries";
import { SampleMinimal } from "../types";
import SampleFilters from "./Filter/SampleFilters";
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
    grid-column-gap: ${(props) => props.theme.gap.column};
    grid-template-columns: minmax(auto, 1150px) max(320px, 10%);
`;

/**
 * A list of samples with filtering
 */
export default function SamplesList() {
    const { page: urlPage } = usePageParam();

    const { value: term, setValue: setTerm } =
        useUrlSearchParam<string>("term");

    const { values: filterLabels, setValues: setFilterLabels } =
        useListSearchParam<string>("labels");

    const { values: filterWorkflows, setValues: setFilterWorkflows } =
        useListSearchParam<string>("workflows");

    const { data: samples, isPending: isPendingSamples } = useListSamples(
        urlPage,
        25,
        term,
        filterLabels,
        filterWorkflows,
    );
    const { data: labels, isPending: isPendingLabels } = useFetchLabels();
    const { isPending: isPendingIndexes } = useListIndexes(true);

    const [selected, setSelected] = useState([]);

    if (isPendingSamples || isPendingLabels || isPendingIndexes) {
        return <LoadingPlaceholder />;
    }

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
            <QuickAnalyze
                onClear={() => setSelected([])}
                samples={intersectionWith(
                    documents,
                    selected,
                    (document, id) => document.id === id,
                )}
            />
            <StyledSamplesList>
                <SamplesListHeader>
                    <ViewHeader title="Samples">
                        <ViewHeaderTitle>
                            Samples{" "}
                            <ViewHeaderTitleBadge>
                                {total_count}
                            </ViewHeaderTitleBadge>
                        </ViewHeaderTitle>
                    </ViewHeader>
                    <SampleToolbar
                        selected={selected}
                        onClear={() => setSelected([])}
                        term={term}
                        onChange={(e) => setTerm(e.target.value)}
                    />
                </SamplesListHeader>
                <SamplesListContent>
                    {!documents.length ? (
                        <NoneFoundBox key="noSample" noun="samples" />
                    ) : (
                        <Pagination
                            items={documents}
                            storedPage={page}
                            currentPage={urlPage}
                            renderRow={renderRow}
                            pageCount={page_count}
                        />
                    )}
                </SamplesListContent>
                {selected.length ? (
                    <SampleLabels
                        labels={labels}
                        selectedSamples={intersectionWith(
                            documents,
                            selected,
                            (document, id) => document.id === id,
                        )}
                    />
                ) : (
                    <SampleFilters
                        labels={labels}
                        onClickLabels={(e) =>
                            setFilterLabels(xor(filterLabels, [e.toString()]))
                        }
                        selectedLabels={filterLabels}
                        selectedWorkflows={filterWorkflows}
                        onClickWorkflows={setFilterWorkflows}
                    />
                )}
            </StyledSamplesList>
        </>
    );
}
