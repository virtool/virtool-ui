import QuickAnalyze from "@analyses/components/Create/QuickAnalyze";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import Pagination from "@base/Pagination";
import QueryError from "@base/QueryError";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import ViewHeaderTitleBadge from "@base/ViewHeaderTitleBadge";
import { useListIndexes } from "@indexes/queries";
import type { Label } from "@labels/types";
import { useListSamples } from "@samples/queries";
import type { SampleMinimal } from "@samples/types";
import { intersectionWith, union, xor } from "es-toolkit/array";
import { useState } from "react";
import SampleFilters from "./Filter/SampleFilters";
import SampleItem from "./Item/SampleItem";
import SampleToolbar from "./SamplesToolbar";
import SampleLabels from "./Sidebar/ManageLabels";

type SamplesListProps = {
	labels: Label[];
	filterLabels?: number[];
	page?: number;
	setSearch?: (next: {
		labels?: number[];
		page?: number;
		term?: string;
		workflows?: string[];
	}) => void;
	term?: string;
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
	workflows: filterWorkflows = [],
}: SamplesListProps) {
	const {
		data: samples,
		isPending: isPendingSamples,
		isError: isErrorSamples,
	} = useListSamples(urlPage, 25, term, filterLabels, filterWorkflows);
	const { isPending: isPendingIndexes, isError: isErrorIndexes } =
		useListIndexes({ ready: true });

	const [selected, setSelected] = useState<string[]>([]);
	const [openQuickAnalyze, setOpenQuickAnalyze] = useState(false);

	if ((isErrorSamples || isErrorIndexes) && !samples) {
		return <QueryError noun="samples" />;
	}

	if (isPendingSamples || isPendingIndexes) {
		return <LoadingPlaceholder />;
	}

	const { items, page, page_count, total_count } = samples;

	function renderRow(item: SampleMinimal) {
		function handleSelect() {
			setSelected(xor(selected, [item.id]));
		}

		function selectOnQuickAnalyze() {
			if (!selected.includes(item.id)) {
				setSelected(union(selected, [item.id]));
			}
		}

		return (
			<SampleItem
				key={item.id}
				sample={item}
				checked={selected.includes(item.id)}
				handleSelect={handleSelect}
				selectOnQuickAnalyze={selectOnQuickAnalyze}
				setOpenQuickAnalyze={setOpenQuickAnalyze}
			/>
		);
	}

	return (
		<>
			<QuickAnalyze
				open={openQuickAnalyze}
				onClear={() => setSelected([])}
				setOpen={setOpenQuickAnalyze}
				samples={intersectionWith(
					items,
					selected,
					(item, id) => item.id === id,
				)}
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
						setOpenQuickAnalyze={setOpenQuickAnalyze}
						term={term}
						onChange={(e) => setSearch({ term: e.target.value })}
					/>
				</div>
				<div className="row-start-2 min-w-xl">
					{!items.length ? (
						<NoneFoundBox key="noSample" noun="samples" />
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
				{selected.length ? (
					<SampleLabels
						labels={labels}
						selectedSamples={intersectionWith(
							items,
							selected,
							(item, id) => item.id === id,
						)}
					/>
				) : (
					<SampleFilters
						labels={labels}
						onClickLabels={(e) => setSearch({ labels: xor(filterLabels, [e]) })}
						selectedLabels={filterLabels}
						selectedWorkflows={filterWorkflows}
						onClickWorkflows={(workflows) => setSearch({ workflows })}
					/>
				)}
			</div>
		</>
	);
}
