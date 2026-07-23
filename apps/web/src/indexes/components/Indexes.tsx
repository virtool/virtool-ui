import BoxGroup from "@base/BoxGroup";
import ListEmpty from "@base/ListEmpty";
import Pagination from "@base/Pagination";
import Toolbar from "@base/Toolbar";
import {
	useCheckReferenceRight,
	useReferenceIsArchived,
} from "@references/hooks";
import { getRouteApi } from "@tanstack/react-router";
import { Inbox } from "lucide-react";
import { useSuspenseIndexes } from "../queries";
import { IndexItem } from "./Item/IndexItem";
import RebuildIndex from "./RebuildIndex";

const routeApi = getRouteApi("/_authenticated/refs/$refId/indexes/");

type IndexesProps = {
	page: number;
	setSearch: (next: { page?: number }) => void;
};

/**
 * Displays a list of reference indexes
 */
export default function Indexes({ page, setSearch }: IndexesProps) {
	const { refId } = routeApi.useParams();
	const referenceId = Number(refId);
	const { data } = useSuspenseIndexes(page, 25, refId);
	const { hasPermission: canBuild } = useCheckReferenceRight(
		referenceId,
		"build",
	);
	const archived = useReferenceIsArchived(referenceId);

	const { items, change_count, page: storedPage, page_count } = data;

	const canBuildIndex = !archived && canBuild && change_count > 0;

	return (
		<>
			{items.length > 0 && canBuildIndex && (
				<Toolbar>
					<div className="flex-grow" />
					<RebuildIndex refId={refId} />
				</Toolbar>
			)}
			{items.length ? (
				<Pagination
					storedPage={storedPage}
					currentPage={page}
					pageCount={page_count}
					onPageChange={(page) => setSearch({ page })}
				>
					<BoxGroup as="ul">
						{items.map((item) => (
							<IndexItem
								key={item.id}
								index={item}
								refId={refId}
								activeId={items.find((index) => index.ready)?.id}
							/>
						))}
					</BoxGroup>
				</Pagination>
			) : (
				<ListEmpty
					icon={Inbox}
					title="No indexes found"
					description={
						change_count > 0
							? "This reference has unbuilt changes."
							: "This reference has no indexes yet."
					}
				>
					{canBuildIndex && <RebuildIndex refId={refId} />}
				</ListEmpty>
			)}
		</>
	);
}
