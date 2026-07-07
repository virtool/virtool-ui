import Box from "@base/Box";
import BoxGroup from "@base/BoxGroup";
import { Empty, EmptyMedia, EmptyTitle } from "@base/Empty";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import Pagination from "@base/Pagination";
import QueryError from "@base/QueryError";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import ViewHeaderTitleBadge from "@base/ViewHeaderTitleBadge";
import { CircleAlert } from "lucide-react";
import { useListHmms } from "../queries";
import { HmmInstall } from "./HmmInstall";
import HmmItem from "./HmmItem";
import HmmToolbar from "./HmmToolbar";

type HmmListProps = {
	find: string;
	page: number;
	setSearch: (next: { find?: string; page?: number }) => void;
};

/**
 * A list of HMMs with filtering options
 */
export default function HmmList({ find, page, setSearch }: HmmListProps) {
	const { data, isPending, isError } = useListHmms(page, 25, find);

	if (isError && !data) {
		return <QueryError noun="HMMs" />;
	}

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	const {
		items,
		page: storedPage,
		page_count,
		found_count,
		total_count,
		status,
	} = data;

	return (
		<div>
			<ViewHeader title="HMMs">
				<ViewHeaderTitle>
					HMMs{" "}
					{status.task?.complete && (
						<ViewHeaderTitleBadge>{found_count}</ViewHeaderTitleBadge>
					)}
				</ViewHeaderTitle>
			</ViewHeader>

			{total_count ? (
				<>
					<HmmToolbar
						term={find}
						onChange={(e) => setSearch({ find: e.target.value })}
					/>
					{items.length ? (
						<Pagination
							items={items}
							storedPage={storedPage}
							currentPage={page}
							pageCount={page_count}
							onPageChange={(page) => setSearch({ page })}
						>
							<BoxGroup>
								{items.map((item) => (
									<HmmItem key={item.id} hmm={item} />
								))}
							</BoxGroup>
						</Pagination>
					) : (
						<Box>
							<Empty orientation="horizontal">
								<EmptyMedia>
									<CircleAlert size={18} />
								</EmptyMedia>
								<EmptyTitle>No HMMs found</EmptyTitle>
							</Empty>
						</Box>
					)}
				</>
			) : (
				<HmmInstall />
			)}
		</div>
	);
}
