/**
 * @copyright 2017 Government of Canada
 * @license MIT
 * @author igboyes
 *
 */
import { FormattedNuVsHit, FormattedNuVsResults } from "@/analyses/types";
import { Button, ButtonGroup, Dialog, DialogContent, DialogFooter, DialogOverlay, DialogTitle } from "@base";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useLocationState } from "@utils/hooks";
import { followDynamicDownload } from "@utils/utils";
import { merge } from "lodash";
import { forEach, map, reduce, replace } from "lodash-es";
import React, { useState } from "react";
import NuVsExportPreview from "./ExportPreview";

function getBestHit(items) {
    return reduce(
        items,
        (best, hit) => {
            if (hit.full_e < best.e) {
                best.e = hit.full_e;
                best.name = hit.names[0];
            }

            return best;
        },
        { name: null, e: 10 },
    );
}

function exportContigData(hits: FormattedNuVsHit[], sampleName: string) {
    return map(hits, result => {
        const orfNames = reduce(
            result.orfs,
            (names, orf) => {
                // Get the best hit for the current ORF.
                if (orf.hits.length) {
                    const bestHit = getBestHit(orf.hits);

                    if (bestHit.name) {
                        names.push(bestHit.name);
                    }
                }

                return names;
            },
            [],
        );
        return `>sequence_${result.index}|${sampleName}|${orfNames.join("|")}\n${result.sequence}`;
    });
}

function exportORFData(hits: FormattedNuVsHit[], sampleName: string) {
    return reduce(
        hits,
        (lines, result) => {
            forEach(result.orfs, orf => {
                // Get the best hit for the current ORF.
                if (orf.hits.length) {
                    const bestHit = getBestHit(orf.hits);

                    if (bestHit.name) {
                        lines.push(`>orf_${result.index}_${orf.index}|${sampleName}|${bestHit.name}\n${orf.pro}`);
                    }
                }
            });

            return lines;
        },
        [],
    );
}

function downloadData(analysisId: string, content: string[], sampleName: string, suffix: string) {
    return followDynamicDownload(
        `nuvs.${replace(sampleName, " ", "_")}.${analysisId}.${suffix}.fa`,
        content.join("\n"),
    );
}

type NuVsExportProps = {
    analysisId: string;
    /** All results for a NuVs analysis */
    results: FormattedNuVsResults;
    sampleName: string;
};

/**
 * Displays a dialog for exporting NuVs
 */
export default function NuVsExport({ analysisId, results, sampleName }: NuVsExportProps) {
    const [locationState, setLocationState] = useLocationState();
    const [mode, setMode] = useState("contigs");

    function onSubmit(e) {
        e.preventDefault();

        let content;
        let suffix;

        if (mode === "contigs") {
            content = exportContigData(results.hits, sampleName);
            suffix = "contigs";
        } else {
            content = exportORFData(results.hits, sampleName);
            suffix = "orfs";
        }

        downloadData(analysisId, content, sampleName, suffix);
    }

    return (
        <Dialog
            open={locationState?.export}
            onOpenChange={() => setLocationState(merge(locationState, { export: false }))}
        >
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Export Analysis</DialogTitle>
                    <form onSubmit={onSubmit}>
                        <ButtonGroup>
                            <Button type="button" active={mode === "contigs"} onClick={() => setMode("contigs")}>
                                Contigs
                            </Button>
                            <Button type="button" active={mode === "orfs"} onClick={() => setMode("orfs")}>
                                ORFs
                            </Button>
                        </ButtonGroup>

                        <NuVsExportPreview mode={mode} />
                        <DialogFooter>
                            <Button type="submit" icon="download">
                                Download
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
