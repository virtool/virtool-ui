import Box from "@base/Box";
import BoxGroup from "@base/BoxGroup";
import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import Pagination from "@base/Pagination";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { useFindJobs } from "../queries";
import type { JobState } from "../types";
import { JobFilters } from "./Filters/JobFilters";
import JobItem from "./JobItem";

const initialState: JobState[] = ["pending", "running"];

type JobsListProps = {
	page?: number;
	setSearch?: (next: { page?: number; state?: JobState[] }) => void;
	states?: JobState[];
};

export default function JobsList({
	page = 1,
	setSearch = () => {},
	states = initialState,
}: JobsListProps) {
	const { data, isPending } = useFindJobs(page, 25, states);

	if (isPending || !data) {
		return <LoadingPlaceholder />;
	}

	const {
		items,
		page: storedPage,
		pageCount,
		counts,
		foundCount,
		totalCount,
	} = data;

	const emptyMessage =
		totalCount === 0
			? "No jobs found"
			: foundCount === 0
				? "No jobs matching filters"
				: null;

	return (
		<>
			<ViewHeader title="Jobs">
				<ViewHeaderTitle>Jobs</ViewHeaderTitle>
			</ViewHeader>
			<div className="flex gap-4">
				<ContainerNarrow>
					{emptyMessage ? (
						<Box className="flex items-center justify-center h-full text-gray-500">
							<h3 className="font-semibold">{emptyMessage}</h3>
						</Box>
					) : (
						<Pagination
							items={items}
							storedPage={storedPage}
							currentPage={page}
							pageCount={pageCount}
							onPageChange={(page) => setSearch({ page })}
						>
							<BoxGroup>
								{items.map((item) => (
									<JobItem key={item.id} {...item} />
								))}
							</BoxGroup>
						</Pagination>
					)}
				</ContainerNarrow>
				<JobFilters
					counts={counts}
					setStates={(state) => setSearch({ state })}
					states={states}
				/>
			</div>
		</>
	);
}
