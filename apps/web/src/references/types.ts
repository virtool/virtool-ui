import type { ReferenceMinimal } from "@server/references/data";
import type { SearchResultV2 } from "@/types/api";

/**
 * The reference feature's list and detail wire shapes are defined once in the
 * server data layer and read straight off the server functions; they are
 * re-exported here so components can import them from the feature barrel.
 */
export type {
	ClonedFrom,
	ImportedFrom,
	Reference,
	ReferenceBuild,
	ReferenceContributor,
	ReferenceGroup,
	ReferenceMinimal,
	ReferenceRight,
	ReferenceRights,
	ReferenceUser,
} from "@server/references/data";

/** A page of references, using the camelCase {@link SearchResultV2} envelope. */
export type ReferenceSearchResult = SearchResultV2 & {
	items: ReferenceMinimal[];
};

/**
 * A reference reduced to the fields embedded in other resources (OTUs, indexes,
 * analyses, jobs). These still come from the Python API, so this shape keeps its
 * snake_case `data_type` and is owned here rather than by the server module.
 */
export type ReferenceNested = {
	id: number;
	data_type: string;
	name: string;
};
