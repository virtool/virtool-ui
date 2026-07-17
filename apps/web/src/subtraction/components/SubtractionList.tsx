import Box from "@base/Box";
import BoxGroup from "@base/BoxGroup";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@base/Empty";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import Pagination from "@base/Pagination";
import QueryError from "@base/QueryError";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import ViewHeaderTitleBadge from "@base/ViewHeaderTitleBadge";
import { Scissors } from "lucide-react";
import { useFindSubtractions } from "../queries";
import { SubtractionItem } from "./SubtractionItem";
import SubtractionToolbar from "./SubtractionToolbar";

type SubtractionListProps = {
	find?: string;
	page?: number;
	setSearch?: (next: { find?: string; page?: number }) => void;
};

/**
 * A list of subtractions.
 */
export default function SubtractionList({
	find = "",
	page = 1,
	setSearch = () => {},
}: SubtractionListProps) {
	const { data, isPending, isError } = useFindSubtractions(page, 25, find);

	if (isError && !data) {
		return <QueryError noun="subtractions" />;
	}

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	const { items, total_count, page: storedPage, page_count } = data;

	return (
		<>
			<ViewHeader title="Subtractions">
				<ViewHeaderTitle>
					Subtractions{" "}
					<ViewHeaderTitleBadge>{total_count}</ViewHeaderTitleBadge>
				</ViewHeaderTitle>
			</ViewHeader>

			<SubtractionToolbar
				onChange={(find) => setSearch({ find })}
				term={find}
			/>

			{!items.length ? (
				<Box key="subtractions">
					<Empty className="h-72">
						<EmptyMedia className="text-gray-400">
							<Scissors size={40} strokeWidth={1.5} />
						</EmptyMedia>
						<EmptyTitle>No subtractions found</EmptyTitle>
						<EmptyDescription>
							No subtractions have been created yet.
						</EmptyDescription>
					</Empty>
				</Box>
			) : (
				<Pagination
					items={items}
					storedPage={storedPage}
					currentPage={page}
					pageCount={page_count}
					onPageChange={(page) => setSearch({ page })}
				>
					<BoxGroup>
						{items.map((item) => (
							<SubtractionItem key={item.id} {...item} />
						))}
					</BoxGroup>
				</Pagination>
			)}
		</>
	);
}
