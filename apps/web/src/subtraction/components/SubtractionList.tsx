import BoxGroup from "@base/BoxGroup";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import Pagination from "@base/Pagination";
import QueryError from "@base/QueryError";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import ViewHeaderTitleBadge from "@base/ViewHeaderTitleBadge";
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

	function handleChange(e) {
		setSearch({ find: e.target.value });
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

			<SubtractionToolbar term={find} handleChange={handleChange} />

			{!items.length ? (
				<NoneFoundBox key="subtractions" noun="subtractions" />
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
