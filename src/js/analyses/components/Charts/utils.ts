import { filter, reduce, zipWith } from "lodash-es";
import { IimiSequence, UntrustworthyRange } from "../../types";
/**
 * Convert range length encoded data into an array of depth values.
 *
 * @param lengths - the lengths of a given read depth region
 * @param rle - the depth values of the regions
 *
 * @returns An array of depth values
 */
export function convertRleToCoverage(lengths: Array<number>, rle: Array<number>) {
    const coverage = [];

    for (let sharedIndex = 0; sharedIndex < lengths.length; sharedIndex++) {
        const length = lengths[sharedIndex];
        const value = rle[sharedIndex];

        coverage.push(...Array(length).fill(value));
    }

    return coverage;
}

/**
 * Average the read depths of an array of sequences.
 *
 * @param sequences - the sequences to average
 * @returns An averaged sequence
 */
export function averageSequences(sequences: IimiSequence[]) {
    return zipWith(...sequences, (...args) => {
        const filtered = filter(args, num => typeof num === "number");
        return filtered.length === 0 ? 0 : reduce(filtered, (a, b) => a + b) / filtered.length;
    });
}

/**
 * Determine the regions of the sequence that are trustworthy using the untrustworthy regions.
 *
 * @param length - The length of the sequence
 * @param untrustworthyRanges - the untrustworthy regions to infer trustworthy regions from
 */
export function deriveTrustworthyRegions(length: number, untrustworthyRanges: [number, number][]): [number, number][] {
    const trustworthyRanges = [];
    let start = 1;
    let end;

    untrustworthyRanges.forEach(range => {
        end = range[0];
        trustworthyRanges.push([start, end]);
        start = range[1];
    });

    trustworthyRanges.push([start, length]);
    return trustworthyRanges;
}

/**
 * Construct a union of untrustworthy regions from multiple sources.
 *
 * @param untrustworthyRanges - A collection of untrustworthy regions to combine
 * @returns the combined untrustworthy regions
 */
export function combineUntrustworthyRegions(untrustworthyRanges: UntrustworthyRange[][]): UntrustworthyRange[] {
    const sortedUntrustworthyRanges = untrustworthyRanges.flat().sort((a, b) => a[0] - b[0]);

    if (sortedUntrustworthyRanges.length === 0) {
        return [];
    }

    const combined = [] as [number, number][];
    combined.push(sortedUntrustworthyRanges.shift());

    sortedUntrustworthyRanges.forEach(range => {
        const last = combined[combined.length - 1];

        if (range[0] <= last[1]) {
            last[1] = range[1];
        } else {
            combined.push(range);
        }
    });

    return combined;
}
