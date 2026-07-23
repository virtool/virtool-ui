import type { GroupMinimal } from "./groups";
import type { LabelNested } from "./labels";
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

/** A lifecycle state a sample's creation job can be in. */
export type SampleJobState =
	| "cancelled"
	| "failed"
	| "pending"
	| "running"
	| "succeeded";

/** A workflow a sample's creation job can run. */
export type SampleJobWorkflow =
	| "build_index"
	| "create_sample"
	| "create_subtraction"
	| "nuvs"
	| "pathoscope";

/** The creation job embedded in a sample. */
export type SampleJobNested = {
	created_at: string;
	id: number;
	progress: number;
	state: SampleJobState;
	user: UserNested;
	workflow: SampleJobWorkflow;
};

/** An artifact produced while creating a sample. */
export type SampleArtifact = {
	download_url: string;
	id: number;
	name: string;
	size: number;
};

/** An input upload embedded in a sample reads file. */
export type SampleReadUpload = {
	id: number;
	name: string;
	size: number | null;
	uploaded_at: string | null;
	user: UserNested | null;
};

/** A reads file that makes up a sample. */
export type Read = {
	download_url: string;
	id: number;
	name: string;
	name_on_disk: string;
	sample: number;
	size: number;
	upload?: SampleReadUpload | null;
	uploaded_at: string;
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
	created_at: string;
	host: string;
	id: number;
	isolate: string;
	job?: SampleJobNested;
	labels: LabelNested[];
	library_type: LibraryType;
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
	all_read: boolean;
	all_write: boolean;
	artifacts: SampleArtifact[];
	format: string;
	group: GroupMinimal | null;
	group_read: boolean;
	group_write: boolean;
	hold: boolean;
	is_legacy: boolean;
	locale: string;
	paired: boolean;
	quality: Quality | null;
	reads: Read[];
	subtractions: SubtractionNested[];
};

/** A page of samples with pagination metadata. */
export type SampleSearchResult = {
	found_count: number;
	items: SampleMinimal[];
	page: number;
	page_count: number;
	per_page: number;
	total_count: number;
};

/** The rights fields that can be changed on a sample. */
export type SampleRightsUpdate = {
	all_read?: boolean;
	all_write?: boolean;
	group?: number | string | null;
	group_read?: boolean;
	group_write?: boolean;
};
