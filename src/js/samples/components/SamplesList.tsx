import { useListHmms } from "@/hmm/queries";
import {
    LoadingPlaceholder,
    NoneFoundBox,
    Pagination,
    ViewHeader,
    ViewHeaderTitle,
} from "@/base";
import { ViewHeaderTitleBadge } from "@base/ViewHeaderTitleBadge";
import { useListIndexes } from "@indexes/queries";
import { useFetchLabels } from "@labels/queries";
import { useFindModels } from "@ml/queries";
import { useFetchSubtractionsShortlist } from "@subtraction/queries";
import {
    useListSearchParam,
    usePageParam,
    useUrlSearchParam,
} from "@utils/hooks";
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
    const { data: hmms, isPending: isPendingHmms } = useListHmms(1, 25);
    const { data: indexes, isPending: isPendingIndexes } = useListIndexes(true);
    const {
        data: subtractionShortlist,
        isPending: isPendingSubtractionShortlist,
    } = useFetchSubtractionsShortlist(true);
    const { data: mlModels, isPending: isPendingMLModels } = useFindModels();

    const [selected, setSelected] = useState([]);

    if (
        isPendingSamples ||
        isPendingLabels ||
        isPendingHmms ||
        isPendingIndexes ||
        isPendingSubtractionShortlist ||
        isPendingMLModels
    ) {
        return <LoadingPlaceholder />;
    }

    const filteredIndexes = map(groupBy(indexes, "reference.id"), (group) =>
        maxBy(group, "version"),
    );

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
                samples={intersectionWith(
                    documents,
                    selected,
                    (document, id) => document.id === id,
                )}
                subtractionOptions={subtractionShortlist}
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
