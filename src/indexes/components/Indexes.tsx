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

	const { documents, page: storedPage, page_count } = data;

	return (
		<>
			<RebuildAlert page={page} refId={refId} />
			<RebuildIndex
				open={openRebuild}
				setOpen={(openRebuild) => setSearch({ openRebuild })}
				refId={refId}
			/>
			{documents.length ? (
				<Pagination
					items={documents}
					storedPage={storedPage}
					currentPage={page}
					pageCount={page_count}
					onPageChange={(page) => setSearch({ page })}
				>
					<BoxGroup>
						{documents.map((document) => (
							<IndexItem
								key={document.id}
								index={document}
								refId={refId}
								activeId={
									documents.find((doc) => doc.ready && doc.has_files)?.id
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
