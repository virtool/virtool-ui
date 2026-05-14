import "d3-transition";
import { useEffect, useRef } from "react";

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

	return <div className="quality-chart min-h-96" ref={ref} />;
}
