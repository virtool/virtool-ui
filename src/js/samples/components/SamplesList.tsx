import { union, without } from "lodash-es";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import QuickAnalysis from "../../analyses/components/Create/QuickAnalyze";
import { Badge, LoadingPlaceholder, NoneFoundBox, Pagination, ViewHeader, ViewHeaderTitle } from "../../base";
import { useFetchLabels } from "../../labels/hooks";
import { useUrlSearchParams, useUrlSearchParamsList } from "../../utils/hooks";
import { useListSamples } from "../querys";
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
    const [urlPage] = useUrlSearchParams("page");
    const [term, setTerm] = useUrlSearchParams("find");
    const [filterLabels, setFilterLabels] = useUrlSearchParamsList("labels");

    const { data: samples, isLoading: isSamplesLoading } = useListSamples(Number(urlPage) || 1, 5, term, filterLabels);
    const { data: labels, isLoading: isLabelsLoading } = useFetchLabels();

    const [selected, setSelected] = useState([]);

    useEffect(() => {
        setSelected(
            selected.map(
                prevSample => samples.documents.find(newSample => newSample.id === prevSample.id) || prevSample,
            ),
        );
    }, [samples]);

    if (isSamplesLoading || isLabelsLoading) {
        return <LoadingPlaceholder />;
    }

    const { documents, page, page_count, total_count } = samples;

    function renderRow(document: SampleMinimal) {
        function handleSelect() {
            if (!selected.includes(document)) {
                setSelected(union(selected, [document]));
            } else {
                setSelected(without(selected, document));
            }
        }

        function selectOnQuickAnalyze() {
            if (!selected.includes(document)) {
                setSelected(union(selected, [document]));
            }
        }

        return (
            <SampleItem
                key={document.id}
                sample={document}
                checked={selected.some(item => item.id === document.id)}
                handleSelect={handleSelect}
                selectOnQuickAnalyze={selectOnQuickAnalyze}
            />
        );
    }

    return (
        <>
            <QuickAnalysis samples={selected} onClear={() => setSelected([])} />
            <StyledSamplesList>
                <SamplesListHeader>
                    <ViewHeader title="Samples">
                        <ViewHeaderTitle>
                            Samples <Badge>{total_count}</Badge>
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
                    <SampleLabels labels={labels} selectedSamples={selected} />
                ) : (
                    <SampleFilters
                        labels={labels}
                        onClick={e => {
                            !filterLabels.includes(e.toString())
                                ? setFilterLabels(union(filterLabels, [e]))
                                : setFilterLabels(without(filterLabels, e.toString()));
                        }}
                        selectedLabels={filterLabels}
                    />
                )}
            </StyledSamplesList>
        </>
    );
}
