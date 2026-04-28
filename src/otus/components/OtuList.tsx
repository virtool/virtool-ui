import BoxGroup from "@base/BoxGroup";
import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import Pagination from "@base/Pagination";
import RebuildAlert from "@indexes/components/RebuildAlert";
import { useListOTUs } from "@otus/queries";
import { useFetchReference } from "@references/queries";
import { getRouteApi } from "@tanstack/react-router";
import OtuCreate from "./OtuCreate";
import OtuItem from "./OtuItem";
import OtuToolbar from "./OtuToolbar";

const routeApi = getRouteApi("/_authenticated/refs/$refId/otus/");

type OtuListProps = {
	find: string;
	openCreateOTU: boolean;
	page: number;
	setSearch: (next: {
		find?: string;
		openCreateOTU?: boolean;
		page?: number;
	}) => void;
};

/**
 * A list of OTUs with filtering
 */
export default function OtuList({
	find,
	openCreateOTU,
	page,
	setSearch,
}: OtuListProps) {
	const { refId } = routeApi.useParams();
	const { data: reference, isPending: isPendingReference } =
		useFetchReference(refId);
	const { data: otus, isPending: isPendingOTUs } = useListOTUs(
		refId,
		page,
		25,
		find,
	);

	if (isPendingOTUs || isPendingReference) {
		return <LoadingPlaceholder />;
	}

	const { documents, page: storedPage, page_count } = otus;

	return (
		<ContainerNarrow>
			<RebuildAlert page={page} refId={refId} />
			<OtuToolbar
				term={find}
				onChange={(e) => setSearch({ find: e.target.value })}
				refId={refId}
				remotesFrom={reference.remotes_from}
			/>
			<OtuCreate
				open={openCreateOTU}
				setOpen={(openCreateOTU) => setSearch({ openCreateOTU })}
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
							<OtuItem key={document.id} {...document} refId={refId} />
						))}
					</BoxGroup>
				</Pagination>
			) : (
				<NoneFoundBox noun="OTUs" />
			)}
		</ContainerNarrow>
	);
}
