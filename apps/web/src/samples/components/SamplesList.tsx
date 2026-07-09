import QuickAnalyze from "@analyses/components/Create/QuickAnalyze";
import Box from "@base/Box";
import Button from "@base/Button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyMedia,
	EmptyTitle,
} from "@base/Empty";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import Pagination from "@base/Pagination";
import QueryError from "@base/QueryError";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { useListIndexes } from "@indexes/queries";
import type { Label } from "@labels/types";
import { useListSamples } from "@samples/queries";
import type { SampleMinimal } from "@samples/types";
import { difference, intersectionWith, union, xor } from "es-toolkit/array";
import { FlaskConical, SearchX } from "lucide-react";
import { useState } from "react";
import FilterBar from "./Filter/FilterBar";
import SampleItem from "./Item/SampleItem";
import SampleListHeader from "./SampleListHeader";
import SampleToolbar from "./SamplesToolbar";

type QuickAnalyzeTarget = {
	/** Whether the samples came from the list selection rather than a single sample */
	fromSelection: boolean;

	samples: SampleMinimal[];
};

/**
 * Builds a value that changes whenever the filters narrowing the list change.
 * The ids are sorted so that reordering a filter alone doesn't count as one.
 */
function getFilterKey(
	term: string,
	labels: number[],
	workflows: string[],
	user?: number,
): string {
	return JSON.stringify([
		term,
		[...labels].sort((a, b) => a - b),
		[...workflows].sort(),
		user,
	]);
}

type SamplesListProps = {
	labels: Label[];
	filterLabels?: number[];
	page?: number;
	setSearch?: (next: {
		labels?: number[];
		page?: number;
		term?: string;
		user?: number;
		workflows?: string[];
	}) => void;
	term?: string;
	user?: number;
	workflows?: string[];
};

/**
 * A list of samples with filtering. Caller passes labels in.
 */
