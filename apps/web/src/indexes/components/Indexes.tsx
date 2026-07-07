import Box from "@base/Box";
import BoxGroup from "@base/BoxGroup";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyMedia,
	EmptyTitle,
} from "@base/Empty";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import Pagination from "@base/Pagination";
import QueryError from "@base/QueryError";
import Toolbar from "@base/Toolbar";
import {
	useCheckReferenceRight,
	useReferenceIsArchived,
} from "@references/hooks";
import { getRouteApi } from "@tanstack/react-router";
import { Inbox } from "lucide-react";
import { useFindIndexes } from "../queries";
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
	const { data, isPending, isError } = useFindIndexes(page, 25, refId);
	const { hasPermission: canBuild } = useCheckReferenceRight(refId, "build");
	const archived = useReferenceIsArchived(refId);

	if (isError && !data) {
		return <QueryError noun="indexes" />;
	}

	if (isPending) {
		return <LoadingPlaceholder />;
	}

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
				<Box>
					<Empty className="h-72">
						<EmptyMedia className="text-gray-400">
							<Inbox size={40} strokeWidth={1.5} />
						</EmptyMedia>
						<EmptyTitle>No indexes found</EmptyTitle>
						<EmptyDescription>
							{change_count > 0
								? "This reference has unbuilt changes."
								: "This reference has no indexes yet."}
						</EmptyDescription>
						{canBuildIndex && (
							<EmptyContent>
								<RebuildIndex refId={refId} />
							</EmptyContent>
						)}
					</Empty>
				</Box>
			)}
		</>
	);
}
