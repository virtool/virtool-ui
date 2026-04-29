import type { UserNested } from "@users/types";

import type { SearchResult } from "../types/api";

/** Minimal HMM used for websocket messages and resource listings */
export type HMMMinimal = {
	/** The unique identifier */
	id: string;
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

export type HMMInstalled = {
	body: string;
	created_at: string;
	filename: string;
	html_url: string;
	id: number;
	name: string;
	newer: boolean;
	published: string;
	ready: boolean;
	size: number;
	user: UserNested;
};

/** HMM search results from the API */
export type HmmSearchResults = SearchResult & {
	/** Gives information about each HMM */
	items: HMMMinimal[];
	/** The status of the HMMs */
	status: { [key: string]: any };
};

/** Wire-shape HMM search results returned by the backend before the UI transform */
export type ServerHmmSearchResults = Omit<HmmSearchResults, "items"> & {
	documents: HMMMinimal[];
};
