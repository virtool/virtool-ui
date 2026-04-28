import BoxGroup from "@base/BoxGroup";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import Pagination from "@base/Pagination";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import ViewHeaderTitleBadge from "@base/ViewHeaderTitleBadge";
import { useFindSubtractions } from "../queries";
import { SubtractionItem } from "./SubtractionItem";
import SubtractionToolbar from "./SubtractionToolbar";

type SubtractionListProps = {
	find?: string;
	openCreateSubtraction?: boolean;
	page?: number;
	setSearch?: (next: {
		find?: string;
		openCreateSubtraction?: boolean;
		page?: number;
	}) => void;
};

/**
 * A list of subtractions.
 */
export default function SubtractionList({
	find = "",
	openCreateSubtraction = false,
	page = 1,
	setSearch = () => {},
}: SubtractionListProps) {
	const { data, isPending } = useFindSubtractions(page, 25, find);

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	function handleChange(e) {
		setSearch({ find: e.target.value });
	}

	const { documents, total_count, page: storedPage, page_count } = data;

	return (
		<>
			<ViewHeader title="Subtractions">
				<ViewHeaderTitle>
					Subtractions{" "}
					<ViewHeaderTitleBadge>{total_count}</ViewHeaderTitleBadge>
				</ViewHeaderTitle>
			</ViewHeader>

			<SubtractionToolbar
				openCreate={openCreateSubtraction}
				setOpenCreate={(openCreateSubtraction) =>
					setSearch({ openCreateSubtraction })
				}
				term={find}
				handleChange={handleChange}
			/>

			{!documents.length ? (
				<NoneFoundBox key="subtractions" noun="subtractions" />
			) : (
				<Pagination
					items={documents}
					storedPage={storedPage}
					currentPage={page}
					pageCount={page_count}
					onPageChange={(page) => setSearch({ page })}
				>
					<BoxGroup>
						{documents.map((document) => (
							<SubtractionItem key={document.id} {...document} />
						))}
					</BoxGroup>
				</Pagination>
			)}
		</>
	);
}
