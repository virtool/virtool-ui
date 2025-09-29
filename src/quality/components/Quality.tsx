import { useElementSize } from "@app/hooks";
import { getFontSize } from "@app/theme";
import { RefObject } from "react";
import styled from "styled-components";
import { drawBasesChart } from "./Bases";
import { drawNucleotidesChart } from "./Nucleotides";
import { SampleChart } from "./SampleChart";
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
                    <SampleChart
                        createChart={drawBasesChart}
                        data={bases}
                        width={width}
                    />

                    <QualityTitle>
                        <strong>
                            Nucleotide Composition at Read Positions
                        </strong>
                    </QualityTitle>
                    <SampleChart
                        createChart={drawNucleotidesChart}
                        data={composition}
                        width={width}
                    />

                    <QualityTitle>
                        <strong>Read-wise Quality Occurrence</strong>
                    </QualityTitle>
                    <SampleChart
                        createChart={drawSequencesChart}
                        data={sequences}
                        width={width}
                    />
                </>
            )}
        </div>
    );
}
