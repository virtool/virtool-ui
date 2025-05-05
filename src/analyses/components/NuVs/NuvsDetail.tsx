import { useUrlSearchParam } from "@/hooks";
import NuvsValues from "@analyses/components/NuVs/NuvsValues";
import { useGetActiveHit } from "@analyses/hooks";
import { FormattedNuvsHit } from "@analyses/types";
import { calculateAnnotatedOrfCount } from "@analyses/utils";
import { getBorder } from "@app/theme";
import Badge from "@base/Badge";
import { filter, map, sortBy } from "lodash-es";
import React from "react";
import styled from "styled-components";
import NuvsBLAST from "./NuvsBLAST";
import NuvsOrf from "./NuvsOrf";
import NuvsSequence from "./NuvsSequence";
import NuvsValues from "./NuVsValues";

const StyledNuVsFamilies = styled.div`
    border: ${getBorder};
    border-radius: ${(props) => props.theme.borderRadius.sm};
    display: flex;
    margin: 10px 0 5px;
    overflow: hidden;

    div {
        padding: 5px 10px;
    }

    div:first-child {
        background-color: ${(props) => props.theme.color.greyLightest};
        border-right: ${getBorder};
    }
`;

function NuvsFamilies({ families }) {
    return (
        <StyledNuVsFamilies>
            <div>Families</div>
            <div>{families.length ? families.join(", ") : "None"}</div>
        </StyledNuVsFamilies>
    );
}

const NuVsLayout = styled.div`
    border: ${getBorder};
    margin-bottom: 15px;

    & > div:nth-child(even) {
        background-color: ${(props) => props.theme.color.greyLightest};
    }
`;

const NuVsDetailTitle = styled.div`
    margin-bottom: 10px;

    h3 {
        align-items: center;
        display: flex;
        font-size: ${(props) => props.theme.fontSize.lg};
        font-weight: bold;
        justify-content: space-between;
        margin: 0;
    }

    span {
        font-size: ${(props) => props.theme.fontSize.md};
        font-weight: bold;
    }
`;

function NuvsDetailContainer({ children }) {
    return (
        <div className="flex flex-col flex-grow items-stretch">{children}</div>
    );
}

type NuVsDetailProps = {
    analysisId: string;
    /** A list of sorted and filtered NuVs hits */

    matches: FormattedNuvsHit[];
    maxSequenceLength: number;
};

/**
 * The detailed view of a NuVs sequence
 */
export default function NuvsDetail({
    analysisId,
    matches,
    maxSequenceLength,
}: NuVsDetailProps) {
    const { value: filterORFs } = useUrlSearchParam<boolean>("filterOrfs");
    const hit = useGetActiveHit(matches);

    if (!hit) {
        return <NuvsDetailContainer>No Hits</NuvsDetailContainer>;
    }

    const { e, families, orfs, sequence, index } = hit;

    let filtered;

    if (filterORFs) {
        filtered = filter(orfs, (orf) => orf.hits.length);
    }

    filtered = sortBy(filtered || orfs, (orf) => orf.hits.length).reverse();

    const orfComponents = map(filtered, (orf, index) => (
        <NuvsOrf
            key={index}
            index={index}
            {...orf}
            maxSequenceLength={maxSequenceLength}
        />
    ));

    return (
        <NuvsDetailContainer>
            <NuVsDetailTitle>
                <h3>
                    Sequence {index}
                    <Badge className="text-base py-2 px-3">
                        {sequence.length} bp
                    </Badge>
                </h3>
                <NuvsValues e={e} orfCount={calculateAnnotatedOrfCount(orfs)} />
                <NuvsFamilies families={families} />
            </NuVsDetailTitle>
            <NuVsLayout>
                <NuvsSequence
                    key="sequence"
                    maxSequenceLength={maxSequenceLength}
                    sequence={sequence}
                />
                {orfComponents}
            </NuVsLayout>
            <NuvsBLAST hit={hit} analysisId={analysisId} />
        </NuvsDetailContainer>
    );
}
