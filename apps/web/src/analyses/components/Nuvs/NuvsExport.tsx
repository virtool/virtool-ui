import type {
	FormattedNuvsHit,
	FormattedNuvsResults,
	NuvsOrfHit,
} from "@analyses/types";
import { followDynamicDownload } from "@app/utils";
import Button from "@base/Button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "@base/Dialog";
import Icon from "@base/Icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@base/Tabs";
import { Download } from "lucide-react";
import { type FormEvent, useState } from "react";
import NuvsExportPreview from "./NuvsExportPreview";

function getBestHit(items: NuvsOrfHit[]) {
	return items.reduce<{ name: string | null; e: number }>(
		(best, hit) => {
			if (hit.full_e < best.e) {
				best.e = hit.full_e;
				best.name = hit.names[0] ?? null;
			}

			return best;
		},
		{ name: null, e: 10 },
	);
}

function exportContigData(hits: FormattedNuvsHit[], sampleName: string) {
	return hits.map((result) => {
		const orfNames = result.orfs.reduce<string[]>((names, orf) => {
			// Get the best hit for the current ORF.
			if (orf.hits.length) {
				const bestHit = getBestHit(orf.hits);

				if (bestHit.name) {
					names.push(bestHit.name);
				}
			}

			return names;
		}, []);
		return `>sequence_${result.index}|${sampleName}|${orfNames.join("|")}\n${result.sequence}`;
	});
}

function exportOrfData(hits: FormattedNuvsHit[], sampleName: string) {
	return hits.reduce<string[]>((lines, result) => {
		result.orfs.forEach((orf) => {
			// Get the best hit for the current ORF.
			if (orf.hits.length) {
				const bestHit = getBestHit(orf.hits);

				if (bestHit.name) {
					lines.push(
						`>orf_${result.index}_${orf.index}|${sampleName}|${bestHit.name}\n${orf.pro}`,
					);
				}
			}
		});

		return lines;
	}, []);
}

function downloadData(
	analysisId: string,
	content: string[],
	sampleName: string,
	suffix: string,
) {
	return followDynamicDownload(
		`nuvs.${sampleName.replace(" ", "_")}.${analysisId}.${suffix}.fa`,
		content.join("\n"),
	);
}

export type NuvsExportProps = {
	analysisId: string;
	/** All results for a Nuvs analysis */
	results: FormattedNuvsResults;
	sampleName: string;
};

/**
 * Displays a dialog for exporting Nuvs
 */
export default function NuvsExport({
	analysisId,
	results,
	sampleName,
}: NuvsExportProps) {
	const [mode, setMode] = useState("contigs");
	const [open, setOpen] = useState(false);

	function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (mode === "contigs") {
			downloadData(
				analysisId,
				exportContigData(results.hits, sampleName),
				sampleName,
				"contigs",
			);
		} else {
			downloadData(
				analysisId,
				exportOrfData(results.hits, sampleName),
				sampleName,
				"orfs",
			);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Button as={DialogTrigger} color="gray">
				Export
			</Button>
			<DialogContent>
				<DialogTitle>Export Analysis</DialogTitle>
				<form onSubmit={onSubmit}>
					<Tabs value={mode} onValueChange={setMode}>
						<TabsList aria-label="Scope" className="mb-3">
							<TabsTrigger value="contigs">Contigs</TabsTrigger>
							<TabsTrigger value="orfs">ORFs</TabsTrigger>
						</TabsList>
						<TabsContent value="contigs">
							<NuvsExportPreview mode="contigs" />
						</TabsContent>
						<TabsContent value="orfs">
							<NuvsExportPreview mode="orfs" />
						</TabsContent>
					</Tabs>

					<DialogFooter>
						<Button type="submit" className="inline-flex gap-1.5">
							<Icon icon={Download} /> Download
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
