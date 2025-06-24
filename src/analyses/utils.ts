import { formatIsolateName } from "@app/utils";
import {
    cloneDeep,
    compact,
    fill,
    filter,
    flatMap,
    fromPairs,
    has,
    includes,
    keys,
    map,
    max,
    maxBy,
    min,
    minBy,
    reduce,
    reject,
    sortBy,
    startsWith,
    sum,
    sumBy,
    toNumber,
    uniq,
    unzip,
    zipWith,
} from "lodash-es";
import {
    FormattedIimiAnalysis,
    FormattedIimiHit,
    FormattedIimiIsolate,
    FormattedIimiSequence,
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
    return filter(orfs, (orf) => orf.hits.length).length;
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
        flatMap(orfs, (orf) => flatMap(orf.hits, (hit) => keys(hit.families))),
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
    const filled = Array(length);

    if (!align) {
        return fill(filled, 0);
    }

    const coords = fromPairs(align);

    let prev = 0;

    return map(filled, (depth, i) => {
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

    const hits = map(detail.results.hits, (hit) => ({
        ...hit,
        id: toNumber(hit.index),
        annotatedOrfCount: calculateAnnotatedOrfCount(hit.orfs),
        e: calculateSequenceMinimumE(hit.orfs),
        families: extractFamilies(hit.orfs),
        names: extractNames(hit.orfs),
    }));

    const longestSequence = maxBy(hits, (hit) => hit.sequence.length);

    const { cache, created_at, id, ready, user, workflow } = detail;

    return {
        cache,
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
    const coverages = map(isolates, (isolate) => isolate.filled);

    return map(longest.filled, (depth, index) =>
        max(map(coverages, (coverage) => coverage[index])),
    );
}

export function formatSequence(sequence, readCount) {
    return {
        ...sequence,
        filled: fillAlign(sequence),
        reads: sequence.pi * readCount,
    };
}

export function formatPathoscopeData(detail) {
    if (detail.results === null || detail.results.hits.length === 0) {
        return detail;
    }

    const {
        cache,
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

    const hits = map(results.hits, (otu) => {
        const isolateNames = [];

        // Go through each isolate associated with the OTU, adding properties for weight, read count,
        // median depth, and coverage. These values will be calculated from the sequences owned by each isolate.
        const isolates = map(otu.isolates, (isolate) => {
            // Make a name for the isolate by joining the source type and name, eg. "Isolate" + "Q47".
            const name = formatIsolateName(isolate);

            isolateNames.push(name);

            const sequences = sortBy(
                map(isolate.sequences, (sequence) =>
                    formatSequence(sequence, readCount),
                ),
                "length",
            );

            const filled = flatMap(sequences, "filled");

            // Coverage is the number of non-zero depth positions divided by the total number of positions.
            const coverage = compact(filled).length / filled.length;

            return {
                ...isolate,
                name,
                filled,
                coverage,
                sequences,
                maxDepth: max(filled),
                pi: sumBy(sequences, "pi"),
                depth: median(filled),
            };
        });

        const filled = mergeCoverage(isolates);
        const pi = sumBy(isolates, "pi");

        return {
            ...otu,
            filled,
            pi,
            isolates: sortBy(isolates, "coverage").reverse(),
            coverage: maxBy(isolates, "coverage").coverage,
            depth: median(filled),
            isolateNames: reject(uniq(isolateNames), "Unnamed Isolate"),
            maxGenomeLength: maxBy(isolates, "filled.length").length,
            maxDepth: maxBy(isolates, "maxDepth").maxDepth,
            reads: pi * readCount,
        };
    });

    return {
        cache,
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
    if (startsWith(detail?.workflow, "pathoscope")) {
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
    return includes(supportedWorkflows, workflow);
}

/**
 * Take an iimi otu and add exrta blargh fix later, hiiiii ian
 *
 * @param iimiOTU - the raw otu to be processed before display
 *
 * @returns Iimi otu with derived values for display
 */
function formatIimiData(detail: IimiAnalysis): FormattedIimiAnalysis {
    const hits = map(detail.results.hits, (hit: IimiHit): FormattedIimiHit => {
        const isolates = map(
            hit.isolates,
            (isolate: IimiIsolate): FormattedIimiIsolate => {
                const sequences = map(
                    isolate.sequences,
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

        const probability = reduce(
            hit.isolates,
            (result: number, isolate: IimiIsolate) => {
                return max([
                    result,
                    ...map(
                        isolate.sequences,
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
        unzip(map(isolates, "sequences")),
        (seqs) => seqs[0]?.length,
    );

    const compositedCoverage = map(combined_sequences, (seqs) => {
        const filteredSeqs = filter(seqs);
        return maxSequences(
            map(filteredSeqs, (seq: FormattedIimiSequence) => {
                return seq.coverage;
            }),
        );
    });

    const totalSequenceLength = map(
        compositedCoverage,
        (seq) => seq.length,
    ).reduce((a, b) => a + b, 0);

    const totalCoveredPositions = sum(
        map(compositedCoverage, (seq) => {
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
    return zipWith(...sequences, (...args) => max(args));
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
