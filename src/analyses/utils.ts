import { formatIsolateName } from "@app/utils";
import { compact, uniq, unzip } from "es-toolkit/array";
import {
    flatMap,
    has,
    max,
    maxBy,
    min,
    minBy,
    reject,
    sortBy,
    sum,
    sumBy,
} from "es-toolkit/compat";
import { cloneDeep } from "es-toolkit/object";
import {
    FormattedIimiAnalysis,
    FormattedIimiHit,
    FormattedIimiIsolate,
    FormattedIimiSequence,
    FormattedPathoscopeAnalysis,
    FormattedPathoscopeIsolate,
    IimiAnalysis,
    IimiHit,
    IimiIsolate,
    IimiSequence,
    NuvsOrf,
    PositionMappedReadDepths,
    UntrustworthyRange,
} from "./types";

export function calculateAnnotatedOrfCount(orfs) {
    return orfs.filter((orf) => orf.hits.length).length;
}

function calculateSequenceMinimumE(orfs: NuvsOrf[]) {
    if (orfs.length) {
        return min(
            orfs.map((orf) =>
                orf.hits.length ? minBy(orf.hits, "full_e").full_e : 0,
            ),
        );
    }
}

export function extractFamilies(orfs) {
    const families = uniq(
        flatMap(orfs, (orf) =>
            flatMap(orf.hits, (hit) => Object.keys(hit.families)),
        ),
    );
    return reject(families, (f) => f === "None");
}

export function extractNames(orfs) {
    return uniq(flatMap(orfs, (orf) => flatMap(orf.hits, (hit) => hit.names)));
}

type FillAlignParams = {
    align?: number[][];
    length: number;
};

/**
 * Transform an array of coordinate pairs into an flat array where the index is the x coordinate and the value is the y
 * coordinate.
 *
 * @param {Array} align - the coordinates
 * @param length - the length of the generated flat array
 */
export function fillAlign({ align, length }: FillAlignParams) {
    if (!align) {
        return Array(length).fill(0);
    }

    const coords = Object.fromEntries(align);

    let prev = 0;

    return Array.from({ length }, (_, i) => {
        if (has(coords, i)) {
            prev = coords[i];
        }

        return prev;
    });
}

export function formatNuvsData(detail) {
    if (detail.results === null) {
        return detail;
    }

    const hits = detail.results.hits.map((hit) => ({
        ...hit,
        id: Number(hit.index),
        annotatedOrfCount: calculateAnnotatedOrfCount(hit.orfs),
        e: calculateSequenceMinimumE(hit.orfs),
        families: extractFamilies(hit.orfs),
        names: extractNames(hit.orfs),
    }));

    const longestSequence = hits.reduce((longest, hit) =>
        hit.sequence.length > (longest?.sequence?.length ?? 0) ? hit : longest,
    );

    const { created_at, id, ready, user, workflow } = detail;

    return {
        created_at,
        id,
        ready,
        results: {
            ...detail.results,
            hits,
        },
        user,
        workflow,
        maxSequenceLength: longestSequence.sequence.length,
    };
}

/**
 * Calculate the median of an Array of numbers.
 *
 * @param values - an array of numbers
 */
export function median(values: number[]): number {
    const sorted = values.slice().sort((a, b) => a - b);

    const midIndex = (sorted.length - 1) / 2;

    if (midIndex % 1 === 0) {
        return sorted[midIndex];
    }

    const lowerIndex = Math.floor(midIndex);
    const upperIndex = Math.ceil(midIndex);

    return Math.round((sorted[lowerIndex] + sorted[upperIndex]) / 2);
}

/**
 * Merge the coverage arrays for the given isolates.
 *
 * This is used to render a representative coverage chart for the parent OTU.
 */
export function mergeCoverage(
    isolates: FormattedPathoscopeIsolate[],
): number[] {
    const longest = maxBy(isolates, (isolate) => isolate.filled.length);
    const coverages = isolates.map((isolate) => isolate.filled);

    return longest.filled.map((depth, index) =>
        max(coverages.map((coverage) => coverage[index])),
    );
}

