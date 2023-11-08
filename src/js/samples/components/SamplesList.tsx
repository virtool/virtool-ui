import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import QuickAnalysis from "../../analyses/components/Create/Quick";
import { Badge, LoadingPlaceholder, NoneFoundBox, Pagination, ViewHeader, ViewHeaderTitle } from "../../base";
import { useUrlSearchParams } from "../../utils/hooks";
import { useFindSamples } from "../querys";
import { SampleFilters } from "./Filter/Filters";
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
    const location = useLocation();
    const [term, setTerm] = useUrlSearchParams("find");
    const URLPage = parseInt(new URLSearchParams(location.search).get("page")) || 1;
    const { data, isLoading } = useFindSamples(URLPage, 2, term);
    const [selected, setSelected] = useState([]);

    if (isLoading) {
        return <LoadingPlaceholder />;
    }
    const { documents, page, page_count, total_count } = data;

    function onClear() {
        setSelected([]);
    }

    function renderRow(document) {
        function handleSelect() {
            if (!selected.includes(document)) {
                setSelected(selected => [...selected, document]);
            } else {
                setSelected(prevSelected => prevSelected.filter(item => item !== document));
            }
        }

        function select() {
            if (!selected.includes(document)) {
                setSelected(selected => [...selected, document]);
            }
        }

        return (
            <SampleItem
                {...document}
                key={document.id}
                id={document.id}
                checked={selected.some(item => item.id === document.id)}
                created_at={document.created_at}
                handle={document.user.handle}
                labels={document.labels}
                library_type={document.library_type}
                name={document.name}
                onSelect={handleSelect}
                ready={document.ready}
                select={select}
                workflows={document.workflows}
            />
        );
    }

    return (
        <>
            <QuickAnalysis samples={selected} onClear={onClear} />
            <StyledSamplesList>
                <SamplesListHeader>
                    <ViewHeader title="Samples">
                        <ViewHeaderTitle>
                            Samples <Badge>{total_count}</Badge>
                        </ViewHeaderTitle>
                    </ViewHeader>
                    <SampleToolbar
                        selected={selected}
                        onClear={onClear}
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
                            currentPage={URLPage}
                            renderRow={renderRow}
                            pageCount={page_count}
                        />
                    )}
                </SamplesListContent>
                {selected.length ? (
                    <SampleLabels selectedSamples={selected} documents={documents} />
                ) : (
                    <SampleFilters />
                )}
            </StyledSamplesList>
        </>
    );
}
