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

/** The values collected for one sample in the multi-sample creation form. */
export type CreateSamplesSampleValues = {
	/** The key of the draft the sample is created from */
	key: string;

	labels: number[];
	name: string;
	subtractionIds: string[];
};

/**
 * The values collected by the multi-sample creation form. The library type and
 * group are set once and shared by every sample in the batch.
 */
export type CreateSamplesFormValues = {
	group: string;
	libraryType: string;
	samples: CreateSamplesSampleValues[];
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
export function getCreateSamplesDefaultValues(
	drafts: SampleDraft[],
): CreateSamplesFormValues {
	return {
		group: "",
		libraryType: "normal",
		samples: drafts.map((draft) => ({
			key: draft.key,
			labels: [],
			name: getSampleNameFromReads(draft.reads),
			subtractionIds: [],
		})),
	};
}
