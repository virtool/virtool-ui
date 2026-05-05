import ContainerNarrow from "@base/ContainerNarrow";
import ArchiveReference from "@references/components/Detail/ArchiveReference";
import EditReference from "@references/components/Detail/EditReference";
import ReferenceDetailHeader from "@references/components/Detail/ReferenceDetailHeader";
import ReferenceDetailTabs from "@references/components/Detail/ReferenceDetailTabs";
import { referenceQueryOptions, useFetchReference } from "@references/queries";
import {
	createFileRoute,
	notFound,
	Outlet,
	useMatches,
	useNavigate,
} from "@tanstack/react-router";
import { z } from "zod/v4";

const refDetailSearchSchema = z.object({
	openArchiveReference: z.boolean().optional().catch(undefined),
	openEditReference: z.boolean().optional().catch(undefined),
});

export const Route = createFileRoute("/_authenticated/refs/$refId")({
	validateSearch: refDetailSearchSchema,
	loader: async ({ context: { queryClient }, params: { refId } }) => {
		try {
			await queryClient.ensureQueryData(referenceQueryOptions(refId));
		} catch (error) {
			if (error?.response?.status === 404) {
				throw notFound();
			}
			throw error;
		}
	},
	component: ReferenceDetailLayout,
});

function ReferenceDetailLayout() {
	const { refId } = Route.useParams();
	const search = Route.useSearch();
	const navigate = useNavigate();
	const { data } = useFetchReference(refId);
	const isOtuDetail = useMatches().some(
		(match) => match.routeId === "/_authenticated/refs/$refId/otus/$otuId",
	);

	if (!data) {
		return null;
	}

	function setOpenArchiveReference(openArchiveReference: boolean) {
		navigate({
			search: ((prev: Record<string, unknown>) => ({
				...prev,
				openArchiveReference,
			})) as never,
		});
	}

	function setOpenEditReference(openEditReference: boolean) {
		navigate({
			search: ((prev: Record<string, unknown>) => ({
				...prev,
				openEditReference,
			})) as never,
		});
	}

	return (
		<>
			{!isOtuDetail && (
				<>
					<ReferenceDetailHeader
						archived={data.archived}
						createdAt={data.created_at}
						isRemote={Boolean(data.remotes_from)}
						name={data.name}
						setOpenArchiveReference={setOpenArchiveReference}
						setOpenEditReference={setOpenEditReference}
						userHandle={data.user.handle}
						refId={refId}
					/>
					<ReferenceDetailTabs id={refId} otuCount={data.otu_count} />
				</>
			)}

			<ContainerNarrow>
				<Outlet />
			</ContainerNarrow>

			<EditReference
				detail={data}
				open={Boolean(search.openEditReference)}
				setOpen={setOpenEditReference}
			/>

			<ArchiveReference
				detail={data}
				open={Boolean(search.openArchiveReference)}
				setOpen={setOpenArchiveReference}
			/>
		</>
	);
}
