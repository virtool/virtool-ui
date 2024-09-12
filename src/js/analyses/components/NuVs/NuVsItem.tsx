import { AnalysisViewerItem } from "@/analyses/components/Viewer/Item";
import { FormattedNuvsHit } from "@/analyses/types";
import { Badge } from "@base";
import { useUrlSearchParams } from "@utils/hooks";
import numbro from "numbro";
import React from "react";
import styled from "styled-components";
import { NuVsValues } from "./NuVsValues";

const NuVsItemHeader = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

const StyledNuVsItem = styled(AnalysisViewerItem)`
    border-bottom: none;
    border-left: none;
    border-radius: 0;
    margin: 0;
`;

type NuVsItemProps = {
    /** Complete information for a NuVs hit */
    hit: FormattedNuvsHit;
};

/**
 * A condensed NuVs item for use in a list of NuVs
 */
export default function NuVsItem({ hit }: NuVsItemProps) {
    const [activeHit, setActiveHit] = useUrlSearchParams("activeHit");

    const { id, e, annotatedOrfCount, sequence, index } = hit;

    return (
        <StyledNuVsItem active={activeHit === id} onClick={() => setActiveHit(id)}>
            <NuVsItemHeader>
                <strong>Sequence {index}</strong>
                <Badge>{sequence.length}</Badge>
            </NuVsItemHeader>
            <NuVsValues e={numbro(e).format()} orfCount={annotatedOrfCount} />
        </StyledNuVsItem>
    );
}
