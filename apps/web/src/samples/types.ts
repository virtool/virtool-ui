/**
 * Sample Types
 *
 * @remark
 * The sample wire shapes live in `@virtool/contracts`, where the server data
 * layer that produces them and the components that render them can both reach
 * them. They are re-exported here so the feature's call sites import from one
 * place. Client-only request shapes stay owned here.
 */

export type {
	LibraryType,
	Quality,
	Read,
	Sample,
	SampleArtifact,
	SampleMinimal,
	SampleRightsUpdate,
	SampleSearchResult,
	SampleWorkflows,
	WorkflowState,
} from "@virtool/contracts";

/* A Sample ID */
export type SampleID = {
	id: number;
};

/* A Sample with essential information */
export type SampleNested = SampleID & {
	name: string;
};

/** The fields sent to the API to create a sample */
export type CreateSampleRequest = {
	files: number[];
	group: string | null;
	host: string;
	isolate: string;
	labels: number[];
	libraryType: string;
	locale: string;
	name: string;
	subtractions: number[];
};

/** Fields that can be changed when updating a sample */
export type SampleUpdate = {
	isolate?: string;
	labels?: number[];
	locale?: string;
	name?: string;
	notes?: string;
	subtractions?: number[];
};
