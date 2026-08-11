import { copyFile, rename, rm } from "node:fs/promises";
import { eliminateSubtraction, subtractionProc } from "../pathoscopeCore";
import { workPaths } from "../paths";
import type { PathoscopeStep } from "./types";

/**
 * Drop reads that align at least as well to a host genome as to a virus.
 *
 * A plant sample is mostly plant, and a read from a host region that resembles a
 * viral sequence would otherwise be counted as a detection. Each subtraction is
 * a separate pass over what the previous one left, so the alignments and the
 * FASTQ both roll forward.
 */
export const eliminateSubtractionStep: PathoscopeStep = {
	id: "eliminate_subtraction",
	description:
		"Remove reads that map better to a subtraction than to a reference.",
	async run({ data, logger, proc, runSubprocess, state, workPath }) {
		const paths = workPaths(workPath);

		if (state.candidateSequenceIds.length === 0) {
			logger.info("no candidate otus; nothing to subtract");

			return;
		}

		if (data.subtractions.length === 0) {
			logger.info("no subtractions to eliminate reads against");

			// Renamed rather than copied. The isolate alignments are already what
			// the reassignment step needs, and they run to gigabytes.
			await rename(paths.isolateBam, paths.subtractedBam);

			return;
		}

		const currentFastq = paths.currentFastq;
		const toSubtraction = paths.toSubtractionBam;

		// Copied so the reads bowtie2 wrote with `--al` survive untouched; the
		// working copy is replaced by each subtraction pass in turn.
		await copyFile(paths.isolateFastq, currentFastq);

		let currentBam = paths.isolateBam;

		for (const subtraction of data.subtractions) {
			const log = logger.child({
				subtractionId: subtraction.id,
				subtractionName: subtraction.name,
			});

			log.info("processing subtraction");

			const bowtie2 = [
				"bowtie2",
				"--local",
				"--no-unal",
				"-N 0",
				`-p ${proc}`,
				`-x ${quote(paths.subtraction(subtraction.id).indexPrefix)}`,
				`-U ${currentFastq}`,
			].join(" ");

			await runSubprocess({
				command: [
					"bash",
					"-c",
					`${bowtie2} | samtools view -bS - -o ${toSubtraction}`,
				],
			});

			const eliminated = await eliminateSubtraction(
				{
					runSubprocess,
					outputPath: paths.coreResults("eliminate-subtraction"),
				},
				{
					inputFastqPath: currentFastq,
					outputFastqPath: paths.filteredFastq,
					isolateAlignmentsPath: currentBam,
					subtractionAlignmentsPath: toSubtraction,
					outputAlignmentsPath: paths.subtractedBam,
					proc: subtractionProc(proc),
				},
			);

			// The core truncates its output FASTQ before reading its input, so the
			// filtered reads are staged beside the file they replace. Renamed rather
			// than copied: same directory, so it is atomic, and the FASTQ runs to
			// gigabytes.
			await rename(paths.filteredFastq, currentFastq);

			await rm(toSubtraction, { force: true });

			// Moved aside so the next pass can write `subtracted.bam` again, and
			// becomes that pass's input.
			await rename(paths.subtractedBam, paths.workingIsolateBam);

			currentBam = paths.workingIsolateBam;
			state.subtractedCount += eliminated;

			log.info(
				{ eliminated, total: state.subtractedCount },
				"subtraction complete",
			);
		}

		await rename(currentBam, paths.subtractedBam);
	},
};

/**
 * Quote a path for the shell.
 *
 * Only the subtraction index prefix goes through this, matching Python. Every
 * path here is composed from the work path and an integer id, so none can carry
 * a metacharacter — this is a guard against that stopping being true, not a
 * response to untrusted input.
 */
function quote(value: string): string {
	return `'${value.replaceAll("'", `'\\''`)}'`;
}
