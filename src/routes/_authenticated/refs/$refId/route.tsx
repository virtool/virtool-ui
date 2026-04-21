import ContainerNarrow from "@base/ContainerNarrow";
import EditReference from "@references/components/Detail/EditReference";
import ReferenceDetailHeader from "@references/components/Detail/ReferenceDetailHeader";
import ReferenceDetailTabs from "@references/components/Detail/ReferenceDetailTabs";
import { referenceQueryOptions, useFetchReference } from "@references/queries";
import {
	createFileRoute,
	notFound,
	Outlet,
	useLocation,
} from "@tanstack/react-router";
import { z } from "zod/v4";

const refDetailSearchSchema = z.object({
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
	const { data } = useFetchReference(refId);
	const pathname = useLocation({ select: (l) => l.pathname });

	const isOtuDetail = /\/refs\/[^/]+\/otus\/[^/]+/.test(pathname);

	if (!data) {
		return null;
	}

	return (
		<>
			{!isOtuDetail && (
				<>
					<ReferenceDetailHeader
						createdAt={data.created_at}
						isRemote={Boolean(data.remotes_from)}
						name={data.name}
						userHandle={data.user.handle}
						refId={refId}
					/>
					<ReferenceDetailTabs id={refId} otuCount={data.otu_count} />
				</>
			)}

			<ContainerNarrow>
				<Outlet />
			</ContainerNarrow>

			<EditReference detail={data} />
		</>
	);
}
