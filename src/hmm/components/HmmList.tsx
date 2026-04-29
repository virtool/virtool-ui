import BoxGroup from "@base/BoxGroup";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import Pagination from "@base/Pagination";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import ViewHeaderTitleBadge from "@base/ViewHeaderTitleBadge";
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
	const { data, isPending } = useListHmms(page, 25, find);

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
						<NoneFoundBox noun="HMMs" />
					)}
				</>
			) : (
				<HmmInstall />
			)}
		</div>
	);
}
