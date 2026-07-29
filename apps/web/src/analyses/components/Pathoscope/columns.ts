// The geometry every isolate row lays its segment columns out on.
//
// A column's width is a function of the OTU's genome length and the segment's
// share of it, so every row computes the same number and the columns line up
// down the page — which is what `ScrollSyncContainer` scrolls them as. Sizing a
// column from the isolate's own sequences instead, as this once did, gave each
// row its own widths and left the rows unalignable.

/** The height of a sequence chart's plotting area. */
export const chartHeight = 120;

/** The space a chart leaves around its plotting area for the axes. */
export const chartMargin = 50;

// A genome long enough to need it is drawn at a fifth of a pixel per
// nucleotide; a short one at one pixel each.
const longGenome = 800;
const scale = 5;

// Short segments are floored rather than drawn proportionally, so a 200
// nucleotide segment beside a 12 kb one is still wide enough to read. Every row
// applies the same floor, so it costs nothing in alignment.
const minimumWidth = 120;

/** The width every isolate row gives the column of a segment. */
export function columnWidth(
	genomeLength: number,
	segmentLength: number,
): number {
	if (genomeLength <= 0) {
		return minimumWidth;
	}

	const base = genomeLength > longGenome ? genomeLength / scale : genomeLength;

	return Math.max((base * segmentLength) / genomeLength, minimumWidth);
}