export function formatSequence(sequence, readCount) {
    return {
        ...sequence,
        filled: fillAlign(sequence),
        reads: sequence.pi * readCount,
    };
}

export function formatPathoscopeData(detail): FormattedPathoscopeAnalysis {
    if (detail.results === null || detail.results.hits.length === 0) {
        return detail;
    }

    const {
        created_at,
        results,
        id,
        index,
        ready,
        reference,
        subtractions,
        user,
        workflow,
    } = detail;

    const readCount = results.read_count;

    const hits = results.hits.map((otu) => {
        const isolateNames = [];

        // Go through each isolate associated with the OTU, adding properties for weight, read count,
        // median depth, and coverage. These values will be calculated from the sequences owned by each isolate.
        const isolates = otu.isolates.map((isolate) => {
            // Make a name for the isolate by joining the source type and name, eg. "Isolate" + "Q47".
            const name = formatIsolateName(isolate);

            isolateNames.push(name);

            const sequences = sortBy(
                isolate.sequences.map((sequence) =>
                    formatSequence(sequence, readCount),
                ),
                "length",
            );

            const filled = sequences.flatMap((seq) => seq.filled);

            // Coverage is the number of non-zero depth positions divided by the total number of positions.
            const coverage =
                filled.length === 0
                    ? 0
                    : compact(filled).length / filled.length;

            return {
                ...isolate,
                name,
                filled,
                coverage,
                sequences,
                maxDepth: max(filled),
                pi: sumBy(sequences, (seq) => seq.pi),
                depth: median(filled),
            };
        });

        const filled = mergeCoverage(isolates);
        const pi = isolates.reduce((sum, isolate) => sum + isolate.pi, 0);

        const maxCoverageIsolate = isolates.reduce((maxIsolate, isolate) =>
            isolate.coverage > maxIsolate.coverage ? isolate : maxIsolate,
        );
        const maxFilledLengthIsolate = isolates.reduce((maxIsolate, isolate) =>
            isolate.filled.length > maxIsolate.filled.length
                ? isolate
                : maxIsolate,
        );
        const maxDepthIsolate = isolates.reduce((maxIsolate, isolate) =>
            isolate.maxDepth > maxIsolate.maxDepth ? isolate : maxIsolate,
        );

        return {
            ...otu,
            filled,
            pi,
            isolates: sortBy(isolates, (i) => i.coverage).reverse(),
            coverage: maxCoverageIsolate.coverage,
            depth: median(filled),
            isolateNames: reject(
                uniq(isolateNames),
                (name) => name === "Unnamed Isolate",
            ),
            maxGenomeLength: maxFilledLengthIsolate.filled.length,
            maxDepth: maxDepthIsolate.maxDepth,
            reads: pi * readCount,
        };
    });

    return {
        ...detail,
        created_at,
        id,
        index,
        reference,
        ready,
        results: {
            hits,
            readCount,
            subtractedCount: detail.results.subtracted_count,
        },
        subtractions,
        user,
        workflow,
    };
}

export function formatData(detail) {
    if (detail?.workflow?.startsWith("pathoscope")) {
        return formatPathoscopeData(detail);
    }

    if (detail?.workflow === "nuvs") {
        return formatNuvsData(detail);
    }

    if (detail?.workflow === "iimi") {
        return formatIimiData(detail);
    }

    return detail;
}

const supportedWorkflows = ["pathoscope_bowtie", "nuvs", "iimi"];

export function checkSupportedWorkflow(workflow) {
    return supportedWorkflows.includes(workflow);
}

/**
 * Take an iimi otu and add exrta blargh fix later, hiiiii ian
 *
 * @param iimiOTU - the raw otu to be processed before display
 *
 * @returns Iimi otu with derived values for display
 */
