import BoxGroup from "@base/BoxGroup";
import Button from "@base/Button";
import ContainerNarrow from "@base/ContainerNarrow";
import ListEmpty from "@base/ListEmpty";
import Pagination from "@base/Pagination";
import RebuildAlert from "@indexes/components/RebuildAlert";
import { useSuspenseOtus } from "@otus/queries";
import {
	useCheckReferenceRight,
	useReferenceIsArchived,
} from "@references/hooks";
import { useSuspenseReference } from "@references/queries";
import { getRouteApi } from "@tanstack/react-router";
import { Inbox, SearchX } from "lucide-react";
import { useState } from "react";
import OtuCreate from "./OtuCreate";
import OtuItem from "./OtuItem";
import OtuToolbar from "./OtuToolbar";

const routeApi = getRouteApi("/_authenticated/refs/$refId/otus/");

type OtuListProps = {
	term: string;
	page: number;
	setSearch: (
		next: { term?: string; page?: number },
		options?: { replace?: boolean },
	) => void;
};

/**
 * A list of OTUs with filtering
 */
export default function OtuList({ term, page, setSearch }: OtuListProps) {
	const { refId } = routeApi.useParams();
	const [openCreate, setOpenCreate] = useState(false);
	const { data: reference } = useSuspenseReference(refId);
	const { data: otus } = useSuspenseOtus(refId, page, 25, term);
	const { hasPermission: canModifyOtu } = useCheckReferenceRight(
		refId,
		"modify_otu",
	);
	const archived = useReferenceIsArchived(refId);

	const { items, page: storedPage, page_count } = otus;

	const canCreate = canModifyOtu && !reference.remotes_from && !archived;
	const isUnfilteredEmpty = !items.length && !term;

	return (
		<ContainerNarrow>
			<RebuildAlert page={page} refId={refId} />
			{!isUnfilteredEmpty && (
				<OtuToolbar
					term={term}
					setTerm={(term) => setSearch({ term, page: 1 }, { replace: true })}
					onCreate={() => setOpenCreate(true)}
					refId={refId}
					remotesFrom={reference.remotes_from}
				/>
			)}
			<OtuCreate open={openCreate} setOpen={setOpenCreate} refId={refId} />

			{items.length ? (
				<Pagination
					storedPage={storedPage}
					currentPage={page}
					pageCount={page_count}
					onPageChange={(page) => setSearch({ page })}
				>
					<BoxGroup as="ul">
						{items.map((item) => (
							<OtuItem key={item.id} {...item} refId={refId} />
						))}
					</BoxGroup>
				</Pagination>
			) : (
				<ListEmpty
					icon={term ? SearchX : Inbox}
					title="No OTUs found"
					description={
						term
							? "No OTUs match your search."
							: "This reference has no OTUs yet."
					}
				>
					{isUnfilteredEmpty && canCreate && (
						<Button color="blue" onClick={() => setOpenCreate(true)}>
							Create OTU
						</Button>
					)}
				</ListEmpty>
			)}
		</ContainerNarrow>
	);
}
