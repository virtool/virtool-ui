import { FormattedNuvsHit, FormattedNuvsResults } from "@/analyses/types";
import { Button, Dialog, DialogContent, DialogFooter, DialogOverlay, DialogTitle, Icon } from "@base";
import { ToggleGroup } from "@base/ToggleGroup";
import { ToggleGroupItem } from "@base/ToggleGroupItem";
import { DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import { followDynamicDownload } from "@utils/utils";
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
        { name: null, e: 10 }
    );
}

function exportContigData(hits: FormattedNuvsHit[], sampleName: string) {
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
            []
        );
        return `>sequence_${result.index}|${sampleName}|${orfNames.join("|")}\n${result.sequence}`;
    });
}

function exportORFData(hits: FormattedNuvsHit[], sampleName: string) {
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
        []
    );
}

function downloadData(analysisId: string, content: string[], sampleName: string, suffix: string) {
    return followDynamicDownload(
        `nuvs.${replace(sampleName, " ", "_")}.${analysisId}.${suffix}.fa`,
        content.join("\n")
    );
}

export type NuVsExportProps = {
    analysisId: string;
    /** All results for a NuVs analysis */
    results: FormattedNuvsResults;
    sampleName: string;
};

/**
 * Displays a dialog for exporting NuVs
 */
export default function NuVsExport({ analysisId, results, sampleName }: NuVsExportProps) {
    const [mode, setMode] = useState("contigs");
    const [open, setOpen] = useState(false);

    function onSubmit(e) {
        e.preventDefault();

        if (mode === "contigs") {
            downloadData(analysisId, exportContigData(results.hits, sampleName), sampleName, "configs");
        } else {
            downloadData(analysisId, exportORFData(results.hits, sampleName), sampleName, "orfs");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button as={DialogTrigger} color="gray">
                Export
            </Button>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Export Analysis</DialogTitle>
                    <form onSubmit={onSubmit}>
                        <label>Scope</label>

                        <ToggleGroup className="flex mb-3" value={mode} onValueChange={setMode}>
                            <ToggleGroupItem value="contigs">Contigs</ToggleGroupItem>
                            <ToggleGroupItem value="orfs">ORFs</ToggleGroupItem>
                        </ToggleGroup>

                        <NuVsExportPreview mode={mode} />

                        <DialogFooter>
                            <Button type="submit" className="inline-flex gap-1.5">
                                <Icon name="download" /> Download
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
