import Box from "@base/Box";
import BoxGroup from "@base/BoxGroup";
import Button from "@base/Button";
import ContainerNarrow from "@base/ContainerNarrow";
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
import RebuildAlert from "@indexes/components/RebuildAlert";
import { useListOTUs } from "@otus/queries";
import {
	useCheckReferenceRight,
	useReferenceIsArchived,
} from "@references/hooks";
import { useFetchReference } from "@references/queries";
import { getRouteApi } from "@tanstack/react-router";
import { Inbox, SearchX } from "lucide-react";
import { useState } from "react";
import OtuCreate from "./OtuCreate";
import OtuItem from "./OtuItem";
import OtuToolbar from "./OtuToolbar";

const routeApi = getRouteApi("/_authenticated/refs/$refId/otus/");

type OtuListProps = {
	find: string;
	page: number;
	setSearch: (
		next: { find?: string; page?: number },
		options?: { replace?: boolean },
	) => void;
};

/**
 * A list of OTUs with filtering
 */
export default function OtuList({ find, page, setSearch }: OtuListProps) {
	const { refId } = routeApi.useParams();
	const [openCreate, setOpenCreate] = useState(false);
	const {
		data: reference,
		isPending: isPendingReference,
		isError: isErrorReference,
	} = useFetchReference(refId);
	const {
		data: otus,
		isPending: isPendingOTUs,
		isError: isErrorOTUs,
	} = useListOTUs(refId, page, 25, find);
	const { hasPermission: canModifyOtu } = useCheckReferenceRight(
		refId,
		"modify_otu",
	);
	const archived = useReferenceIsArchived(refId);

	if ((isErrorReference || isErrorOTUs) && (!reference || !otus)) {
		return <QueryError noun="OTUs" />;
	}

	if (isPendingOTUs || isPendingReference) {
		return <LoadingPlaceholder />;
	}

	const { items, page: storedPage, page_count } = otus;

	const canCreate = canModifyOtu && !reference.remotes_from && !archived;
	const isUnfilteredEmpty = !items.length && !find;

	return (
		<ContainerNarrow>
			<RebuildAlert page={page} refId={refId} />
			{!isUnfilteredEmpty && (
				<OtuToolbar
					term={find}
					setTerm={(find) => setSearch({ find, page: 1 }, { replace: true })}
					onCreate={() => setOpenCreate(true)}
					refId={refId}
					remotesFrom={reference.remotes_from}
				/>
			)}
			<OtuCreate open={openCreate} setOpen={setOpenCreate} refId={refId} />

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
							<OtuItem key={item.id} {...item} refId={refId} />
						))}
					</BoxGroup>
				</Pagination>
			) : (
				<Box>
					<Empty className="h-72">
						<EmptyMedia className="text-gray-400">
							{find ? (
								<SearchX size={40} strokeWidth={1.5} />
							) : (
								<Inbox size={40} strokeWidth={1.5} />
							)}
						</EmptyMedia>
						<EmptyTitle>No OTUs found</EmptyTitle>
						<EmptyDescription>
							{find
								? "No OTUs match your search."
								: "This reference has no OTUs yet."}
						</EmptyDescription>
						{isUnfilteredEmpty && canCreate && (
							<EmptyContent>
								<Button color="blue" onClick={() => setOpenCreate(true)}>
									Create OTU
								</Button>
							</EmptyContent>
						)}
					</Empty>
				</Box>
			)}
		</ContainerNarrow>
	);
}
