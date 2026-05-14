import BoxGroup from "@base/BoxGroup";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import Pagination from "@base/Pagination";
import { getRouteApi } from "@tanstack/react-router";
import { useFindIndexes } from "../queries";
import { IndexItem } from "./Item/IndexItem";
import RebuildAlert from "./RebuildAlert";
import RebuildIndex from "./RebuildIndex";

const routeApi = getRouteApi("/_authenticated/refs/$refId/indexes/");

type IndexesProps = {
	openRebuild: boolean;
	page: number;
	setSearch: (next: { openRebuild?: boolean; page?: number }) => void;
};

/**
 * Displays a list of reference indexes
 */
export default function Indexes({
	openRebuild,
	page,
	setSearch,
}: IndexesProps) {
	const { refId } = routeApi.useParams();
	const { data, isPending } = useFindIndexes(page, 25, refId);

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	const { items, page: storedPage, page_count } = data;

	return (
		<>
			<RebuildAlert page={page} refId={refId} />
			<RebuildIndex
				open={openRebuild}
				setOpen={(openRebuild) => setSearch({ openRebuild })}
				refId={refId}
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
							<IndexItem
								key={item.id}
								index={item}
								refId={refId}
								activeId={
									items.find((index) => index.ready && index.has_files)?.id
								}
							/>
						))}
					</BoxGroup>
				</Pagination>
			) : (
				<NoneFoundBox noun="indexes" />
			)}
		</>
	);
}
