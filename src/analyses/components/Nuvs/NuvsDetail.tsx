import { useGetActiveHit } from "@analyses/hooks";
import { FormattedNuvsHit, NuvsOrf as NuvsOrfType } from "@analyses/types";
import { calculateAnnotatedOrfCount } from "@analyses/utils";
import { useUrlSearchParam } from "@app/hooks";
import { getBorder } from "@app/theme";
import Badge from "@base/Badge";
import { sortBy } from "es-toolkit";
import styled from "styled-components";
import NuvsBlast from "./NuvsBlast";
import NuvsOrf from "./NuvsOrf";
import NuvsSequence from "./NuvsSequence";
import NuvsValues from "./NuvsValues";

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
    /** A list of sorted and filtered Nuvs hits */

    matches: FormattedNuvsHit[];
    maxSequenceLength: number;
};

/**
 * The detailed view of a Nuvs sequence
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

    let filtered: NuvsOrfType[] = orfs;

    if (filterORFs) {
        filtered = orfs.filter((orf) => orf.hits.length);
    }

    filtered = sortBy(filtered, [(orf) => orf.hits.length]).reverse();

    const orfComponents = filtered.map((orf, index) => (
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
            <NuvsBlast hit={hit} analysisId={analysisId} />
        </NuvsDetailContainer>
    );
}
