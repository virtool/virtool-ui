import type { GroupMinimal } from "./groups";
import type { JobNested } from "./jobs";
import type { LabelNested } from "./labels";
import type { SearchResultV2 } from "./search";
import type { SubtractionNested } from "./subtractions";
import type { UserNested } from "./users";

/** The library preparation used to create a sample. */
export type LibraryType = "amplicon" | "srna" | "other" | "normal";

/** The state of a single workflow for a sample. */
export type WorkflowState = "complete" | "pending" | "none" | "incompatible";

/** The state of each workflow tracked for a sample. */
export type SampleWorkflows = {
	/** The state of the NuVs workflow */
	nuvs: WorkflowState;

	/** The state of the Pathoscope workflow */
	pathoscope: WorkflowState;
};

/**
 * The creation job embedded in a sample. A job nested in a sample is always the
 * `create_sample` job that built it.
 */
export type SampleJobNested = JobNested & { workflow: "create_sample" };

/** An artifact produced while creating a sample. */
export type SampleArtifact = {
	downloadUrl: string;
	id: number;
	name: string;
	size: number;
};

/** An input upload embedded in a sample reads file. */
export type SampleReadUpload = {
	id: number;
	name: string;
	size: number | null;
	uploadedAt: string | null;
	user: UserNested | null;
};

/** A reads file that makes up a sample. */
export type Read = {
	downloadUrl: string;
	id: number;
	name: string;
	nameOnDisk: string;
	sample: number;
	size: number;
	upload?: SampleReadUpload | null;
	uploadedAt: string;
};

/** The FastQC quality charts associated with a sample. */
export type Quality = {
	/** Data for the per-base quality chart */
	bases: number[][];

	/** Data for the composition chart */
	composition: number[][];

	/** The read count of the sample */
	count: number;

	/** The quality-score encoding */
	encoding: string;

	/** The GC content of the sample as a percentage */
	gc: number;

	/** The read-length range */
	length: number[];

	/** Data for the sequences chart */
	sequences: number[];
};

/** A sample reduced to the fields shown in resource listings. */
export type SampleMinimal = {
	createdAt: string;
	host: string;
	id: number;
	isolate: string;
	job?: SampleJobNested;
	labels: LabelNested[];
	libraryType: LibraryType;
	name: string;
	notes: string;
	nuvs: boolean | string;
	pathoscope: boolean | string;
	ready: boolean;
	user: UserNested;
	workflows: SampleWorkflows;
};

/** A complete sample, as returned by the detail endpoint. */
export type Sample = SampleMinimal & {
	allRead: boolean;
	allWrite: boolean;
	artifacts: SampleArtifact[];
	format: string;
	group: GroupMinimal | null;
	groupRead: boolean;
	groupWrite: boolean;
	hold: boolean;
	isLegacy: boolean;
	locale: string;
	paired: boolean;
	quality: Quality | null;
	reads: Read[];
	subtractions: SubtractionNested[];
};

/** A page of samples with pagination metadata. */
export type SampleSearchResult = SearchResultV2 & {
	items: SampleMinimal[];
};

/** The rights fields that can be changed on a sample. */
export type SampleRightsUpdate = {
	allRead?: boolean;
	allWrite?: boolean;
	group?: number | string | null;
	groupRead?: boolean;
	groupWrite?: boolean;
};
