import { useElementSize } from "@app/hooks";
import Popover from "@base/Popover";
import type { Coordinate } from "@virtool/contracts";
import type { ReactNode } from "react";
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

/**
 * The space above a panel's curve.
 *
 * It belongs to the panel rather than to the box around it, so that a panel's
 * hover and focus styling covers the full height of the chart. Held on the box,
 * it left a strip along the top that was inside the border but outside every
 * panel, and so stayed unhighlighted while the panel below it was hovered.
 */
const topPadding = 8;

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

	/**
	 * Detail revealed in a popover when the panel is activated.
	 *
	 * A panel that has one becomes a button covering both its curve and its
	 * caption; a panel without one is inert.
	 */
	detail?: ReactNode;
};

type Panel = CoveragePanel & { width: number };

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

	return panels.map((panel) => ({
		...panel,
		width: (available * panel.length) / total,
	}));
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
 *
 * Every element is phrasing content: the OTU's overview is drawn inside the
 * accordion's trigger, which is a button and may not contain a `div`.
 */
export default function PathoscopeCoverageChart({
	description,
	height,
	maxDepth,
	panels,
}: PathoscopeCoverageChartProps) {
	const [ref, { width }] = useElementSize<HTMLSpanElement>();

	const laidOut = width > 0 ? layOutPanels(panels, width) : [];

	// A chart whose panels open popovers holds buttons, which an `img` would make
	// presentational. One that has none is a single graphic, and reads better to
	// assistive technology as one named object than as a group of unnamed ones.
	const interactive = panels.some((panel) => Boolean(panel.detail));

	function renderPanel(panel: Panel) {
		const d = panel.align
			? buildDepthPath(panel.align, panel.length, panel.width, maxDepth, height)
			: "";

		// The curve carries no text, so it is named by the chart around it rather
		// than exposed as an unlabelled graphic of its own.
		const body = (
			<>
				<svg
					aria-hidden="true"
					className="block"
					height={height}
					width={panel.width}
				>
					{d ? <path className="fill-blue-500" d={d} /> : null}
				</svg>
				<span
					className="block pl-0.5 pt-0.5 text-gray-600 text-left text-xs truncate"
					style={{ height: labelHeight }}
				>
					{panel.label}
				</span>
			</>
		);

		return (
			<span className="block" key={panel.key} style={{ width: panel.width }}>
				{panel.detail ? (
					<Popover
						align="center"
						alignOffset={0}
						sideOffset={8}
						trigger={
							<button
								aria-label={`${panel.label} sequence details`}
								className="block w-full cursor-pointer border-0 bg-transparent px-0 pb-0 text-left hover:bg-blue-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-700"
								style={{ paddingTop: topPadding }}
								type="button"
							>
								{body}
							</button>
						}
					>
						{panel.detail}
					</Popover>
				) : (
					<span className="block" style={{ paddingTop: topPadding }}>
						{body}
					</span>
				)}
			</span>
		);
	}

	// The height is fixed rather than left to the panels, so the box does not
	// collapse in the frame before the container has been measured.
	const style = { gap, height: height + labelHeight + topPadding };

	// The border and padding sit on the outer element and the width is measured on
	// the inner one, because `useElementSize` reports `offsetWidth` — a border-box
	// figure. Measuring the bordered element would size the chart to two pixels
	// wider than the box it has to fit inside.
	//
	// The two roles are spelled out rather than chosen into one `role` expression
	// because `useAriaPropsSupportedByRole` can only check a literal, and an
	// unchecked `aria-label` is worth less than the duplication costs.
	return (
		<span className="block bg-blue-100 border border-blue-200 rounded-sm">
			{interactive ? (
				// biome-ignore lint/a11y/useSemanticElements: a fieldset groups form controls, not a set of related graphics
				<span
					aria-label={description}
					className="flex"
					ref={ref}
					role="group"
					style={style}
				>
					{laidOut.map(renderPanel)}
				</span>
			) : (
				<span
					aria-label={description}
					className="flex"
					ref={ref}
					role="img"
					style={style}
				>
					{laidOut.map(renderPanel)}
				</span>
			)}
		</span>
	);
}