function formatIimiData(detail: IimiAnalysis): FormattedIimiAnalysis {
    const hits = detail.results.hits.map((hit: IimiHit): FormattedIimiHit => {
        const isolates = hit.isolates.map(
            (isolate: IimiIsolate): FormattedIimiIsolate => {
                const sequences = isolate.sequences.map(
                    (sequence: IimiSequence): FormattedIimiSequence => {
                        const maxDepth = Math.max(...sequence.coverage.values);
                        const coverage = convertRleToCoverage(
                            sequence.coverage.lengths,
                            sequence.coverage.values,
                        );
                        return { ...sequence, maxDepth, coverage };
                    },
                );

                return { ...isolate, sequences };
            },
        );

        const probability = hit.isolates.reduce(
            (result: number, isolate: IimiIsolate) => {
                return max([
                    result,
                    ...isolate.sequences.map(
                        (sequence: IimiSequence) => sequence.probability,
                    ),
                ]);
            },
            0,
        );

        const coverage = calculateCombinedCoveragePercent(isolates);

        return { ...hit, coverage, probability, isolates };
    });

    return { ...detail, results: { hits } };
}

function calculateCombinedCoveragePercent(isolates: FormattedIimiIsolate[]) {
    const combined_sequences = sortBy(
        unzip(isolates.map((isolate) => isolate.sequences)),
        (seqs) => seqs[0]?.length,
    );

    const compositedCoverage = combined_sequences.map((seqs) => {
        const filteredSeqs = seqs.filter(Boolean);
        return maxSequences(
            filteredSeqs.map((seq: FormattedIimiSequence) => {
                return seq.coverage;
            }),
        );
    });

    const totalSequenceLength = compositedCoverage
        .map((seq) => seq.length)
        .reduce((a, b) => a + b, 0);

    const totalCoveredPositions = sum(
        compositedCoverage.map((seq) => {
            return seq.filter((pos) => pos > 0).length;
        }),
    );

    return totalCoveredPositions / totalSequenceLength;
}

/**
 * Convert range length encoded data into an array of depth values.
 *
 * @param lengths - the lengths of a given read depth region
 * @param rle - the depth values of the regions
 *
 * @returns An array of depth values
 */
export function convertRleToCoverage(
    lengths: Array<number>,
    rle: Array<number>,
): PositionMappedReadDepths {
    const coverage = [];

    for (let sharedIndex = 0; sharedIndex < lengths.length; sharedIndex++) {
        const length = lengths[sharedIndex];
        const value = rle[sharedIndex];

        coverage.push(...Array(length).fill(value));
    }

    return coverage;
}

/**
 * get the largest read depths of an array of sequences.
 *
 * @param sequences - the sequences to average
 * @returns An averaged sequence
 */
export function maxSequences(
    sequences: PositionMappedReadDepths[],
): PositionMappedReadDepths {
    if (sequences.length === 0) return [];
    const maxLength = Math.max(...sequences.map((s) => s.length));
    return Array.from({ length: maxLength }, (_, i) =>
        Math.max(...sequences.map((s) => s[i] ?? 0)),
    );
}

/**
 * Determine the regions of the sequence that are trustworthy using the untrustworthy regions.
 *
 * @param length - The length of the sequence
 * @param untrustworthyRanges - the untrustworthy regions to infer trustworthy regions from
 */
export function deriveTrustworthyRegions(
    length: number,
    untrustworthyRanges: [number, number][],
): [number, number][] {
    const trustworthyRanges = [];
    let start = 1;
    let end;

    untrustworthyRanges.forEach((range) => {
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
export function combineUntrustworthyRegions(
    untrustworthyRanges: UntrustworthyRange[][],
): UntrustworthyRange[] {
    untrustworthyRanges = cloneDeep(untrustworthyRanges);

    const sortedUntrustworthyRanges = untrustworthyRanges
        .flat()
        .sort((a, b) => a[0] - b[0]);

    if (sortedUntrustworthyRanges.length === 0) {
        return [];
    }

    const combined = [sortedUntrustworthyRanges.shift()] as [number, number][];

    sortedUntrustworthyRanges.forEach((range) => {
        const last = combined[combined.length - 1];

        if (range[0] <= last[1]) {
            last[1] = range[1];
        } else {
            combined.push(range);
        }
    });

    return combined;
}
