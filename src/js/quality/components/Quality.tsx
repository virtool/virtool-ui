import React, { RefObject } from "react";
import styled from "styled-components";
import { getFontSize } from "../../app/theme";
import { useElementSize } from "../../utils/hooks";
import { drawBasesChart } from "./Bases";
import { QualityChart } from "./Chart";
import { drawNucleotidesChart } from "./Nucleotides";
import { drawSequencesChart } from "./Sequences";

const QualityTitle = styled.h5`
    display: flex;
    font-size: ${getFontSize("lg")};
    justify-content: space-between;
`;

export function Quality({ bases, composition, sequences }) {
    const [ref, { width }] = useElementSize();

    return (
        <div ref={ref as RefObject<HTMLDivElement>}>
            {width && (
                <>
                    <QualityTitle>
                        <strong>Quality Distribution at Read Positions</strong>
                    </QualityTitle>
                    <QualityChart createChart={drawBasesChart} data={bases} width={width} />

                    <QualityTitle>
                        <strong>Nucleotide Composition at Read Positions</strong>
                    </QualityTitle>
                    <QualityChart createChart={drawNucleotidesChart} data={composition} width={width} />

                    <QualityTitle>
                        <strong>Read-wise Quality Occurrence</strong>
                    </QualityTitle>
                    <QualityChart createChart={drawSequencesChart} data={sequences} width={width} />
                </>
            )}
        </div>
    );
}
