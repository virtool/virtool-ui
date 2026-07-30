import { useElementSize } from "@app/hooks";
import Popover from "@base/Popover";
import type { Coordinate } from "@virtool/contracts";
import { buildDepthPath } from "./coverage";

/** The horizontal space left between one panel and the next. */
const gap = 6;

/**
 * The height reserved for the label row, whether or not a given panel has
 * text to put there.
 *
 * Reserving it unconditionally keeps every chart the same total height —
 * without it, a chart whose panels have nothing to say sits flush against the
 * bottom of its box while one with labelled panels grows to fit them, and the
 * two read as different components rather than the same chart in two states.
 */
const labelHeight = 18;

/** One panel of a coverage chart: the curve to draw, and its caption. */
export type CoveragePanel = {
	/** The coverage polyline to draw, or null/empty to draw nothing */
	align: Coordinate[] | null;

	/** A unique, stable key for the panel */
	key: string;

	/** The caption drawn below the panel; empty to reserve the space without text */
	label: string;

	/** The span of the reference this panel covers, which fixes its share of the chart */
	length: number;

	/** Extra detail shown in a popover when the caption is clicked */
	detail?: string;
};

type Panel = CoveragePanel & { offset: number; width: number };

// Each panel takes the share of the chart its length is of the whole reference,
// so a position is the same number of nucleotides wide in every panel, and in
// every other chart laid out against the same reference — which is what lets an
// OTU's overview and each of its isolates' charts, and every isolate's charts
// against each other, be read against one another.
function layOutPanels(panels: CoveragePanel[], width: number): Panel[] {
	const total = panels.reduce((sum, panel) => sum + panel.length, 0);

	if (total === 0) {
		return [];
	}

	const available = Math.max(0, width - gap * (panels.length - 1));

	let offset = 0;

	return panels.map((panel) => {
		const laidOut = {
			...panel,
			offset,
			width: (available * panel.length) / total,
		};

		offset += laidOut.width + gap;

		return laidOut;
	});
}

type PathoscopeCoverageChartProps = {
	/** The accessible description of the whole chart */
	description: string;

	/** The height of the plotting area */
	height: number;

	/** The greatest depth any panel may draw, so every panel's curve is comparable */
	maxDepth: number;

	/** The panels to draw, in the order they should appear */
	panels: CoveragePanel[];
};

/**
 * A coverage chart with one or more panels side by side, sharing one bordered
 * box, one depth domain, and one measured width — used for both an OTU's
 * merged overview and each of its isolates, so the two read as the same kind
 * of figure rather than two different ones.
 */
export default function PathoscopeCoverageChart({
	description,
	height,
	maxDepth,
	panels,
}: PathoscopeCoverageChartProps) {
	const [ref, { width }] = useElementSize<HTMLDivElement>();

	const laidOut = width > 0 ? layOutPanels(panels, width) : [];

	// The border and padding sit on the outer element and the width is measured on
	// the inner one, because `useElementSize` reports `offsetWidth` — a border-box
	// figure. Measuring the bordered element would size the chart to two pixels
	// wider than the box it has to fit inside.
	return (
		<div className="bg-blue-100 border border-blue-200 pt-2 rounded-sm">
			<div ref={ref}>
				<svg width={width} height={height} role="img" aria-label={description}>
					<title>{description}</title>
					{laidOut.map((panel) => {
						const d = panel.align
							? buildDepthPath(
									panel.align,
									panel.length,
									panel.width,
									maxDepth,
									height,
								)
							: "";

						return d ? (
							<path
								className="fill-blue-500"
								d={d}
								key={panel.key}
								transform={`translate(${panel.offset},0)`}
							/>
						) : null;
					})}
				</svg>
				<div
					className="flex pl-0.5 pt-0.5 text-gray-600 text-xs"
					style={{ gap, height: labelHeight }}
				>
					{laidOut.map((panel) => (
						<div
							className="text-left truncate"
							key={panel.key}
							style={{ width: panel.width }}
						>
							{panel.detail ? (
								<Popover
									trigger={
										<button
											className="w-full cursor-pointer truncate border-0 bg-transparent p-0 text-left"
											type="button"
										>
											{panel.label}
										</button>
									}
								>
									<p className="m-0 p-3 text-gray-800 text-sm">
										{panel.detail}
									</p>
								</Popover>
							) : (
								panel.label
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
