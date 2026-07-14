import ContainerNarrow from "@base/ContainerNarrow";
import ArchivedReferenceDetailHeader from "@references/components/Detail/ArchivedReferenceDetailHeader";
import ReferenceDetailHeader from "@references/components/Detail/ReferenceDetailHeader";
import ReferenceDetailTabs from "@references/components/Detail/ReferenceDetailTabs";
import { useFetchReference } from "@references/queries";
import {
	createFileRoute,
	notFound,
	Outlet,
	useMatches,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/refs/$refId")({
	loader: async ({ context: { queryClient }, params: { refId } }) => {
		const { referenceQueryOptions } = await import("@references/queries");

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
	const isOtuDetail = useMatches().some(
		(match) => match.routeId === "/_authenticated/refs/$refId/otus/$otuId",
	);

	if (!data) {
		return null;
	}

	return (
		<>
			{!isOtuDetail && (
				<>
					{data.archived ? (
						<ArchivedReferenceDetailHeader
							createdAt={data.created_at}
							detail={data}
							isRemote={Boolean(data.remotes_from)}
							name={data.name}
							userHandle={data.user.handle}
							refId={refId}
						/>
					) : (
						<ReferenceDetailHeader
							createdAt={data.created_at}
							detail={data}
							isRemote={Boolean(data.remotes_from)}
							name={data.name}
							userHandle={data.user.handle}
							refId={refId}
						/>
					)}
					<ReferenceDetailTabs id={refId} otuCount={data.otu_count} />
				</>
			)}

			<ContainerNarrow>
				<Outlet />
			</ContainerNarrow>
		</>
	);
}
