import "d3-transition";
import { useEffect, useRef } from "react";
import styled from "styled-components";

const StyledQualityChart = styled.div`
    min-height: 385px;

    .axis path,
    .axis line {
        fill: none;
        stroke: ${(props) => props.theme.color.black};
        shape-rendering: crispEdges;
    }

    .axis-label {
        text-anchor: middle;
    }

    .graph-line {
        fill: none;
        shape-rendering: geometricPrecision;
        stroke-width: 2px;
    }

    .graph-line-blue {
        stroke: ${(props) => props.theme.color.blue};
    }

    .graph-line-green {
        stroke: ${(props) => props.theme.color.green};
    }

    .graph-line-yellow {
        stroke: ${(props) => props.theme.color.yellow};
    }

    .graph-line-red {
        stroke: ${(props) => props.theme.color.red};
    }

    .quality-area {
        stroke: none;
    }

    .quality-area-yellow {
        fill: ${(props) => props.theme.color.yellowLightest};
    }

    .quality-area-green {
        fill: ${(props) => props.theme.color.greenLightest};
    }
`;

type QualityChartProps = {
    /** A callback function to create the sample quality chart */
    createChart: (
        current: HTMLDivElement,
        data: number[] | Array<[number, number, number, number]>,
        width: number,
    ) => void;

    /** The data to be used in the chart */
    data: number[];

    /** The width of the chart */
    width: number;
};

/**
 * Creates and displays charts for sample quality
 */
export function SampleChart({ createChart, data, width }: QualityChartProps) {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            createChart(ref.current, data, width);
        }
    }, [createChart, data, width]);

    return <StyledQualityChart ref={ref} />;
}
