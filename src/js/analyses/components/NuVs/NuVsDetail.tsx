import { NuVsValues } from "@/analyses/components/NuVs/NuVsValues";
import { useGetActiveHit } from "@/analyses/hooks";
import { FormattedNuvsHit } from "@/analyses/types";
import { calculateAnnotatedOrfCount } from "@/analyses/utils";
import { getBorder } from "@app/theme";
import { Badge, Box } from "@base";
import { useUrlSearchParams } from "@utils/hooks";
import { filter, map, sortBy } from "lodash-es";
import React from "react";
import styled from "styled-components";
import NuVsBLAST from "./NuVsBLAST";
import { NuVsORF } from "./ORF";
import { NuVsSequence } from "./Sequence";

const StyledNuVsFamilies = styled.div`
    border: ${getBorder};
    border-radius: ${props => props.theme.borderRadius.sm};
    display: flex;
    margin: 10px 0 5px;
    overflow: hidden;

    div {
        padding: 5px 10px;
    }

    div:first-child {
        background-color: ${props => props.theme.color.greyLightest};
        border-right: ${getBorder};
    }
`;

const NuVsFamilies = ({ families }) => (
    <StyledNuVsFamilies>
        <div>Families</div>
        <div>{families.length ? families.join(", ") : "None"}</div>
    </StyledNuVsFamilies>
);

const NuVsLayout = styled.div`
    border: ${getBorder};
    margin-bottom: 15px;

    & > div:nth-child(even) {
        background-color: ${props => props.theme.color.greyLightest};
    }
`;

const NuVsDetailTitle = styled.div`
    margin-bottom: 10px;

    h3 {
        align-items: center;
        display: flex;
        font-size: ${props => props.theme.fontSize.lg};
        font-weight: bold;
        justify-content: space-between;
        margin: 0;
    }

    span {
        font-size: ${props => props.theme.fontSize.md};
        font-weight: bold;
    }
`;

const StyledNuVsDetail = styled(Box)`
    align-items: stretch;
    display: flex;
    flex-direction: column;
    min-height: 500px;
    min-width: 0;
    margin-left: 10px;
`;

type NuVsDetailProps = {
    analysisId: string;
    /** A list of sorted and filtered NuVs hits */
    matches: FormattedNuvsHit[];
    maxSequenceLength: number;
};

/**
 * The detailed view of a NuVs sequence
 */
export default function NuVsDetail({ analysisId, matches, maxSequenceLength }: NuVsDetailProps) {
    const [filterORFs] = useUrlSearchParams("filterOrfs");
    const hit = useGetActiveHit(matches);

    if (!hit) {
        return <StyledNuVsDetail>No Hits</StyledNuVsDetail>;
    }

    const { e, families, orfs, sequence, index } = hit;

    let filtered;

    if (filterORFs) {
        filtered = filter(orfs, orf => orf.hits.length);
    }

    filtered = sortBy(filtered || orfs, orf => orf.hits.length).reverse();

    const orfComponents = map(filtered, (orf, index) => (
        <NuVsORF key={index} index={index} {...orf} maxSequenceLength={maxSequenceLength} />
    ));

    return (
        <StyledNuVsDetail>
            <NuVsDetailTitle>
                <h3>
                    Sequence {index}
                    <Badge className="text-base py-2 px-3">{sequence.length} bp</Badge>
                </h3>
                <NuVsValues e={e} orfCount={calculateAnnotatedOrfCount(orfs)} />
                <NuVsFamilies families={families} />
            </NuVsDetailTitle>
            <NuVsLayout>
                <NuVsSequence key="sequence" maxSequenceLength={maxSequenceLength} sequence={sequence} />
                {orfComponents}
            </NuVsLayout>
            <NuVsBLAST hit={hit} analysisId={analysisId} />
        </StyledNuVsDetail>
    );
}