export default function SamplesList({
	labels,
	filterLabels = [],
	page: urlPage = 1,
	setSearch = () => {},
	term = "",
	user: filterUser,
	workflows: filterWorkflows = [],
}: SamplesListProps) {
	const {
		data: samples,
		isPending: isPendingSamples,
		isError: isErrorSamples,
	} = useListSamples(
		urlPage,
		25,
		term,
		filterLabels,
		filterWorkflows,
		filterUser,
	);
	const { isPending: isPendingIndexes, isError: isErrorIndexes } =
		useListIndexes({ ready: true });

	const [selected, setSelected] = useState<string[]>([]);
	const [openQuickAnalyze, setOpenQuickAnalyze] = useState(false);
	const [quickAnalyzeTarget, setQuickAnalyzeTarget] =
		useState<QuickAnalyzeTarget>({ fromSelection: false, samples: [] });

	// Selection survives pagination, but not a change to the filters: the ids
	// would otherwise linger unseen and re-check themselves if the user paged
	// back to them.
	const filterKey = getFilterKey(
		term,
		filterLabels,
		filterWorkflows,
		filterUser,
	);
	const [previousFilterKey, setPreviousFilterKey] = useState(filterKey);

	if (previousFilterKey !== filterKey) {
		setPreviousFilterKey(filterKey);
		setSelected([]);
	}

	// Held separately from ``selected`` so a row's quick analyze can ignore the
	// checkbox selection, and so the samples outlive the dialog's exit animation.
	function openQuickAnalyzeFor(target: QuickAnalyzeTarget) {
		setQuickAnalyzeTarget(target);
		setOpenQuickAnalyze(true);
	}

	if ((isErrorSamples || isErrorIndexes) && !samples) {
		return <QueryError noun="samples" />;
	}

	if (isPendingSamples || isPendingIndexes) {
		return <LoadingPlaceholder />;
	}

	const { found_count, items, page, page_count } = samples;

	// An empty list means "nothing created yet" only when nothing is narrowing
	// it. Otherwise the samples exist and the filters are hiding them.
	const isFiltered =
		Boolean(term) ||
		filterLabels.length > 0 ||
		filterWorkflows.length > 0 ||
		filterUser !== undefined;

	function clearFilters() {
		setSearch({
			labels: [],
			page: 1,
			term: "",
			user: undefined,
			workflows: [],
		});
	}

	const selectedSamples = intersectionWith(
		items,
		selected,
		(item, id) => item.id === id,
	);

	// Select-all reflects and acts on the current page only. The selection
	// itself survives pagination, so ids from other pages are left alone.
	const pageIds = items.map((item) => item.id);

	function getSelectAllState(): boolean | "indeterminate" {
		if (selectedSamples.length === 0) {
			return false;
		}

		return selectedSamples.length === items.length ? true : "indeterminate";
	}

	function handleSelectAll() {
		setSelected(
			selectedSamples.length === 0
				? union(selected, pageIds)
				: difference(selected, pageIds),
		);
	}

	function renderRow(item: SampleMinimal) {
		function handleSelect() {
			setSelected(xor(selected, [item.id]));
		}

		return (
			<SampleItem
				key={item.id}
				sample={item}
				checked={selected.includes(item.id)}
				handleSelect={handleSelect}
				onQuickAnalyze={() =>
					openQuickAnalyzeFor({ fromSelection: false, samples: [item] })
				}
			/>
		);
	}

	return (
		<>
			<QuickAnalyze
				fromSelection={quickAnalyzeTarget.fromSelection}
				open={openQuickAnalyze}
				setOpen={setOpenQuickAnalyze}
				samples={quickAnalyzeTarget.samples}
			/>
			<div
				className="grid gap-4"
				style={{
					gridTemplateColumns: "minmax(auto, 1150px) max(320px, 10%)",
				}}
			>
				<div className="col-start-1">
					<ViewHeader title="Samples">
						<ViewHeaderTitle>Samples</ViewHeaderTitle>
					</ViewHeader>
					<SampleToolbar
						term={term}
						onChange={(e) => setSearch({ term: e.target.value })}
					/>
					<FilterBar
						labels={labels}
						onClearLabels={() => setSearch({ labels: [] })}
						onClearTerm={() => setSearch({ term: "" })}
						onClearUser={() => setSearch({ user: undefined })}
						onClearWorkflows={() => setSearch({ workflows: [] })}
						onSelectUser={(userId) => setSearch({ user: userId })}
						onToggleLabel={(labelId) =>
							setSearch({ labels: xor(filterLabels, [labelId]) })
						}
						onToggleWorkflow={(workflow) =>
							setSearch({ workflows: xor(filterWorkflows, [workflow]) })
						}
						selectedLabels={filterLabels}
						selectedUser={filterUser}
						selectedWorkflows={filterWorkflows}
						term={term}
					/>
				</div>
				<div className="row-start-2 min-w-xl">
					{!items.length ? (
						<Box key="noSample">
							<Empty className="h-72">
								<EmptyMedia className="text-gray-400">
									{isFiltered ? (
										<SearchX size={40} strokeWidth={1.5} />
									) : (
										<FlaskConical size={40} strokeWidth={1.5} />
									)}
								</EmptyMedia>
								<EmptyTitle>
									{isFiltered ? "No matching samples" : "No samples"}
								</EmptyTitle>
								<EmptyDescription>
									{isFiltered
										? "No samples match the current filters."
										: "No samples have been created yet."}
								</EmptyDescription>
								{isFiltered && (
									<EmptyContent>
										<Button onClick={clearFilters} size="small">
											Clear filters
										</Button>
									</EmptyContent>
								)}
							</Empty>
						</Box>
					) : (
						<Pagination
							items={items}
							storedPage={page}
							currentPage={urlPage}
							header={
								<SampleListHeader
									checked={getSelectAllState()}
									found={found_count}
									labels={labels}
									onSelectAll={handleSelectAll}
									onQuickAnalyze={() =>
										openQuickAnalyzeFor({
											fromSelection: true,
											samples: selectedSamples,
										})
									}
									selectedSamples={selectedSamples}
								/>
							}
							renderRow={renderRow}
							pageCount={page_count}
							onPageChange={(page) => setSearch({ page })}
							rowsClassName="pb-0 rounded-sm border-1 border-gray-300 overflow-hidden [&>*:not(:first-child)]:border-t-1 [&>*:not(:first-child)]:border-gray-300"
						/>
					)}
				</div>
			</div>
		</>
	);
}
