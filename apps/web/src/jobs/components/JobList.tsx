import Box from "@base/Box";
import BoxGroup from "@base/BoxGroup";
import ContainerNarrow from "@base/ContainerNarrow";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@base/Empty";
import Pagination from "@base/Pagination";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { Cog, SearchX } from "lucide-react";
import { useSuspenseJobs } from "../queries";
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
	const { data } = useSuspenseJobs(page, 25, states);

	const {
		items,
		page: storedPage,
		pageCount,
		counts,
		foundCount,
		totalCount,
	} = data;

	const isEmpty = totalCount === 0 || foundCount === 0;
	const isFiltered = totalCount > 0 && foundCount === 0;

	return (
		<>
			<ViewHeader title="Jobs">
				<ViewHeaderTitle>Jobs</ViewHeaderTitle>
			</ViewHeader>
			<div className="flex gap-4">
				<ContainerNarrow>
					{isEmpty ? (
						<Box>
							<Empty className="h-72">
								<EmptyMedia className="text-gray-400">
									{isFiltered ? (
										<SearchX size={40} strokeWidth={1.5} />
									) : (
										<Cog size={40} strokeWidth={1.5} />
									)}
								</EmptyMedia>
								<EmptyTitle>No jobs found</EmptyTitle>
								<EmptyDescription>
									{isFiltered
										? "No jobs match your filters."
										: "No jobs have been run yet."}
								</EmptyDescription>
							</Empty>
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
