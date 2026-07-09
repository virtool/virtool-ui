import QuickAnalyze from "@analyses/components/Create/QuickAnalyze";
import Box from "@base/Box";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@base/Empty";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import Pagination from "@base/Pagination";
import QueryError from "@base/QueryError";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import ViewHeaderTitleBadge from "@base/ViewHeaderTitleBadge";
import { useListIndexes } from "@indexes/queries";
import type { Label } from "@labels/types";
import { useListSamples } from "@samples/queries";
import type { SampleMinimal } from "@samples/types";
import { intersectionWith, xor } from "es-toolkit/array";
import { FlaskConical, SearchX } from "lucide-react";
import { useState } from "react";
import FilterBar from "./Filter/FilterBar";
import SampleItem from "./Item/SampleItem";
import SampleToolbar from "./SamplesToolbar";
import SampleLabels from "./Sidebar/ManageLabels";

type QuickAnalyzeTarget = {
	/** Whether the samples came from the list selection rather than a single sample */
	fromSelection: boolean;

	samples: SampleMinimal[];
};

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

	const { items, page, page_count, total_count } = samples;

	const selectedSamples = intersectionWith(
		items,
		selected,
		(item, id) => item.id === id,
	);

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
						<ViewHeaderTitle>
							Samples <ViewHeaderTitleBadge>{total_count}</ViewHeaderTitleBadge>
						</ViewHeaderTitle>
					</ViewHeader>
					<SampleToolbar
						selected={selected}
						onClear={() => setSelected([])}
						onQuickAnalyze={() =>
							openQuickAnalyzeFor({
								fromSelection: true,
								samples: selectedSamples,
							})
						}
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
									{term ? (
										<SearchX size={40} strokeWidth={1.5} />
									) : (
										<FlaskConical size={40} strokeWidth={1.5} />
									)}
								</EmptyMedia>
								<EmptyTitle>No samples found</EmptyTitle>
								<EmptyDescription>
									{term
										? "No samples match your search."
										: "No samples have been created yet."}
								</EmptyDescription>
							</Empty>
						</Box>
					) : (
						<Pagination
							items={items}
							storedPage={page}
							currentPage={urlPage}
							renderRow={renderRow}
							pageCount={page_count}
							onPageChange={(page) => setSearch({ page })}
						/>
					)}
				</div>
				{selected.length > 0 && (
					<SampleLabels labels={labels} selectedSamples={selectedSamples} />
				)}
			</div>
		</>
	);
}
