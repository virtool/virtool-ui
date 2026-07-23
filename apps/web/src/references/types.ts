/**
 * The reference wire shapes live in `@virtool/contracts`, where the server data
 * layer that produces them and the components that render them can both reach
 * them. They are re-exported here so the feature's call sites import from one
 * place.
 */
export type {
	Reference,
	ReferenceBuild,
	ReferenceGroup,
	ReferenceMinimal,
	ReferenceRight,
	ReferenceRights,
	ReferenceSearchResult,
	ReferenceUpdateRequest,
	ReferenceUser,
} from "@virtool/contracts";

/**
 * A reference reduced to the fields embedded in other resources (OTUs, indexes,
 * analyses, jobs). These still come from the Python API, so this shape keeps its
 * snake_case `data_type` and is owned here rather than by the contract.
 */
export type ReferenceNested = {
	id: number;
	data_type: string;
	name: string;
};
