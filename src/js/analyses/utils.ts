import { formatIsolateName } from "@utils/utils";
import {
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
    reject,
    sortBy,
    startsWith,
    sumBy,
    toNumber,
    uniq,
    zipWith,
} from "lodash-es";
import { cloneDeep } from "lodash-es/lodash";
import { PositionMappedReadDepths, UntrustworthyRange } from "./types";

export const calculateAnnotatedOrfCount = (orfs) =>
    filter(orfs, (orf) => orf.hits.length).length;

function calculateORFMinimumE(hits) {
    if (hits.length === 0) {
        return;
    }

    const minHit = minBy(hits, "full_e");
    return minHit.full_e;
}

function calculateSequenceMinimumE(orfs) {
    if (orfs.length === 0) {
        return;
    }

    const minEValues = map(orfs, (orf) => calculateORFMinimumE(orf.hits));
    return min(minEValues);
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

/**
 * Transform an array of coordinate pairs into an flat array where the index is the x coordinate and the value is the y
 * coordinate.
 *
 * @param {Array} align - the coordinates
 * @param {Number} length - the length of the generated flat array
 * @returns {Array} - the flat array
 *
 */
export const fillAlign = ({ align, length }) => {
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
};

function getIdentities(data) {
    return flatMap(data, (item) => item.identities);
}

const getSequenceIdentities = (sequence) =>
    flatMap(sequence.hits, (hit) => hit.identity);

export const formatAODPData = (detail) => {
    if (detail.results === null) {
        return detail;
    }

    const results = map(detail.results, (result) => {
        const isolates = map(result.isolates, (isolate) => {
            const sequences = map(isolate.sequences, (sequence) => {
                return {
                    ...sequence,
                    identities: getSequenceIdentities(sequence),
                };
            });

            return {
                ...isolate,
                sequences,
                identities: getIdentities(sequences),
            };
        });

        const identities = getIdentities(isolates);

        return {
            ...result,
            isolates,
            identities,
            identity: max(identities),
        };
    });

    return { ...detail, results };
};

export const formatNuVsData = (detail) => {
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
};

/**
 * Calculate the median of an Array of numbers.
 *
 * @param values - an array of numbers
 * @returns {number|*} - the median
 */
export const median = (values) => {
    const sorted = values.slice().sort((a, b) => a - b);

    const midIndex = (sorted.length - 1) / 2;

    if (midIndex % 1 === 0) {
        return sorted[midIndex];
    }

    const lowerIndex = Math.floor(midIndex);
    const upperIndex = Math.ceil(midIndex);

    return Math.round((sorted[lowerIndex] + sorted[upperIndex]) / 2);
};

/**
 * Merge the coverage arrays for the given isolates. This is used to render a representative coverage chart for the
 * parent OTU.
 *
 * @param isolates
 * @returns {Array}
 */
export const mergeCoverage = (isolates) => {
    const longest = maxBy(isolates, (isolate) => isolate.filled.length);
    const coverages = map(isolates, (isolate) => isolate.filled);
    return map(longest.filled, (depth, index) =>
        max(map(coverages, (coverage) => coverage[index])),
    );
};

export const formatSequence = (sequence, readCount) => ({
    ...sequence,
    filled: fillAlign(sequence),
    reads: sequence.pi * readCount,
});

export const formatPathoscopeData = (detail) => {
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
};

export const fuseSearchKeys = {
    pathoscope_bowtie: ["name", "abbreviation"],
    nuvs: ["families", "names"],
    aodp: ["name"],
};

export const formatData = (detail) => {
    if (startsWith(detail?.workflow, "pathoscope")) {
        return formatPathoscopeData(detail);
    }

    if (detail?.workflow === "nuvs") {
        return formatNuVsData(detail);
    }

    if (detail?.workflow === "aodp") {
        return formatAODPData(detail);
    }

    return detail;
};

const supportedWorkflows = ["pathoscope_bowtie", "nuvs", "aodp", "iimi"];

export function checkSupportedWorkflow(workflow) {
    return includes(supportedWorkflows, workflow);
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
) {
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
export function maxSequences(sequences: PositionMappedReadDepths[]) {
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
