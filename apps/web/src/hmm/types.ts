import type { ServerTask } from "@tasks/types";

import type { SearchResult } from "@/types/api";

/** Minimal HMM used for resource listings */
export type HMMMinimal = {
	/** The unique identifier */
	id: number;
	cluster: number;
	count: number;
	families: { [key: string]: number };
	/** Names associated with the HMM */
	names: string[];
};

export type HMMSequenceEntry = {
	accession: string;
	gi: string;
	name: string;
	organism: string;
};

export type Hmm = HMMMinimal & {
	entries: Array<HMMSequenceEntry>;
	genera: { [key: string]: number };
	length: number;
	mean_entropy: number;
	total_entropy: number;
};

/** HMM search results from the API */
export type HmmSearchResults = SearchResult & {
	/** Gives information about each HMM */
	items: HMMMinimal[];
	/** The status of the HMMs */
	status: {
		errors: string[];
		installed: { ready: boolean } | null;
		task: ServerTask | null;
	};
};

/** Wire-shape HMM search results returned by the backend before the UI transform */
export type ServerHmmSearchResults = Omit<HmmSearchResults, "items"> & {
	documents: HMMMinimal[];
};
