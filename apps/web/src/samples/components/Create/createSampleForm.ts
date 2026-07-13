import { getSampleNameFromReads } from "@samples/utils";
import {
	buildReadRows,
	getReadRowKey,
	getReadRowReads,
} from "@uploads/pairing";
import type { Upload } from "@uploads/types";

/** A sample to be created, and the read files it will be created from. */
export type SampleDraft = {
	/** Identifies the draft, and the form row that edits it */
	key: string;

	/** The read files, in [LEFT, RIGHT] order */
	reads: Upload[];
};

/** The values collected for one sample in the create-sample form. */
export type SampleValues = {
	/** The key of the draft the sample is created from */
	key: string;

	host: string;
	isolate: string;
	labels: number[];
	locale: string;
	name: string;
	subtractionIds: string[];
};

/**
 * The values collected by the create-sample form. The library type and group
 * are set once and shared by every sample being created.
 */
export type CreateSampleFormValues = {
	group: string;
	libraryType: string;
	samples: SampleValues[];
};

/**
 * Groups selected read files into the samples that will be created from them,
 * collapsing a detected mate pair into one paired sample rather than two single
 * ones.
 *
 * Pairing is detected among the selected files alone: selecting one mate of a
 * pair creates an unpaired sample from it, because the other mate wasn't asked
 * for.
 *
 * @param uploads - the selected read files
 */
export function getSampleDrafts(uploads: Upload[]): SampleDraft[] {
	return buildReadRows(uploads).map((row) => ({
		key: getReadRowKey(row),
		reads: getReadRowReads(row),
	}));
}

/**
 * The initial form values for creating a sample from each draft. Every sample
 * is named after the read files it will be created from, and left for the user
 * to edit.
 *
 * @param drafts - the samples to be created
 */
export function getCreateSampleFormValues(
	drafts: SampleDraft[],
): CreateSampleFormValues {
	return {
		group: "",
		libraryType: "normal",
		samples: drafts.map((draft) => ({
			key: draft.key,
			host: "",
			isolate: "",
			labels: [],
			locale: "",
			name: getSampleNameFromReads(draft.reads),
			subtractionIds: [],
		})),
	};
}
