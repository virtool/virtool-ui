/**
 * Every path this workflow writes under its work path.
 *
 * One module, because several of these are shared between steps and a second
 * spelling of one is a file-not-found at best and a stale read at worst. The
 * layout is Python's `fixtures.py` verbatim — a cached mapping index restored
 * from Python's namespace unpacks to the directory names below, so they are part
 * of the cache contract rather than a local convention.
 */

import { join } from "node:path";
import { INDEX_SQLITE_FILE_NAME } from "@virtool/workflow";

/** The reference index artifact, as downloaded from object storage. */
export function sourceIndexPath(workPath: string, indexId: number): string {
	return join(workPath, "indexes", String(indexId), INDEX_SQLITE_FILE_NAME);
}

/**
 * The collapsed reference this workflow writes and then reads back.
 *
 * Named `virtool-index-sqlite-v1.sqlite` like the source, not `index.sqlite`:
 * the collapsed file is an artifact of the same format and the filename is what
 * distinguishes it from an incompatible future one before it is opened.
 */
export function collapsedReferencePath(workPath: string): string {
	return join(workPath, "collapsed_reference", INDEX_SQLITE_FILE_NAME);
}

/**
 * The directory the collapsed reference lives in.
 *
 * This is what is archived into the cache, so its basename is the archive's
 * single top-level entry and restoring it recreates the path above.
 */
export function collapsedReferenceDir(workPath: string): string {
	return join(workPath, "collapsed_reference");
}

/** The bowtie2 index prefix over the collapsed default isolates. */
export function referenceIndexPrefix(workPath: string): string {
	return join(workPath, "reference_index", "reference");
}

/** The gzipped source FASTA a subtraction is downloaded to. */
export function subtractionFastaPath(
	workPath: string,
	subtractionId: number,
): string {
	return join(
		workPath,
		"subtractions",
		String(subtractionId),
		"subtraction.fa.gz",
	);
}

export function subtractionIndexesDir(workPath: string): string {
	return join(workPath, "subtraction_indexes");
}

export function subtractionIndexDir(
	workPath: string,
	subtractionId: number,
): string {
	return join(subtractionIndexesDir(workPath), String(subtractionId));
}

/** The bowtie2 index prefix for one subtraction. */
export function subtractionIndexPrefix(
	workPath: string,
	subtractionId: number,
): string {
	return join(subtractionIndexDir(workPath, subtractionId), "subtraction");
}

export function isolatesDir(workPath: string): string {
	return join(workPath, "isolates");
}

/** Every sequence of every candidate OTU. */
export function isolateFastaPath(workPath: string): string {
	return join(isolatesDir(workPath), "isolate_index.fa");
}

/** The bowtie2 index prefix over {@link isolateFastaPath}. */
export function isolateIndexPrefix(workPath: string): string {
	return join(isolatesDir(workPath), "isolates");
}

/** Reads that aligned to an isolate, written by `bowtie2 --al`. */
export function isolateFastqPath(workPath: string): string {
	return join(isolatesDir(workPath), "isolate_mapped.fq");
}

/** Alignments against the isolate index. */
export function isolateBamPath(workPath: string): string {
	return join(isolatesDir(workPath), "to_isolates.bam");
}

/** The FASTQ carried from one subtraction pass to the next, read and written in place. */
export function currentFastqPath(workPath: string): string {
	return join(workPath, "current_fastq.fq");
}

/** One subtraction pass's alignments, deleted at the end of that pass. */
export function toSubtractionBamPath(workPath: string): string {
	return join(workPath, "to_subtraction.bam");
}

/** The BAM carried from one subtraction pass to the next. */
export function workingIsolateBamPath(workPath: string): string {
	return join(workPath, "working_isolate.bam");
}

/** The alignments left after every subtraction has been eliminated. */
export function subtractedBamPath(workPath: string): string {
	return join(workPath, "subtracted.bam");
}
