import { createContext, type ReactNode, useContext } from "react";

type OtuDetailSearch = {
	activeIsolate?: string;
	editSegmentName?: string;
	editSequenceId?: string;
	openAddIsolate?: boolean;
	openAddSegment?: boolean;
	openCreateSequence?: boolean;
	openEditIsolate?: boolean;
	openEditOTU?: boolean;
	openRemoveIsolate?: boolean;
	openRemoveOTU?: boolean;
	removeSegmentName?: string;
	removeSequenceId?: string;
};

type OtuDetailSearchContextValue = {
	search: OtuDetailSearch;
	setSearch: (next: Partial<OtuDetailSearch>) => void;
};

const OtuDetailSearchContext =
	createContext<OtuDetailSearchContextValue | null>(null);

type OtuDetailSearchProviderProps = OtuDetailSearchContextValue & {
	children: ReactNode;
};

export function OtuDetailSearchProvider({
	children,
	search,
	setSearch,
}: OtuDetailSearchProviderProps) {
	return (
		<OtuDetailSearchContext value={{ search, setSearch }}>
			{children}
		</OtuDetailSearchContext>
	);
}

export function useOtuDetailSearch() {
	const value = useContext(OtuDetailSearchContext);

	if (!value) {
		throw new Error(
			"useOtuDetailSearch must be used within an OTU detail route",
		);
	}

	return value;
}
