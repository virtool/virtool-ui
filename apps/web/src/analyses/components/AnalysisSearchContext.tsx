import { createContext, type ReactNode, useContext } from "react";

/** The presentation and filter state an analysis viewer reads from the URL. */
export type AnalysisSearch = {
	activeHit?: string;
	filterIsolates?: boolean;
	filterOrfs?: boolean;
	filterOtus?: boolean;
	filterSequences?: boolean;
	find?: string;
	reads?: boolean;
	sortKey?: string;
	sortDirection?: "asc" | "desc";
	table?: boolean;
};

type AnalysisSearchContextValue = {
	search: AnalysisSearch;
	setSearch: (next: Partial<AnalysisSearch>) => void;
};

const AnalysisSearchContext = createContext<AnalysisSearchContextValue | null>(
	null,
);

type AnalysisSearchProviderProps = AnalysisSearchContextValue & {
	children: ReactNode;
};

export function AnalysisSearchProvider({
	children,
	search,
	setSearch,
}: AnalysisSearchProviderProps) {
	return (
		<AnalysisSearchContext value={{ search, setSearch }}>
			{children}
		</AnalysisSearchContext>
	);
}

export function useAnalysisSearch() {
	const value = useContext(AnalysisSearchContext);

	if (!value) {
		throw new Error("useAnalysisSearch must be used within an analysis route");
	}

	return value;
}
